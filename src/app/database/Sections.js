import { useState, useEffect } from "react";
import { Button, FormCheck, Modal } from "react-bootstrap";
import { Form, Row, Col, FormControl, FormGroup } from "react-bootstrap";

import { toast } from "react-hot-toast";
import {
  createSection,
  deleteSection,
  getSections,
  updateSection,
} from "../api/db-crud";

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
  const sessionValue = ["Jan-23"]; // it will be fetched from database

  // const dummySections = [
  //   {
  //     batch: 18,
  //     section: "A",
  //     type: "Theory",
  //     room: "203",
  //     session: "January 2023",
  //   },
  // ];

  const [sections, setSections] = useState([]);

  useEffect(() => {
    getSections().then((res) => {
      setSections(res);
    });
  }, []);



  // type 0 = theory, 1 = lab

  const [selectedSection, setSelectedSection] = useState(null);
  const [deleteSectionSelected, setDeleteSectionSelected] = useState(null);

  console.log(deleteSectionSelected);

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
                      type: 0,
                      room: "",
                      session: sessionValue[0],
                      prev_batch: 0,
                      prev_section: "",
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
                        <td> {section.type===0? "Theory":"Sessional"} </td>
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
                                setSelectedSection({
                                  ...section,
                                  index,
                                  prev_batch: section.batch,
                                  prev_section: section.section,
                                })
                              }
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="btn btn-danger btn-sm"
                              onClick={() =>
                                setDeleteSectionSelected({
                                  batch: section.batch,
                                  section: section.section,
                                })
                              }
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
          <Modal.Header closeButton>
            {selectedSection.prev_section === "" ? "Add" : "Edit"} Section
          </Modal.Header>
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
                      size="lg"
                      value={selectedSection.type}
                      onChange={(e) =>
                        setSelectedSection({
                          ...selectedSection,
                          type: Number.parseInt(e.target.value),
                        })
                      }
                    >
                      <option value="0">Theory</option>
                      <option value="1">Sessional</option>
                    </Form.Select>
                  </FormGroup>
                </Col>

                <Col md={4} className="px-2 py-1 d-flex align-items-center">
                  <FormGroup>
                    <Form.Label>Session</Form.Label>
                    <br />
                    <Form.Select
                      size="lg"
                      value={sessionValue.indexOf(selectedSection.session)}
                      onChange={(e) =>
                        setSelectedSection({
                          ...selectedSection,
                          session:
                            sessionValue[Number.parseInt(e.target.value)],
                        })
                      }
                    >
                      <option value="0">{sessionValue[0]}</option>
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
                if (result === null) {
                  if (selectedSection.prev_section === "") {
                    createSection({...selectedSection, room: selectedSection.room || "000"})
                      .then((res) => {
                        setSections([...sections, selectedSection]);
                        toast.success("Section added successfully");
                      })
                      .catch(console.log);
                  } else {
                    updateSection(
                      selectedSection.prev_batch,
                      selectedSection.prev_section,
                      selectedSection
                    )
                      .then((res) => {
                        const index = sections.findIndex(
                          (t) =>
                            t.batch === selectedSection.prev_batch &&
                            t.section === selectedSection.prev_section
                        );
                        const newSections = [...sections];
                        newSections[index] = selectedSection;
                        setSections(newSections);
                        toast.success("Section updated successfully");
                      })
                      .catch(console.log);
                  }
                  setSelectedSection(null);
                } else toast.error(result);
              }}
            >
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {deleteSectionSelected !== null && (
      <Modal
        show={deleteSectionSelected !== null}
        onHide={() => setDeleteSectionSelected(null)}
        size="md"
        centered
      >
        <Modal.Header closeButton>
          Delete Section : {deleteSectionSelected.batch}{deleteSectionSelected.section}
        </Modal.Header>
        <Modal.Body className="px-4">
          <p>Are you sure you want to delete this section?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-dark"
            onClick={() => setDeleteSectionSelected(null)}
          >
            Close
          </Button>
          <Button
            variant="danger"
            onClick={(e) => {
              deleteSection(deleteSectionSelected.batch, deleteSectionSelected.section)
                .then((res) => {
                  setDeleteSectionSelected(null);
                  setSections(
                    sections.filter(
                      (t) =>
                        t.batch !== deleteSectionSelected.batch &&
                        t.section !== deleteSectionSelected.section
                    )
                  );
                  toast.success("Section deleted successfully");
                })
                .catch(console.log);
            }}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>)}
    </div>
  );
}
