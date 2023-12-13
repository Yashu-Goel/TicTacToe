// EnterName.js
import React from "react";

const EnterName = ({
  userName,
  setUserName,
  userNameInput,
  setUserNameInput,
  handleSubmit,
}) => {
  return (
    <div className="HomeButtons">
      {!userNameInput && (
        <div className="InputContainer">
          <div className="InputBox">
            <input
              type="text"
              value={userName}
              onChange={(e) => {
                setUserName(e.target.value);
              }}
              placeholder="Enter your name"
            />
          </div>
          <div>
            <button onClick={handleSubmit}>Submit Name</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnterName;
