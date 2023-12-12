import React from "react";
import { socket } from "../Modals/Loading";
import { useParams } from "react-router-dom";
import './Room.css'
import ShootingStars from "./ShootingStars";
const Room = () => {
  const { id } = useParams();
  return (
    <div className="RoomMainContainer">
      <div className="RoomCodeContainer">
        <span>Room Code: {id}</span>
      </div>

      <div className="GridContainer">
        <div class="box box1">X</div>
        <div class="box box2">X</div>
        <div class="box box3">O</div>
        <div class="box box4">O</div>
        <div class="box box5">X</div>
        <div class="box box6">O</div>
        <div class="box box7">X</div>
        <div class="box box8">X</div>
        <div class="box box9">O</div>
      </div>

      <div className="PlayerText">
        <p>Opponent: {"Allen Sir"}</p>
      </div>

      <div>{"Winner"}</div>
      <ShootingStars />
    </div>
  );
};

export default Room;
