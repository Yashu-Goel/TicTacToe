import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import "./MessagePop.css";
import Send from "../Assets/Send";

const OpponentName = ({ name }) => {
  return (
    <div className="opponent-name" style={{ textAlign: "center" }}>
      <strong style={{ color: "white", letterSpacing: "1px" }}>
        {"Chats"}
      </strong>
    </div>
  );
};

const MessagePop = ({ messageList, sendMessage, id, gameData }) => {
  const [Message, setMessage] = useState("");
  const [enterPressed, setEnterPressed] = useState(false);

  const ref = useRef();
  useLayoutEffect(() => {
    const scroll = () => {
      if (ref.current) {
        ref.current.scrollTop = ref.current.scrollHeight;
      }
    };

    requestAnimationFrame(scroll);
  }, [messageList]);

  useEffect(() => {
    if (enterPressed) {
      sendMessage(Message);
      setMessage("");
      setEnterPressed(false);
    }
  }, [enterPressed, Message, sendMessage]);

  return (
    <div className="ChatContainer">
      {gameData ? (
        <div className="popup">
          <OpponentName name="Allen Sir" />
          <div className="message-list" ref={ref}>
            {messageList.length === 0 && (
              <p
                style={{
                  textAlign: "center",
                  fontSize: "18px",
                  color: "darkgray",
                  margin: "auto",
                  fontWeight: "bold",
                }}
              >
                Start a conversation !!!
              </p>
            )}

            {messageList?.map((message, index) => (
              <div
                key={index}
                className={`message ${message.id === id ? "sent" : "received"}`}
              >
                <p className="message-content">{message.text}</p>
                <p className="message-time">{message?.time}</p>
              </div>
            ))}
          </div>
          <div className="message-input">
            <input
              type="text"
              placeholder="Type something..."
              onChange={(e) => setMessage(e.target.value)}
              value={Message}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  setEnterPressed(true);
                }
              }}
            />
            <button
              onClick={() => {
                sendMessage(Message);
                setMessage("");
              }}
            >
              <Send color="#d11b2a" size="2em" />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default MessagePop;
