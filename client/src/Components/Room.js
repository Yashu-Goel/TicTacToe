import React, { useEffect } from "react";
import { socket, getCurrentTimeInIndianFormat } from "../Modals/Loading";
import { BiSolidMessageRoundedDetail } from "react-icons/bi";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import toast from "react-hot-toast";
import ResultModal from "./ResultModal";
import "./Room.css";
import notifySound from "../Assets/ping-82822.mp3";
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
  const [MsgCount, setMsgCount] = useState(false);
  const [click, setClick] = useState(false);
  const [toggle, setToggle] = useState(false);
  const notify = new Audio(notifySound);

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
        if (!click) {
          setMsgCount(true);
          notificationBeep();
        }
      }
      if (toggle) {
        setMsgCount(false);
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

    if (!data.gameOver && !data.gameWon) {
      if (data.currentPlayer === socket.id) {
        toast.success("It's your turn!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
            color: "#fff",
            fontSize: "1.1rem",
            fontWeight: 500,
            padding: "1rem 2rem",
            borderRadius: "10px",
            boxShadow: "0 5px 10px rgba(0, 0, 0, 0.1)",
          },
        });
      } else {
        toast("It's opponent's turn", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          style: {
            background: "linear-gradient(to left, #3f5efb, #fc466b)",
            color: "#d9d9d9",
            fontSize: "1.1rem",
            fontWeight: 500,
            padding: "1rem 2rem",
            borderRadius: "10px",
            boxShadow: "0 5px 10px rgba(0, 0, 0, 0.1)",
          },
          icon: "⏳",
        });
      }
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
    if (message.trim() === "" || !gameData || !gameData.roomId) return;

    socket.emit(
      "send-message-to-room",
      message,
      getCurrentTimeInIndianFormat(),
      socket.id,
      gameData.roomId
    );
  }
  const handleClick = () => {
    if (click) {
      setClick(false);
    } else {
      setMsgCount(false);
      setClick(true);
    }
  };

  function notificationBeep() {
    // notify.oncanplay = () => {
    if (!click) {
      notify.play();
    }
    // };
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
        {click && gameData && (
          <MessagePop
            messageList={messages}
            sendMessage={sendMessage}
            id={socket.id}
            msgNotify={MsgCount}
            setMsgCount={setMsgCount}
            gameData={gameData}
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
                        <span>
                          {gameData.player1 === socket.id ? "You" : "Opponent"}
                        </span>
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
                  {/* <div
                    className="GridContainer"
                    disabled={true}
                  >
                    {gameData.board.map((cell, index) => (
                      <div
                        key={index}
                        className={`box box${index}`}
                        onClick={() => makeMove(index)}
                        disabled={gameData.currentPlayer !== socket.id}
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
                  </div> */}
                  <div className="GridContainer">
                    {gameData.board.map((cell, index) => (
                      <div
                        key={index}
                        className={`box`}
                        onClick={
                          gameData.currentPlayer !== socket.id
                            ? () => {}
                            : () => makeMove(index)
                        }
                        disabled={gameData.currentPlayer !== socket.id}
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
          {gameData && (
            <div className="MessageButton">
              <div
                style={{
                  position: "relative",
                }}
              >
                <BiSolidMessageRoundedDetail onClick={handleClick} />
                {MsgCount && !click && (
                  <span
                    style={{
                      height: "12px",
                      position: "absolute",
                      top: "7px",
                      right: "10px",
                      width: "12px",
                      color: "red",
                      backgroundColor: "red",
                      borderRadius: "50%",
                    }}
                  ></span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Room;
