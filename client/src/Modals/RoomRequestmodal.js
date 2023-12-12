import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const RoomRequestModal = ({ show, onhide, roomId, requesterId }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleResponse = (val) => {
    setLoading(true);

    socket.emit("respond-to-room-request", roomId, val);
    if (val === true) {
      toast.success("You accepted the request ... ");
      return navigate(`/roomid/${roomId}`);
    }
    onhide();
  };

  useEffect(() => {});

  return (
    <Modal show={show} size="200" centered>
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          Room Invitation
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p style={{ fontSize: "16px" }}>
          {requesterId} has invited you to play in Room ID:{" "}
          <strong>{roomId}</strong>.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="success"
          onClick={() => handleResponse(true)}
          disabled={loading}
        >
          {loading ? <>{loadingMessage} </> : "Accept"}
        </Button>
        <Button
          variant="danger"
          onClick={() => handleResponse(false)}
          disabled={loading}
        >
          {loading ? "Declining..." : "Decline"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RoomRequestModal;
