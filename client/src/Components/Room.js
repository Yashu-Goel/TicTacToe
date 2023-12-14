import React, { useEffect } from "react";
import { socket, getCurrentTimeInIndianFormat } from "../Modals/Loading";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import toast from "react-hot-toast";
import ResultModal from "./ResultModal";
import "./Room.css";
import ShootingStars from "./ShootingStars";
import MessagePop from "./MessagePop";
import PlayAgainModalResp from "./PlayAgainModalResp";
const Room = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [gameData, setGameData] = useState(null);
  const [symbol, setSymbol] = useState("X");
  const [gameResult, setGameResult] = useState(null);

  // states for only play again response modal
  const [roomId, setRoomId] = useState(null);
  const [playAgainRespModal, setPlayAgainRespModal] = useState(false);
  const [requesterId, setRequesterId] = useState(null);

  const messListRef = useRef(null);
  const [Loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([]);
  const [MsgCount, setMsgCount] = useState(0);
  const [toggle, setToggle] = useState(false);
  const sampleMessages = [
    { text: "Hello!", time: "10:00 AM", sender: "sender" },
    { text: "How are you?", time: "10:05 AM", sender: "receiver" },
    {
      text: "I'm good, tha hhd h dh dh dh dh  hh h  hbhbh jnjnjnjnj hbhdbsh njnhnnks!",
      time: "10:10 AM",
      sender: "sender",
    },
    { text: "Hello!", time: "10:00 AM", sender: "sender" },
    { text: "How are you?", time: "10:05 AM", sender: "receiver" },
    { text: "I'm good, thanks!", time: "10:10 AM", sender: "sender" },
    { text: "Hello!", time: "10:00 AM", sender: "sender" },
    { text: "How are you?", time: "10:05 AM", sender: "receiver" },
    {
      text: "I'm good, tha hhd h dh dh dh dh  hh h  hbhbh jnjnjnjnj hbhdbsh njnhnnks!",
      time: "10:10 AM",
      sender: "sender",
    },
    { text: "Hello!", time: "10:00 AM", sender: "sender" },
    { text: "How are you?", time: "10:05 AM", sender: "receiver" },
    { text: "I'm good, thanks!", time: "10:10 AM", sender: "sender" },
    { text: "Hello!", time: "10:00 AM", sender: "sender" },
    { text: "How are you?", time: "10:05 AM", sender: "receiver" },
    {
      text: "I'm good, tha hhd h dh dh dh dh  hh h  hbhbh jnjnjnjnj hbhdbsh njnhnnks!",
      time: "10:10 AM",
      sender: "sender",
    },
    { text: "Hello!", time: "10:00 AM", sender: "sender" },
    { text: "How are you?", time: "10:05 AM", sender: "receiver" },
    { text: "I'm good, thanks!", time: "10:10 AM", sender: "sender" },
    { text: "Hello!", time: "10:00 AM", sender: "sender" },
    { text: "How are you?", time: "10:05 AM", sender: "receiver" },
    {
      text: "I'm good, tha hhd h dh dh dh dh  hh h  hbhbh jnjnjnjnj hbhdbsh njnhnnks!",
      time: "10:10 AM",
      sender: "sender",
    },
    { text: "Hello!", time: "10:00 AM", sender: "sender" },
    { text: "How are you?", time: "10:05 AM", sender: "receiver" },
    { text: "I'm good, thanks!", time: "10:10 AM", sender: "sender" },
  ];

  useEffect(() => {
    socket.on("room-created", (data) => {
      setGameResult(null);
      setGameData(null);
      updateBoard(data);
    });
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
      setLoading(false);
    };
  });

  function playAgainResponse(id, roomId) {
    setGameResult(null);
    setGameData(null);
    setRoomId(roomId);
    setRequesterId(id);
    setPlayAgainRespModal(true);
  }
  function playAgainAcceptedReply(roomId, recipient) {
    setGameResult(null);
    setPlayAgainRespModal(false);

    if (!roomId) {
      // toast.error;
      toast.error("Your request was declined..");
      navigate("/find_friends");
      return;
    }

    const message = (
      <div style={{ textAlign: "center" }}>
        <p style={{ margin: "0", fontSize: "16px" }}>
          Your request was accepted by <br /> <strong>✅ {recipient}</strong>.
        </p>
        <p style={{ margin: "0", fontSize: "16px" }}>
          Room ID is <strong>{roomId}</strong>.
        </p>
      </div>
    );
    toast(message, {
      duration: 2000,
    });
    socket.off("play-again-request-accepted");
  }
  const updateBoard = (data) => {
    if (!data) return;
    setGameData(data);

    if (data.currentPlayer === socket.id && data?.gameOver && data?.gameWon) {
      toast.success("It's your turn!", {
        position: "top-center",
        duration: 1500,
        style: {
          background: "#4CAF50",
          color: "#fff",
        },
      });
    } else if (
      data.currentPlayer !== socket.id &&
      data?.gameOver &&
      data?.gameWon
    ) {
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
    setLoading(true);
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
    <>
      <div className="RoomMainContainer">
        {gameResult && (
          <ResultModal
            show={true}
            result={gameResult}
            data={gameData}
            onHide={() => setGameResult(null)}
            restartGame={restartGame}
            Loading={Loading}
          />
        )}
        {playAgainRespModal && (
          <PlayAgainModalResp
            show={true}
            roomId={roomId}
            id={requesterId}
            onHide={() => setPlayAgainRespModal(null)}
          />
        )}
        <div className="RoomCodeContainer">
          <span>Room Code: {id}</span>
        </div>
        <div className="start-game-container">
          <div className="rightbar">
            {gameData && (
              <>
                <div className="game-board">
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
                        {gameData.player1 === socket.id ? "You" : "Opponent"}
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
                        {gameData.player2 !== socket.id ? "Opponent" : "You"}
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
                </div>
              </>
            )}
          </div>
        </div>
        <MessagePop messageList={sampleMessages} />
      </div>
    </>
  );
};

export default Room;
