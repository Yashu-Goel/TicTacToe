// Loading.js
import React, { useState, useEffect } from "react";
import "./Loading.css";
import ShootingStars from "../Components/ShootingStars";

const Loading = () => {
  const [dots, setDots] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((dots) => (dots < 3 ? dots + 1 : 0));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const getDots = () => {
    return ".".repeat(dots);
  };

  return (
    <>
      <div className="loading-container">
        <div className="loading-content">
          <p>Waiting for opponent{getDots()}</p>
        </div>
        <ShootingStars />
      </div>
    </>
  );
};

export default Loading;
