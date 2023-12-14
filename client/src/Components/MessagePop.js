import React, { useState } from "react";
import "./MessagePop.css";
import { BiSolidMessageRoundedDetail } from "react-icons/bi";

const OpponentName = ({ name }) => {
  return <div className="opponent-name">{name}</div>;
};

const MessagePop = ({ messageList, opponentName }) => {
  const [click, setClick] = useState(false);

  const handleClick = () => {
    console.log("OKOK");
    setClick(!click);
    console.log(click);
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
                className={`message ${
                  message.sender === "sender" ? "sent" : "received"
                }`}
              >
                <div className="message-content">{message.text}</div>
                <div className="message-info">
                  <div className="message-time">{message.time}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="message-input">
            <input type="text" placeholder="Type your message" />
            <button>Send</button>
          </div>
        </div>
      ) : null}

      <BiSolidMessageRoundedDetail
        className="MessageButton"
        onClick={handleClick}
      />
    </div>
  );
};

export default MessagePop;
