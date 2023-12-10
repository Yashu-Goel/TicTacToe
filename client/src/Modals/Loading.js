// Loading.js
import React, { useState, useEffect } from "react";
import "./Loading.css";
import ShootingStars from "../Components/ShootingStars";
import {
  Container,
  Row,
  Col,
  Navbar,
  Badge,
  Button,
  Modal,
} from "react-bootstrap";
import RequestModal from "./RequestModal";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { First } from "react-bootstrap/esm/PageItem";

export const socket = io("http://localhost:5000");

const Loading = () => {
  const [dots, setDots] = useState(0);
  const [IsConnected, setIsConnected] = useState(true);
  const [onlineFriends, setOnlineFriends] = useState([]);
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((dots) => (dots < 3 ? dots + 1 : 0));
    }, 500);

    const handleBeforeUnload = () => {
      socket.emit("leave-lobby", socket.id);
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    socket.on("updateLobby", (participants) => {
      setOnlineFriends(participants);
    });

    socket.emit("find-friends");
    return () => {
      clearInterval(interval);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      socket.off("updateLobby");
    };
  }, []);

  const getDots = () => {
    return ".".repeat(dots);
  };
  const handleCopyClick = () => {
    if (!socket) {
      toast.error("Please wait for the game to start");
    } else {
      navigator.clipboard.writeText(socket.id);
      navigator.clipboard.writeText(socket.id);
      toast.success("Copied to clipboard");
    }
  };

  const handleStartMatch = (opponent) => {
    // toast.error(opponent);
    if (!socket) {
      toast.error("Please wait for the game to start");
      return;
    } else {
      setShowModal(true);
      socket.emit("send-room-request", socket.id, opponent);
    }
  };
  const handleRequest = () => {};

  return (
    <>
      {showModal && (
        <RequestModal
          show={showModal}
          onhide={() => setShowModal(false)}
          onclick={handleRequest}
        />
      )}
      <div className="loading-container">
        <Navbar bg="dark" variant="dark" expand="lg">
          {/* <Navbar.Brand>Your App</Navbar.Brand> */}
          {/* <Navbar.Toggle aria-controls="basic-navbar-nav" /> */}
          <Navbar.Collapse id="basic-navbar-nav">
            <Navbar.Text className="mr-auto">User ID: {socket.id}</Navbar.Text>
            <Navbar.Text>
              <Badge variant={IsConnected ? "success" : "danger"}>
                {IsConnected ? "Online" : "Offline"}
              </Badge>
            </Navbar.Text>
            <Navbar.Text>
              <Button variant="outline-light" onClick={handleCopyClick}>
                Copy ID
              </Button>
            </Navbar.Text>
          </Navbar.Collapse>
        </Navbar>
        <div className="loading-content">
          <p>Waiting for opponents{getDots()}</p>
          <ol className="friends-list">
            {onlineFriends.map((friend, index) => (
              <li key={index}>
                <p className="m-0">{friend}</p>
                <Button onClick={() => handleStartMatch(friend)}>
                  Start Match
                </Button>
              </li>
            ))}
          </ol>
        </div>
        <ShootingStars />
      </div>
    </>
  );
};

export default Loading;
