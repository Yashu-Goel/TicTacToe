import React, { useState } from "react";
import "./Home.css";
import X from "../Assets/X.png"
import O from "../Assets/O.png"
const Home = () => {
  const [uniqueCode, setUniqueCode] = useState("");

  const generateUniqueCode = () => {
    const characters =
      "0123456789";
    const codeLength = 6;

    let generatedCode = "";
    for (let i = 0; i < codeLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      generatedCode += characters.charAt(randomIndex);
    }

    setUniqueCode(generatedCode);
  };

  const handlePlayWithRandom = () => {
    console.log("Playing with a random person");
  };

  const handlePlayWithFriend = () => {
    generateUniqueCode();
  };

  return (
    <div className="HomeOuterContainer">
      <img className="XImage" src={X} />
      <img className="OImage" src={O} />
      <div className="HomeInnerContainer">
        <div className="HomeButtons">
          <button onClick={handlePlayWithRandom}>
            Play with Random Person
          </button>
        </div>
        <div className="HomeButtons">
          <button onClick={handlePlayWithFriend}>Play with Friend</button>
          {uniqueCode && <p>Your Unique Code: {uniqueCode}</p>}
        </div>
      </div>
    </div>
  );
};

export default Home;
