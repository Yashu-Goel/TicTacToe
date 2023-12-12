import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Components/Home";
import StartGame from "./Components/StartGame";
import FindFriends from "./Components/FindFriends";
import Room from "./Components/Room";
const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/start_game" element={<StartGame />} />
        <Route path="/find_friends" element={<FindFriends />} />
        <Route path="/roomid/:id" element={<Room />} />
      </Routes>
    </>
  );
};

export default App;
