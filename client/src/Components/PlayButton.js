// PlayButton.js
import React from "react";

const PlayButtons = ({
  showEnterRoom,
  userNameInput,
  showInput,
  inputPlaceholder,
  friendId,
  setFriendId,
  handlePlayWithRandom,
  handlePlayWithFriend,
  handleFriendId,
}) => {
  return (
    <div className="HomeButtons">
      {showEnterRoom && userNameInput && (
        <button
          id="playButton"
          className="play-button random"
          onClick={handlePlayWithRandom}
        >
          Play with Random Person
        </button>
      )}

      {showInput && (
        <div className="InputContainer">
          <div>
            <input
              id="inputContainer"
              type="text"
              value={friendId}
              onChange={(e) => setFriendId(e.target.value)}
              placeholder={inputPlaceholder}
            />
          </div>
          <div>
            <button onClick={handleFriendId}>Submit</button>
          </div>
        </div>
      )}

      {showEnterRoom && userNameInput && (
        <button
          id="playButton"
          className="play-button friend"
          onClick={handlePlayWithFriend}
        >
          Play with Friend
        </button>
      )}
    </div>
  );
};

export default PlayButtons;
