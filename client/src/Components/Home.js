import React, { useState } from "react";

const Home = () => {
  const [uniqueCode, setUniqueCode] = useState("");

  const generateUniqueCode = () => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const codeLength = 6;

    let generatedCode = "";
    for (let i = 0; i < codeLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      generatedCode += characters.charAt(randomIndex);
    }

    setUniqueCode(generatedCode);
  };

  return (
    <div>
      <div>Generated Code: {uniqueCode}</div>
      <button onClick={generateUniqueCode}>Generate Code</button>
    </div>
  );
};

export default Home;
