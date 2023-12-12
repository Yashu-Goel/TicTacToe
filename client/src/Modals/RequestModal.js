import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const RequestModal = ({ show, onhide, socket, oppoId }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Creating a room...");

  const handleSendRequest = () => {
    setLoading(true);
    toast.success("Request send!!!");

    socket.emit("send-room-request", socket.id, oppoId);
  };
  useEffect(() => {
    if (loading) {
      const timeoutId = setTimeout(() => {
        setLoadingMessage("Waiting for response...");
      }, 2000);
      socket.on("req-accepted", (requestId, recipient) => {
        toast.success(`Your request was accepted by ${recipient}... `);
        return navigate(`/roomid/${requestId}`);
      });

      return () => {
        clearTimeout(timeoutId);
        socket.off("req-accepted");
      };
    }
  }, [loading]);

  return (
    <Modal
      show={show}
      size="200"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          Send Game Request <strong>{socket.id}</strong>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p style={{ fontSize: "16px" }}>
          You are sending a game request to the user with ID:{" "}
          <strong>{oppoId}</strong>.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          onClick={handleSendRequest}
          disabled={loading}
        >
          {loading ? <>{loadingMessage} </> : "Send Request"}
        </Button>
        <Button variant="secondary" onClick={onhide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RequestModal;
