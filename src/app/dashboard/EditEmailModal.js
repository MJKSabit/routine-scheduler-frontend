import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const EditEmailModal = ({ showModal, handleClose, handleSave, editedEmail, setEditedEmail, mask }) => {
  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit {
          mask === "THEORY" ? "Theory" :
          mask === "SCHEDULE" ? "Schedule" :
          mask === "SESSIONAL" && "Sessional"
        } Email</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Control
          as="textarea" rows={4}
          value={editedEmail}
          onChange={(e) => setEditedEmail(e.target.value)}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default EditEmailModal;
