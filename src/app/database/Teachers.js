import { useState } from "react";
import { Button, FormCheck, Modal } from "react-bootstrap";
import { Form, Row, Col, FormControl, FormGroup } from "react-bootstrap";
import { toast } from "react-hot-toast";

const initial_regex = /^[A-Z]{2,6}$/;
const email_regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/;

const validate = (teacher) => {
  if (teacher.initial === "") {
    return "Initial cannot be empty";
  }
  if (teacher.name === "") {
    return "Name cannot be empty";
  }
  if (teacher.surname === "") {
    return "Surname cannot be empty";
  }
  if (teacher.email === "") {
    return "Email cannot be empty";
  }
  if (teacher.seniority_rank === "") {
    return "Seniority Rank cannot be empty";
  }
  if (teacher.theory_courses === "") {
    return "Theory Courses cannot be empty";
  }
  if (teacher.sessional_courses === "") {
    return "Sessional Courses cannot be empty";
  }
  if (!email_regex.test(teacher.email)) {
    return "Invalid email";
  }
  if (!initial_regex.test(teacher.initial)) {
    return "Invalid initial";
  }
  return null;
};

export default function Teachers() {
  const [teachers, setTeachers] = useState([
    {
      initial: "MMI",
      name: "Md. Monirul Islam",
      surname: "Monir",
      email: "mmi@cse.buet.ac.bd",
      seniority_rank: 4,
      active: 1,
      theory_courses: 1,
      sessional_courses: 1,
    },
  ]);

  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [deleteTeacher, setDeleteTeacher] = useState(null);

  return (
    <div>
      <div className="page-header">
        <h3 className="page-title"> Teacher Information </h3>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="!#" onClick={(event) => event.preventDefault()}>
                Database
              </a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Teachers
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
                    setSelectedTeacher({
                      initial: "",
                      name: "",
                      surname: "",
                      email: "",
                      seniority_rank: 0,
                      active: 1,
                      theory_courses: 0,
                      sessional_courses: 0,
                    });
                  }}
                >
                  Add New Teacher
                </button>
              </h4>
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th> Initial </th>
                      <th> Name </th>
                      <th> Surname </th>
                      <th> Email </th>
                      <th> Seniority Rank </th>
                      <th> Active </th>
                      <th> Theory Courses </th>
                      <th> Sessional Courses </th>
                      <th> Action </th>
                    </tr>
                  </thead>
                  <tbody>
                    {teachers.map((teacher, index) => (
                      <tr key={index}>
                        <td> {teacher.initial} </td>
                        <td> {teacher.name} </td>
                        <td> {teacher.surname} </td>
                        <td> {teacher.email} </td>
                        <td> {teacher.seniority_rank} </td>
                        <td> {teacher.active} </td>
                        <td> {teacher.theory_courses} </td>
                        <td> {teacher.sessional_courses} </td>
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
                                setSelectedTeacher({ ...teacher, index })
                              }
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="btn btn-danger btn-sm"
                              onClick={() => setDeleteTeacher(index)}
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

      {selectedTeacher !== null && (
        <Modal
          show={true}
          onHide={() => setSelectedTeacher(null)}
          size="md"
          centered
        >
          <Modal.Header closeButton>Add / Edit Teacher</Modal.Header>
          <Modal.Body className="px-4">
            <Form className="px-2 py-1">
              <Row>
                <Col md={4} className="px-2 py-1">
                  <FormGroup>
                    <Form.Label>Initial</Form.Label>
                    <FormControl
                      type="text"
                      placeholder="Enter Initial"
                      value={selectedTeacher.initial}
                      onChange={(e) =>
                        setSelectedTeacher({
                          ...selectedTeacher,
                          initial: e.target.value,
                        })
                      }
                    />
                  </FormGroup>
                </Col>
                <Col className="px-2 py-1">
                  <FormGroup>
                    <Form.Label>Name</Form.Label>
                    <FormControl
                      type="text"
                      placeholder="Enter Name"
                      value={selectedTeacher.name}
                      onChange={(e) =>
                        setSelectedTeacher({
                          ...selectedTeacher,
                          name: e.target.value,
                        })
                      }
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={4} className="px-2 py-1">
                  <FormGroup>
                    <Form.Label>Surname</Form.Label>
                    <FormControl
                      type="text"
                      placeholder="Enter Surname"
                      value={selectedTeacher.surname}
                      onChange={(e) =>
                        setSelectedTeacher({
                          ...selectedTeacher,
                          surname: e.target.value,
                        })
                      }
                    />
                  </FormGroup>
                </Col>
                <Col className="px-2 py-1">
                  <FormGroup>
                    <Form.Label>Email</Form.Label>
                    <FormControl
                      type="text"
                      placeholder="Enter Email"
                      value={selectedTeacher.email}
                      onChange={(e) =>
                        setSelectedTeacher({
                          ...selectedTeacher,
                          email: e.target.value,
                        })
                      }
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={6} className="px-2 py-1">
                  <FormGroup>
                    <Form.Label>Seniority Rank</Form.Label>
                    <FormControl
                      type="text"
                      placeholder="Enter Seniority Rank"
                      value={selectedTeacher.seniority_rank}
                      onChange={(e) =>
                        setSelectedTeacher({
                          ...selectedTeacher,
                          seniority_rank: Number.parseInt(
                            e.target.value || "0"
                          ),
                        })
                      }
                    />
                  </FormGroup>
                </Col>
                <Col className="px-2 py-1 d-flex align-items-center">
                  {/* Currently Active Checkbox */}
                  <FormCheck
                    label="Currently Active"
                    checked={selectedTeacher.active}
                    onChange={(e) =>
                      setSelectedTeacher({
                        ...selectedTeacher,
                        active: e.target.checked,
                      })
                    }
                  />
                </Col>
              </Row>
              <Row>
                <Col md={6} className="px-2 py-1">
                  <FormGroup>
                    <Form.Label>Theory Courses</Form.Label>
                    <FormControl
                      type="text"
                      placeholder="Enter Number Theory Courses to take"
                      value={selectedTeacher.theory_courses}
                      onChange={(e) =>
                        setSelectedTeacher({
                          ...selectedTeacher,
                          theory_courses: Number.parseInt(
                            e.target.value || "0"
                          ),
                        })
                      }
                    />
                  </FormGroup>
                </Col>
                <Col className="px-2 py-1">
                  <FormGroup>
                    <Form.Label>Sessional Courses</Form.Label>
                    <FormControl
                      type="text"
                      placeholder="Enter Number Sessional Courses to take"
                      value={selectedTeacher.sessional_courses}
                      onChange={(e) =>
                        setSelectedTeacher({
                          ...selectedTeacher,
                          sessional_courses: Number.parseInt(
                            e.target.value || "0"
                          ),
                        })
                      }
                    />
                  </FormGroup>
                </Col>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="outline-dark"
              onClick={() => setSelectedTeacher(null)}
            >
              Close
            </Button>
            <Button
              variant="success"
              onClick={(e) => {
                e.preventDefault();
                const result = validate(selectedTeacher);
                if (result === null)
                  toast.success("Teacher saved successfully");
                else toast.error(result);
              }}
            >
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      <Modal
        show={deleteTeacher !== null}
        onHide={() => setDeleteTeacher(null)}
        size="md"
        centered
      >
        <Modal.Header closeButton>Delete Teacher</Modal.Header>
        <Modal.Body className="px-4">
          <p>Are you sure you want to delete this teacher?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-dark" onClick={() => setDeleteTeacher(null)}>
            Close
          </Button>
          <Button variant="danger">Delete</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
