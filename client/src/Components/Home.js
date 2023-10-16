import React, { useState } from "react";
import "./Home.css";
import X from "../Assets/X.png";
import O from "../Assets/O.png";
import ShootingStars from "./ShootingStars";

const Home = () => {
  const [friendId, setFriendId] = useState("");
  const [userName, setUserName] = useState("");
  const [userNameInput, setUserNameInput] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [showEnterRoomInput, setShowEnterRoomInput] = useState(false);
  const [showEnterRoom, setShowEnterRoom] = useState(true);
  const [inputPlaceholder, setInputPlaceholder] = useState("Enter friend's ID");


  const handlePlayWithRandom = () => {
    const playWithRandomButton = document.getElementById(
      "playWithRandomButton"
    );

    if (playWithRandomButton.innerText === "Create Room") {
      console.log("YO bro");
      setShowInput(true);
      setShowEnterRoom(false); 
    }
  };

  const handlePlayWithFriend = () => {
    const playWithRandomButton = document.getElementById(
      "playWithRandomButton"
    );
    const playWithFriendButton = document.getElementById(
      "playWithFriendButton"
    );

    if (playWithRandomButton.innerText === "Play with Random Person") {
      playWithRandomButton.innerText = "Create Room";
      playWithFriendButton.innerText = "Enter Room";
      setShowInput(false);
      setShowEnterRoom(true);
      console.log("ok");
    } else if (playWithFriendButton.innerText === "Enter Room") {
      console.log("okokok");
      setShowEnterRoom(false);     
      setShowInput(true);
      setInputPlaceholder("Enter Room Id")
   }
  };

    const handleSubmit = () => {
      if (userName) {
        setShowEnterRoom(true); 
        setUserNameInput(true);
      }
    };

    const handleFriendId = () =>{
      // do coding here
      console.log('KKKK');
    }
  return (
    <div className="HomeOuterContainer">
      <img className="XImage" src={X} />
      <img className="OImage" src={O} />
      <div className="HomeInnerContainer">
        <div className="HomeButtons">
          {!userNameInput && (
            <div className="InputContainer">
              <div>
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
        <div className="HomeButtons">
          {showEnterRoom && userNameInput && (
            <button id="playWithRandomButton" onClick={handlePlayWithRandom}>
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
        </div>
        <div className="HomeButtons">
          {showEnterRoom && userNameInput && (
            <button id="playWithFriendButton" onClick={handlePlayWithFriend}>
              Play with Friend
            </button>
          )}
        </div>
      </div>
      <ShootingStars />
    </div>
  );
};

export default Home;
