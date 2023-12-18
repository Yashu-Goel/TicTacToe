import { Modal, Button } from "react-bootstrap";
import "./ResultModal.css";
import { useNavigate } from "react-router-dom";
import Confetti from "react-confetti";

const ResultModal = ({ result, show, onHide, restartGame, data, Loading }) => {
  const navigate = useNavigate();
  if (!result) {
    onHide();
    return;
  }

  const modalStyle = {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
  };

  const bodyStyle = {
    textAlign: "center",
    color: result.includes("You won") ? "green" : "red",
    fontWeight: "bolder",
  };

  return (
    <>
      <Modal
        show={show}
        onHide={onHide}
        centered
        style={modalStyle}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header>
          {result.includes("You won") && (
            <Confetti width={"570px"} height={"auto"} />
          )}
          <Modal.Title>Game Result</Modal.Title>
        </Modal.Header>
        <Modal.Body style={bodyStyle}>
          <p>{result}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={restartGame} disabled={Loading}>
            {Loading ? "Request Sent..." : "Play Again"}
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              onHide();
              navigate("/find_friends");
              return;
            }}
            disabled={Loading}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ResultModal;
