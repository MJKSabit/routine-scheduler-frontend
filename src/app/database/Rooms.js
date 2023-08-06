import { useState , useEffect } from "react";
import { Button, FormCheck, Modal } from "react-bootstrap";
import { Form, Row, Col, FormControl, FormGroup } from "react-bootstrap";

import { toast } from "react-hot-toast";

import { createRoom, deleteRoom, getRooms, updateRoom } from "../api/db-crud";

const validateRoom = (room) => {
  if (room.room === "") {
    return "Room cannot be empty";
  }
  if (room.type === "") {
    return "Type cannot be empty";
  }
  return null;
};

export default function Rooms() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    getRooms().then((res) => {
      setRooms(res);
    });
  }, []);

  const [selectedRoom, setSelectedRoom] = useState(null);
  const [deleteRoomSelected, setDeleteRoomSelected] = useState(null);

  return (
    <div>
      <div className="page-header">
        <h3 className="page-title"> Room Information </h3>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="!#" onClick={(event) => event.preventDefault()}>
                Database
              </a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Rooms
            </li>
          </ol>
        </nav>
      </div>
      <div className="row">
        <div className="col-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title float-right">
                <button
                  type="button"
                  className="btn btn-success btn-sm"
                  onClick={(e) => {
                    setSelectedRoom({
                      room: "",
                      type: "Theory",
                      prev_room: "",
                    });
                  }}
                >
                  Add New Room
                </button>
              </h4>
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th> Room </th>
                      <th> Type </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rooms.map((room, index) => (
                      <tr key={index}>
                        <td> {room.room} </td>
                        <td> {room.type===0? "Theory":"Sessional"} </td>
                        <td>
                          <div
                            className="btn-group"
                            role="group"
                            aria-label="Basic example"
                          >
                            <button
                              type="button"
                              className="btn btn-primary btn-sm"
                              onClick={() =>
                                setSelectedRoom({
                                  ...room,
                                  index,
                                  prev_room: room.room,
                                })
                              }
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="btn btn-danger btn-sm"
                              onClick={() => setDeleteRoomSelected(room.room)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      {selectedRoom !== null && (
        <Modal
          show={true}
          onHide={() => setSelectedRoom(null)}
          size="md"
          centered
        >
          <Modal.Header closeButton>Add / Edit Room</Modal.Header>
          <Modal.Body className="px-4">
            <Form className="px-2 py-1">
              <Row>
                <Col md={4} className="px-2 py-1">
                  <FormGroup>
                    <Form.Label>Room</Form.Label>
                    <FormControl
                      type="text"
                      placeholder="Enter Room"
                      value={selectedRoom.room}
                      onChange={(e) =>
                        setSelectedRoom({
                          ...selectedRoom,
                          room: e.target.value,
                        })
                      }
                    />
                  </FormGroup>
                </Col>
                <Col md={4} className="px-2 py-1 d-flex align-items-center">
                  <FormGroup>
                    <Form.Label>Type</Form.Label>
                    <br />
                    <Form.Select
                      size="lg"
                      value={selectedRoom.type}
                      onChange={(e) =>
                        setSelectedRoom({
                          ...selectedRoom,
                          type: Number.parseInt(e.target.value),
                        })
                      }
                    >
                      <option value="0">Theory</option>
                      <option value="1">Sessional</option>
                    </Form.Select>
                  </FormGroup>
                </Col>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="outline-dark"
              onClick={() => setSelectedRoom(null)}
            >
              Close
            </Button>
            <Button
              variant="success"
              onClick={(e) => {
                e.preventDefault();
                const result = validateRoom(selectedRoom);
                if (result === null) {
                  if (selectedRoom.prev_room === "") {
                    createRoom(selectedRoom)
                      .then((res) => {
                        setRooms([...rooms, selectedRoom]);
                        toast.success("Room added successfully");
                      })
                      .catch(console.log);
                  } else {
                    updateRoom(selectedRoom.prev_room, selectedRoom)
                      .then((res) => {
                        const index = rooms.findIndex(
                          (r) => r.room === selectedRoom.prev_room
                        );
                        const newRooms = [...rooms];
                        newRooms[index] = selectedRoom;
                        setRooms(newRooms);
                        toast.success("Room updated successfully");
                      })
                      .catch(console.log);
                  }
                  setSelectedRoom(null);
                } else toast.error(result);
              }}
            >
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      <Modal
        show={deleteRoomSelected !== null}
        onHide={() => setDeleteRoomSelected(null)}
        size="md"
        centered
      >
        <Modal.Header closeButton>Delete Room</Modal.Header>
        <Modal.Body className="px-4">
          <p>Are you sure you want to delete this room?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-dark"
            onClick={() => setDeleteRoomSelected(null)}
          >
            Close
          </Button>
          <Button
            variant="danger"
            onClick={(e) => {
              deleteRoom(deleteRoomSelected)
                .then((res) => {
                  setDeleteRoomSelected(null);
                  setRooms(rooms.filter((r) => r.room !== deleteRoomSelected));
                  toast.success("Room deleted successfully");
                })
                .catch(console.log);
            }}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
