import { useState } from "react";
import { Button, FormCheck, Modal } from "react-bootstrap";
import { Form, Row, Col, FormControl, FormGroup } from "react-bootstrap";

import { toast } from "react-hot-toast";

const regexSection = /^[A-C][1-3]?$/;

const validateSection = (section) => {
  if (section.batch === "") {
    return "Batch cannot be empty";
  }

  if (section.batch < 18 || section.batch > 23) {
    return "Invalid Batch";
  }

  if (section.section === "") {
    return "Section cannot be empty";
  }

  if (!regexSection.test(section.section)) {
    return "Invalid Section";
  }

  if (section.type === "") {
    return "Type cannot be empty";
  }

  if (section.session === "") {
    return "Session cannot be empty";
  }

  return null;
};

export default function Sections() {
  const [sections, setSections] = useState([
    {
      batch: 18,
      section: "A",
      type: "Theory",
      room: "203",
      session: "January 2023",
    },
  ]);

  // type 0 = theory, 1 = lab

  const [selectedSection, setSelectedSection] = useState(null);
  const [deleteSection, setDeleteSection] = useState(null);

  return (
    <div>
      <div className="page-header">
        <h3 className="page-title"> Section Information </h3>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="!#" onClick={(event) => event.preventDefault()}>
                Database
              </a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Sections
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
                    setSelectedSection({
                      batch: 0,
                      section: "",
                      type: "",
                      room: "",
                      session: "",
                    });
                  }}
                >
                  Add New Section
                </button>
              </h4>
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th> Batch </th>
                      <th> Section </th>
                      <th> Type </th>
                      <th> Room </th>
                      <th> Session </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sections.map((section, index) => (
                      <tr key={index}>
                        <td> {section.batch} </td>
                        <td> {section.section} </td>
                        <td> {section.type} </td>
                        <td> {section.room} </td>
                        <td> {section.session} </td>
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
                                setSelectedSection({ ...section, index })
                              }
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="btn btn-danger btn-sm"
                              onClick={() => setDeleteSection(index)}
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
      {selectedSection !== null && (
        <Modal
          show={true}
          onHide={() => setSelectedSection(null)}
          size="md"
          centered
        >
          <Modal.Header closeButton>Add / Edit Section</Modal.Header>
          <Modal.Body className="px-4">
            <Form className="px-2 py-1">
              <Row>
                <Col md={4} className="px-2 py-1">
                  <FormGroup>
                    <Form.Label>Batch</Form.Label>
                    <FormControl
                      type="text"
                      placeholder="Enter Batch"
                      value={selectedSection.batch}
                      onChange={(e) =>
                        setSelectedSection({
                          ...selectedSection,
                          batch: Number.parseInt(e.target.value || "0"),
                        })
                      }
                    />
                  </FormGroup>
                </Col>
                <Col className="px-2 py-1">
                  <FormGroup>
                    <Form.Label>Section</Form.Label>
                    <FormControl
                      type="text"
                      placeholder="Enter Section"
                      value={selectedSection.section}
                      onChange={(e) =>
                        setSelectedSection({
                          ...selectedSection,
                          section: e.target.value,
                        })
                      }
                    />
                  </FormGroup>
                </Col>
                <Col className="px-2 py-1">
                  <FormGroup>
                    <Form.Label>Room</Form.Label>
                    <FormControl
                      type="text"
                      placeholder="Enter Room"
                      value={selectedSection.room}
                      onChange={(e) =>
                        setSelectedSection({
                          ...selectedSection,
                          room: e.target.value,
                        })
                      }
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={4} className="px-2 py-1 d-flex align-items-center">
                  <FormGroup>
                    <Form.Label>Type</Form.Label>
                    <br />
                    <Form.Select
                      
                      value={selectedSection.type === "Theory" ? "0" : "1"}
                      onChange={(e) =>
                        setSelectedSection({
                          ...selectedSection,
                          type: e.target.value === "0" ? "Theory" : "Sessional",
                        })
                      }
                    >
                      <option value="0">Theory</option>
                      <option value="1">Sessional</option>
                    </Form.Select>
                  </FormGroup>
                </Col>
                
                <Col md={4} className="px-2 py-1 d-flex align-items-center" >
                  <FormGroup>
                    <Form.Label>Session</Form.Label>
                    <br />
                    <Form.Select
                      size="lg"
                      value={selectedSection.session === "January 2023" ? "0" : "1"}
                      onChange={(e) =>
                        setSelectedSection({
                          ...selectedSection,
                          session: e.target.value === "0" ? "January 2023" : "July 2023",
                        })
                      }
                    >
                    
                      <option value="0">January 2023</option>
                      <option value="1">July 2023</option>
                    </Form.Select>
                  </FormGroup>
                </Col>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="outline-dark"
              onClick={() => setSelectedSection(null)}
            >
              Close
            </Button>
            <Button
              variant="success"
              onClick={(e) => {
                e.preventDefault();
                const result = validateSection(selectedSection);
                if (result === null)
                {
                    toast.success("Section saved successfully");
                    console.log(selectedSection);
                }
                else toast.error(result);
              }}
            >
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      <Modal
        show={deleteSection !== null}
        onHide={() => setDeleteSection(null)}
        size="md"
        centered
      >
        <Modal.Header closeButton>Delete Section</Modal.Header>
        <Modal.Body className="px-4">
          <p>Are you sure you want to delete this section?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-dark" onClick={() => setDeleteSection(null)}>
            Close
          </Button>
          <Button variant="danger">Delete</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
