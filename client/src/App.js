import React from 'react'
import { Routes, Route } from "react-router-dom";
import Home from "./Components/Home"
import StartGame from "./Components/StartGame"
const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/start_game" element={<StartGame/>} />
      </Routes>
    </>
  );
}

export default App