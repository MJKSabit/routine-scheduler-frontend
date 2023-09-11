import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, FormGroup, Button } from "react-bootstrap";
import {
  getAllInitial,
  getPdfForStudent,
  getPdfForTeacher,
  getAllRooms,
  getPdfForRoom,
  getAllLevelTerms,
  regeneratePdfLevelTerm,
} from "../api/pdf";
import toast from "react-hot-toast";

export default function ShowPdf() {
  const [forStudent, setForStudent] = useState(true);
  const [forTeacher, setForTeacher] = useState(false);
  const [forRoom, setForRoom] = useState(false);

  const [initials, setInitials] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [allLevels, setAllLevels] = useState([]);

  useEffect(() => {
    getAllInitial().then((res) => {
      setInitials(res.initials);
    });
    getAllRooms().then((res) => {
      setRooms(res.rooms);
    });
    getAllLevelTerms().then((res) => {
      setAllLevels(res);
    });
  }, []);

  const [selectedInitial, setSelectedInitial] = useState("");
  const handleSelectInitial = (selectedOption) => {
    setSelectedInitial(selectedOption);
  };
  const [selectedRoom, setSelectedRoom] = useState("");
  const handleSelectRoom = (selectedOption) => {
    setSelectedRoom(selectedOption);
  };

  const [lvlTerm, setLvlTerm] = useState("L4-T1");

  const [pdfData, setpdfData] = useState("");

  const handleSelect = (e) => {
    const selectedOption = e.target.value;
    console.log(selectedOption);
    setForStudent(false);
    setForTeacher(false);
    setForRoom(false);

    switch (selectedOption) {
      case "For Student":
        setForStudent(true);
        break;
      case "For Teacher":
        setForTeacher(true);
        break;
      case "For Room":
        setForRoom(true);
        break;
      default:
        break;
    }
  };

  const handleRadioChange = (event) => {
    setLvlTerm(event.target.value);
  };

  const displayPdf = () => {
    try {
      if (forStudent) {
        getPdfForStudent(lvlTerm, "a").then((res) => {
          const pdfBlob = new Blob([res], { type: "application/pdf" });
          setpdfData(pdfBlob);
        });
      } else if (forTeacher) {
        getPdfForTeacher(selectedInitial).then((res) => {
          const pdfBlob = new Blob([res], { type: "application/pdf" });
          setpdfData(pdfBlob);
        });
      } else if (forRoom) {
        getPdfForRoom(selectedRoom).then((res) => {
          const pdfBlob = new Blob([res], { type: "application/pdf" });
          setpdfData(pdfBlob);
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h3 className="page-title"> Routine Generate </h3>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">PDF Format</li>
          </ol>
        </nav>
      </div>

      <div className="row">
        <div className="col-3 grid-margin">
          <div className="card">
            <div className="card-body">
              <Form.Group controlId="exampleForm.ControlSelect1">
                <Form.Control
                  as="select"
                  onChange={handleSelect}
                  className="btn-block"
                >
                  <option value={""} hidden>
                    {" "}
                    Select Format{" "}
                  </option>
                  <option value={"For Student"}>For Student</option>
                  <option value={"For Teacher"}>For Teacher</option>
                  <option value={"For Room"}>For Room</option>
                </Form.Control>
              </Form.Group>
            </div>
          </div>
        </div>

        {forStudent && (
          <div className="col-5 grid-margin">
            <div className="card">
              <div className="card-body">
                <Form>
                  <FormGroup>
                    <div className="d-flex align-items-center">
                      {allLevels.map((item) => (
                        <Form.Check
                          className="m-0 mr-4"
                          inline
                          label={item}
                          type="radio"
                          value={item}
                          checked={lvlTerm === item}
                          onChange={handleRadioChange}
                        />
                      ))}
                    </div>
                  </FormGroup>
                </Form>
              </div>
            </div>
          </div>
        )}

        {forTeacher && (
          <div className="col-5 grid-margin">
            <div className="card">
              <div className="card-body">
                <Form.Group controlId="exampleForm.ControlSelect1">
                  <Form.Control
                    as="select"
                    className="btn-block"
                    onChange={(e) => handleSelectInitial(e.target.value)}
                  >
                    <option value={""} hidden>
                      Select Teacher
                    </option>
                    {initials.map((item) => (
                      <option key={item.iinitial} value={item.initial}>
                        {item.initial}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </div>
            </div>
          </div>
        )}

        {forRoom && (
          <div className="col-5 grid-margin">
            <div className="card">
              <div className="card-body">
                <Form.Group controlId="exampleForm.ControlSelect1">
                  <Form.Control
                    as="select"
                    className="btn-block"
                    onChange={(e) => handleSelectRoom(e.target.value)}
                  >
                    <option value={""} hidden>
                      {" "}
                      Select Room{" "}
                    </option>
                    {rooms.map((item) => (
                      <option key={item.iinitial} value={item.room}>
                        {item.room}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </div>
            </div>
          </div>
        )}

        <div className="col-4 grid-margin">
          <div className="card">
            <div className="card-body d-flex justify-content-between">
              <Button variant="outline-dark" onClick={() => {
                const toastId = toast.loading("Generating PDF...");
                regeneratePdfLevelTerm(lvlTerm).then((res) => {
                    toast.remove(toastId);
                });
              }}>Regenerate</Button>
              <Button variant="primary" onClick={displayPdf}>
                Show
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Container className="mt-4">

        {pdfData && (
          <Row>
            <Col>
              <div>
                <iframe
                  title="PDF Viewer"
                  src={URL.createObjectURL(pdfData)}
                  width="100%"
                  height="600px"
                />
              </div>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
}
