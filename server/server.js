const { Server } = require("socket.io");

const io = new Server(5000, {
  cors: {
    origin: "http://localhost:3000",
  },
});
function generateUniqueRoomId() {
  return Math.random().toString(36).substring(7);
}
const onlineFriends = new Set();
const rooms = new Map();

function initializeTicTacToeBoard(roomId) {
  const gameData = {
    player1: "",
    player2: "",
    board: ["", "", "", "", "", "", "", "", ""],
    currentPlayer: "",
    gameWon: "",
    gameOver: false,
    gameDraw: false,
    roomId: roomId,
  };
  console.log(rooms.get(roomId));
  gameData.player1 = rooms.get(roomId).requester;
  gameData.player2 = rooms.get(roomId).recipient;
  gameData.currentPlayer = gameData.player1;

  return gameData;
}
function checkWin(board, player) {
  const winCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (const combination of winCombinations) {
    const [a, b, c] = combination;
    if (board[a] === player && board[b] === player && board[c] === player) {
      return true;
    }
  }

  return false;
}

function checkDraw(board) {
  return board.every((cell) => cell !== "");
}

io.on("connection", (socket) => {
  try {
    socket.on("find-friends", () => {
      const id = socket.id;
      onlineFriends.add(id);
      console.log("online friends", onlineFriends);
      onlineFriends.forEach((targetSocketID) => {
        io.to(targetSocketID).emit(
          "updateLobby",
          [...onlineFriends].filter((id) => id !== targetSocketID)
        );
      });
    });

    socket.on("go-offline", (id) => {
      console.log(`An user went offline ${id} 😥`);
      onlineFriends.delete(id);
      startInterval();
    });

    socket.on("send-room-request", (requester, recipient) => {
      try {
        const requestId = generateUniqueRoomId();
        rooms.set(requestId, {
          requester,
          recipient,
          gameStarted: false,
          messages: [],
        });
        io.to(recipient).emit("room-request", requestId, requester);
      } catch (error) {
        console.log("Error while sending room request", error);
      }
    });

    socket.on("respond-to-room-request", (requestId, accept) => {
      try {
        if (rooms.has(requestId)) {
          const { requester, recipient } = rooms.get(requestId);
          if (accept) {
            io.to(requester).emit("req-accepted", requestId, recipient);
            rooms.get(requestId).gameStarted = true;

            const gameData = initializeTicTacToeBoard(requestId);

            rooms.get(requestId).game = gameData;

            io.to(requester).to(recipient).emit("room-created", gameData);
          } else {
            rooms.delete(requestId);
          }
        }
      } catch (error) {
        console.log("Error in responding to a room request", error);
      }
    });
    socket.on("make-move", (roomId, cellIndex, playerId) => {
      try {
        const game = rooms.get(roomId)?.game;
        if (
          game &&
          !game.gameOver &&
          game.currentPlayer === playerId &&
          game.board[cellIndex] === ""
        ) {
          game.board[cellIndex] = playerId;
          const win = checkWin(game.board, playerId);
          const draw = checkDraw(game.board);
          if (win) {
            game.gameWon = playerId;
            game.gameOver = true;
          } else if (draw) {
            game.gameDraw = true;
            game.gameOver = true;
          } else {
            game.currentPlayer =
              game.currentPlayer === game.player1 ? game.player2 : game.player1;
          }
          io.to(game.player1).to(game.player2).emit("update-board", game);
        }
      } catch (error) {
        console.log("Error making move: ", error);
      }
    });

    socket.on("restart-game", (game, id) => {
      try {
        if (!game || !rooms.get(game.roomId)) return;
        console.log(`restarted the game by ${id}`);
        const { requester, recipient } = rooms.get(game?.roomId);

        io.to(requester !== id ? requester : recipient).emit(
          "respond-to-play-again",
          id,
          game.roomId
        );
      } catch (error) {
        console.log("Error restarting game: ", error);
      }
    });
    socket.on("response-to-play-again", (roomId, accept, id) => {
      try {
        console.log(
          `player reponse has been accpeted .. ${roomId} ${accept} ${id}`
        );
        if (rooms.has(roomId)) {
          const { requester, recipient } = rooms.get(roomId);

          if (accept) {
            io.to(requester !== id ? requester : recipient).emit(
              "play-again-request-accepted",
              roomId,
              requester !== id ? requester : recipient
            );
            const newGame = initializeTicTacToeBoard(roomId);
            rooms.get(roomId).game = newGame;
            io.to(requester).to(recipient).emit("room-created", newGame);
          } else {
            io.to(requester !== id ? requester : recipient).emit(
              "play-again-request-accepted",
              false,
              requester !== id ? requester : recipient
            );
            if (roomId) rooms.delete(roomId);
          }
        }
      } catch (error) {
        console.log("Error responding to play again: ", error);
      }
    });
    socket.on("send-message-to-room", (message, time, senderId, roomId) => {
      try {
        if (rooms.has(roomId)) {
          const newMessage = {
            text: message,
            time,
            id: senderId,
          };
          console.log(newMessage);
          rooms.get(roomId).messages.push(newMessage);
          const { requester, recipient } = rooms.get(roomId);
          io.to(requester)
            .to(recipient)
            .emit("receive-message-from-room", newMessage);

          console.log(rooms.get(roomId).messages);
        }
      } catch (error) {
        console.log("Error sending message to room: ", error);
      }
    });

    socket.on("leave-lobby", (id) => {
      try {
        console.log(`socket id ${id} left the server`);
        onlineFriends.delete(id);
        onlineFriends.forEach((targetSocketID) => {
          io.to(targetSocketID).emit(
            "updateLobby",
            [...onlineFriends].filter((id) => id !== targetSocketID)
          );
        });
      } catch (error) {
        console.log("Error leaving lobby: ", error);
      }
    });
  } catch (error) {
    console.log("Server Error: ", error);
  }
});
