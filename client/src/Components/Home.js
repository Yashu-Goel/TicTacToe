import React, { useState } from "react";
import "./Home.css";
import ShootingStars from "./ShootingStars";
import { useNavigate } from "react-router-dom";
import PlayButtons from "./PlayButton";
import EnterName from "./EnterName";

const Home = () => {
  const [friendId, setFriendId] = useState("");
  const [userName, setUserName] = useState("");
  const [userNameInput, setUserNameInput] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [showEnterRoomInput, setShowEnterRoomInput] = useState(false);
  const [showEnterRoom, setShowEnterRoom] = useState(true);
  const [inputPlaceholder, setInputPlaceholder] = useState("Enter friend's ID");
  const navigate = useNavigate();

  const handlePlayWithRandom = () => {
    const playWithRandomButton = document.getElementById("playButton");
    if (playWithRandomButton.classList.contains("random")) {
      console.log("YO bro");
      navigate("/find_friends");
      // setShowInput(true);
      // setShowEnterRoom(false);
    }
    // Handle other conditions if needed
  };

  
const handlePlayWithFriend = () => {
  const playButton = document.getElementById("playButton");
  console.log(playButton.classList.contains("room"));
  if (playButton.classList.contains("friend")) {
    playButton.classList.remove("friend");
    playButton.classList.add("room");
    setShowInput(false);
    setShowEnterRoom(true);
    console.log("ok");
  } else if (playButton.classList.contains("room")) {
    playButton.classList.remove("room");
    playButton.classList.add("friend");
    setShowEnterRoom(false);
    setShowInput(true);
    setInputPlaceholder("Enter Room Id");
  }
};

  const handleSubmit = () => {
    if (userName) {
      setShowEnterRoom(true);
      setUserNameInput(true);
    }
  };

  const handleFriendId = () => {
    // do coding here
    if (!friendId) {
      return;
    }
    console.log("KKKK");
    navigate("/start_game");
  };

  return (
    <div className="HomeOuterContainer">
      <div className="HomeInnerContainer">
        <EnterName
          userName={userName}
          setUserName={setUserName}
          userNameInput={userNameInput}
          setUserNameInput={setUserNameInput}
          handleSubmit={handleSubmit}
        />
        <PlayButtons
          showEnterRoom={showEnterRoom}
          userNameInput={userNameInput}
          showInput={showInput}
          inputPlaceholder={inputPlaceholder}
          friendId={friendId}
          setFriendId={setFriendId}
          handlePlayWithRandom={handlePlayWithRandom}
          handlePlayWithFriend={handlePlayWithFriend}
          handleFriendId={handleFriendId}
        />
      </div>
      <ShootingStars />
    </div>
  );
};

export default Home;
