import React, { useEffect } from "react";
import { socket, getCurrentTimeInIndianFormat } from "../Modals/Loading";
import { useParams } from "react-router-dom";
import { useState, useRef } from "react";
import toast from "react-hot-toast";
import ResultModal from "./ResultModal";
import "./Room.css";
import ShootingStars from "./ShootingStars";
const Room = () => {
  const { id } = useParams();
  const [gameData, setGameData] = useState(null);
  const [symbol, setSymbol] = useState("X");
  const [gameResult, setGameResult] = useState(null);
  const messListRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [MsgCount, setMsgCount] = useState(0);
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    socket.on("room-created", updateBoard);
    socket.on("update-board", updateBoard);
    socket.on("respond-to-play-again", playAgainResponse);
    socket.off("play-again-request-accepted");

    socket.on("receive-message-from-room", (arr) => {
      if (!toggle && arr.id !== socket.id) {
        setMsgCount((pre) => pre + 1);
      }
      if (toggle) {
        setMsgCount(0);
      }
      setMessages((prev) => [...prev, arr]);
      messListRef.current?.lastChild?.scrollIntoView();
    });

    return () => {
      socket.off("room-created");
      socket.off("update-board");
      socket.off("respond-to-play-again");
      socket.off("receive-message-from-room");
    };
  });

  function playAgainResponse(id, roomId) {
    const message = `Player ${id} has invited you to play again in the same room (Room ID: ${roomId}). Would you like to play again?`;

    const play = window.confirm(message);
    if (play === true) {
      console.log("hello");
      socket.emit("response-to-play-again", roomId, true, socket.id);
    } else {
      socket.emit("response-to-play-again", roomId, false, socket.id);
    }
  }
  function playAgainAcceptedReply(roomId, recipient) {
    alert(`Your request was accepted by ${recipient} and room id is ${roomId}`);
    socket.off("play-again-request-accepted");
  }
  const updateBoard = (data) => {
    if (!data) return;
    setGameData(data);

    if (data.currentPlayer === socket.id) {
      toast.success("It's your turn!", {
        position: "top-center",
        duration: 1500,
        style: {
          background: "#4CAF50",
          color: "#fff",
        },
      });
    } else {
      toast("It's opponents turn", {
        position: "top-center",
        duration: 1500,
        style: {
          background: "#2196F3",
          color: "#fff",
        },
        icon: "⏳",
      });
    }

    if (data.gameWon) {
      setGameResult(
        `${data.gameWon === socket.id ? "You" : "Opponent"} won the match!`
      );
    } else if (data.gameDraw) {
      setGameResult("The game ended in a draw.");
    }
  };

  const handleToggle = () => {
    const newSymbol = symbol === "X" ? "O" : "X";
    setSymbol(newSymbol);
  };

  function makeMove(index) {
    if (gameData && !gameData.gameOver) {
      socket.emit("make-move", gameData.roomId, index, socket.id);
    }
  }

  const restartGame = () => {
    if (gameData) {
      socket.emit("restart-game", gameData, socket?.id);
      socket.on("play-again-request-accepted", playAgainAcceptedReply);
    } else {
      alert("Game Cleared..");
    }
  };

  function sendMessage(message) {
    if (message.trim() === "") return;
    socket.emit(
      "send-message-to-room",
      message,
      getCurrentTimeInIndianFormat(),
      socket.id,
      gameData.roomId
    );
  }

  return (
    // <div className="RoomMainContainer">
    //   <div className="RoomCodeContainer">
    //     <span>Room Code: {id}</span>
    //   </div>
    //   {gameData && (
    //     <>
    //       <p>Toggle Symbol:</p>
    //       <button onClick={handleToggle}>Change Symbol</button>
    //       <p>Your Symbol: {symbol}</p>
    //       <p className="game-status">
    //         {gameData && gameData.gameOver
    //           ? "Match Over"
    //           : gameData.currentPlayer === socket.id
    //           ? "Your Turn"
    //           : "Opponent's Turn"}
    //       </p>
    //       <div className="game-board">
    //         <div className="player-info">
    //           <p className={gameData.player1 === socket.id ? "me" : "opponent"}>
    //             {gameData.player1 === socket.id
    //               ? `You-> ${gameData.player1}`
    //               : `Opponent-> ${gameData.player1}`}
    //           </p>
    //           <p>V⚡S</p>
    //           <p className={gameData.player2 === socket.id ? "me" : "opponent"}>
    //             {gameData.player2 === socket.id
    //               ? `You-> ${gameData.player2}`
    //               : `Opponent-> ${gameData.player2}`}
    //           </p>
    //         </div>
    //         <div className="board">
    //           {gameData.board.map((cell, index) => (
    //             <div
    //               key={index}
    //               className="cell"
    //               onClick={() => makeMove(index)}
    //               disabled={cell !== "" || gameData.currentPlayer !== socket.id}
    //             >
    //               {cell === ""
    //                 ? ""
    //                 : cell === socket.id
    //                 ? symbol
    //                 : symbol === "X"
    //                 ? "O"
    //                 : "X"}
    //             </div>
    //           ))}
    //         </div>

    //         {gameResult && <div className="game-result">{gameResult}</div>}
    //       </div>

    //       {gameData.gameOver && (
    //         <button onClick={restartGame} className="restart-button">
    //           Play Again
    //         </button>
    //       )}
    //     </>
    //   )}

    //   {/* <div className="GridContainer">
    //     <div class="box box1">X</div>
    //     <div class="box box2">X</div>
    //     <div class="box box3">O</div>
    //     <div class="box box4">O</div>
    //     <div class="box box5">X</div>
    //     <div class="box box6">O</div>
    //     <div class="box box7">X</div>
    //     <div class="box box8">X</div>
    //     <div class="box box9">O</div>
    //   </div> */}

    //   {/* <div className="PlayerText">
    //     <p>Opponent: {"Allen Sir"}</p>
    //   </div> */}

    //   {/* <div>{"Winner"}</div> */}
    //   <ShootingStars />
    // </div>
    <>
      {gameResult && (
        <ResultModal
          show={true}
          result={gameResult}
          onHide={() => setGameResult(null)}
        />
      )}
      <div className="start-game-container">
        <div className="rightbar">
          <div className="RoomCodeContainer">
            <span>Room Code: {id}</span>
          </div>
          {gameData && (
            <>
              {/* <p className="game-status">
              {gameData && gameData.gameOver
                ? "Match Over"
                : gameData.currentPlayer === socket.id
                ? "Your Turn"
                : "Opponent's Turn"}
            </p> */}
              <div className="game-board">
                {/* <div className="player-info">
                  <p
                    className={
                      gameData.player1 === socket.id ? "me" : "opponent"
                    }
                  >
                    {gameData.player1 === socket.id
                      ? `You-> ${gameData.player1}`
                      : `Opponent-> ${gameData.player1}`}
                  </p>
                  <p style={{ margin: "0px" }}>V⚡S</p>
                  <p
                    className={
                      gameData.player2 === socket.id ? "me" : "opponent"
                    }
                  >
                    {gameData.player2 === socket.id
                      ? `You-> ${gameData.player2}`
                      : `Opponent-> ${gameData.player2}`}
                  </p>
                </div> */}
                <div className="player-info-container">
                  <div className="player">
                    <div
                      className={`avatar ${
                        gameData.player1 === socket.id ? "me" : ""
                      }`}
                    >
                      {"A"}
                    </div>

                    <div className="name">
                      {gameData.player1 === socket.id
                        ? "You"
                        : "Opponent"}
                    </div>
                  </div>

                  <div className="vs">V⚡S</div>

                  <div className="player">
                    <div
                      className={`avatar ${
                        gameData.player2 === socket.id ? "me" : ""
                      }`}
                    >
                      {"B"}
                    </div>

                    <div className="name">
                      {gameData.player2 === socket.id
                        ? "You"
                        : gameData.player2}
                    </div>
                  </div>
                </div>
                <div className="GridContainer">
                  {gameData.board.map((cell, index) => (
                    <div
                      key={index}
                      className={`box box${index}`}
                      onClick={() => makeMove(index)}
                      disabled={
                        cell !== "" || gameData.currentPlayer !== socket.id
                      }
                    >
                      {cell === ""
                        ? ""
                        : cell === socket.id
                        ? symbol
                        : symbol === "X"
                        ? "O"
                        : "X"}
                    </div>
                  ))}
                </div>

                {/* {gameResult && <div className="game-result">{gameResult}</div>} */}
              </div>

              {gameData.gameOver && (
                <button onClick={restartGame} className="restart-button">
                  Play Again
                </button>
              )}
            </>
          )}
        </div>
        {/* {gameData && !loadingText && (
        <div className="leftBar">
          <button
            onClick={() => {
              setMsgCount(0);
              setToggle(!toggle);
            }}
          >
            💬 {MsgCount !== 0 && <p className="badge">{MsgCount}</p>}
          </button>

          <button id="playAgainButton">🔃</button>
          <button id="exitButton">❌</button>
        </div>
      )}

      {toggle && (
        <MessagePop
          messageList={messages}
          sendMessage={sendMessage}
          id={socket.id}
          roomId={gameData.roomId}
          messListRef={messListRef}
        />
      )} */}
      </div>
    </>
  );
};

export default Room;
