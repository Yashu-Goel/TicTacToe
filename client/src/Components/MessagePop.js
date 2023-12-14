import React, { useState } from "react";
import "./MessagePop.css";
import { BiSolidMessageRoundedDetail } from "react-icons/bi";
import Send from "../Assets/Send";

const OpponentName = ({ name }) => {
  return (
    <div className="opponent-name">Chat to :- {"tFxFIxWRHLgO2QA1AAAF"}</div>
  );
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
                <p className="message-content">{message.text}</p>
                <p className="message-time">{message.time}</p>
              </div>
            ))}
          </div>
          <div className="message-input">
            <input type="text" placeholder="Type your message" />
            <button>
              <Send color="#007bff" size="2.5em" />
            </button>
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
