import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { socket } from "../Modals/Loading";
import { useNavigate } from "react-router-dom";

const PlayAgainModalResp = ({ show, roomId, id, onHide }) => {
  const navigate = useNavigate();
  if (!roomId || !socket || !socket.id || !id) {
    onHide();
    return;
  }

  const handleClose = () => {
    socket.emit("response-to-play-again", roomId, false, socket.id);
    onHide();
    navigate("/find_friends");
    return;
  };

  const handleConfirm = () => {
    socket.emit("response-to-play-again", roomId, true, socket.id);
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
      <Modal.Header>
        <Modal.Title>
          <p style={{ fontSize: "16px" }}>
            Play Again Invitation — Your ID: <strong>{socket.id}</strong> (Self
            ID)
          </p>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p style={{ fontSize: "15px" }}>
          {`Player `}
          <strong>{id}</strong>
          {` has invited you to play again in the same room (Room ID: `}
          <strong>{roomId}</strong>
          {`). Would you like to play again?`}
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="success"
          onClick={handleConfirm}
          style={{ width: "100px" }}
        >
          Yes
        </Button>
        <Button
          variant="danger"
          onClick={handleClose}
          style={{ width: "100px" }}
        >
          No
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PlayAgainModalResp;
