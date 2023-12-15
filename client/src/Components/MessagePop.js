import React, { useState } from "react";
import "./MessagePop.css";
import { BiSolidMessageRoundedDetail } from "react-icons/bi";
import { Badge } from "react-bootstrap";
import Send from "../Assets/Send";

const OpponentName = ({ name }) => {
  return (
    <div className="opponent-name">
      {/* Chat to :-{" "} */}
      <strong style={{ color: "black", fontWeight: "bolder" }}>
        {"tFxFIxWRHLgO2QA1AAAF"}
      </strong>
    </div>
  );
};

const MessagePop = ({
  messageList,
  sendMessage,
  id,
  msgNotify,
  setMsgCount,
}) => {
  const [Message, setMessage] = useState("");
  const [click, setClick] = useState(false);

  const handleClick = () => {
    setClick(!click);
    setMsgCount(false);
  };

  return (
    <div className="ChatContainer">
      {click ? (
        <div id="messagePopup" className="popup">
          <OpponentName name="Allen Sir" />
          <div className="message-list">
            {messageList?.map((message, index) => (
              <div
                key={index}
                className={`message ${message.id === id ? "sent" : "received"}`}
              >
                <p className="message-content">{message.text}</p>
                <p className="message-time">{message.time}</p>
              </div>
            ))}
          </div>
          <div className="message-input">
            <input
              type="text"
              placeholder="Type your message"
              onChange={(e) => setMessage(e.target.value)}
              value={Message}
            />
            <button
              onClick={() => {
                sendMessage(Message);
                setMessage("");
              }}
            >
              <Send color="#007bff" size="2.5em" />
            </button>
          </div>
        </div>
      ) : null}

      <div className="MessageButton">
        <div
          style={{
            position: "relative",
          }}
        >
          <BiSolidMessageRoundedDetail onClick={handleClick} />
          {msgNotify && (
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
    </div>
  );
};

export default MessagePop;
