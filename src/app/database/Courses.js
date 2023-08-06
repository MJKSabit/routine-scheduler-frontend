import { useEffect, useState } from "react";
import { Button, FormCheck, Modal } from "react-bootstrap";
import { Form, Row, Col, FormControl, FormGroup } from "react-bootstrap";

import { toast } from "react-hot-toast";

const validateCourse = (course) => {
  if (course.course_id === "") {
    return "Course ID cannot be empty";
  }
  if (course.course_name === "") {
    return "Course Name cannot be empty";
  }
  if (course.type === "") {
    return "Type cannot be empty";
  }
  if (course.batch === "") {
    return "Batch cannot be empty";
  }
  if (course.sections.length === 0) {
    return "Sections cannot be empty";
  }
  if (course.session === "") {
    return "Session cannot be empty";
  }
  if (course.class_per_week === "") {
    return "Class per week cannot be empty";
  }
  return null;
};

export default function Courses() {
  const sessionValue = ["January 2023", "June 2023"]; // it will be fetched from database

  const dummyCourses = [
    {
      course_id: "CSE 423",
      course_name: "Fault Tolerant Systems",
      type: "Theory",
      batch: 18,
      sections: ["A", "B"],
      session: "January 2023",
      class_per_week: 3,
    },
  ];

  const [courses, setCourses] = useState(dummyCourses);
  const [showModal, setShowModal] = useState(false);

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [deleteCourse, setDeleteCourse] = useState(null);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);

  const handleCheckboxChange = (e) => {
    const checkboxValue = e.target.value;
    const isChecked = e.target.checked;

    setSelectedCheckboxes((prevSelected) => {
      if (isChecked) {
        return [...prevSelected, checkboxValue];
      } else {
        return prevSelected.filter(item => item !== checkboxValue);
      }
    });

  };

  useEffect(() => {
    setSelectedCourse((prevSelectedCourse) => ({
      ...prevSelectedCourse,
      sections: selectedCheckboxes,
    }));
  }, [selectedCheckboxes]);


  return (
    <div>
      <div className="page-header">
        <h3 className="page-title"> Course Information </h3>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="!#" onClick={(event) => event.preventDefault()}>
                Database
              </a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Courses
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
                    setShowModal(true);
                    setSelectedCourse({
                      course_id: "",
                      course_name: "",
                      type: "Theory",
                      batch: 0,
                      sections: [],
                      session: sessionValue[0],
                      class_per_week: 0,
                    });
                  }}
                >
                  Add New Course
                </button>
              </h4>
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th> Course ID </th>
                      <th> Course Name </th>
                      <th> Type </th>
                      <th> Batch </th>
                      <th> Sections </th>
                      <th> Session </th>
                      <th> Class Per Week </th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map((course, index) => (
                      <tr key={index}>
                        <td> {course.course_id} </td>
                        <td> {course.course_name} </td>
                        <td> {course.type} </td>
                        <td> {course.batch} </td>
                        <td> {course.sections.join(", ")} </td>
                        <td> {course.session} </td>
                        <td> {course.class_per_week} </td>
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
                                {
                                  setSelectedCourse({ ...course, index }); setShowModal(true);
                              }}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="btn btn-danger btn-sm"
                              onClick={() => setDeleteCourse(index)}
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
      {showModal && selectedCourse !== null && (
        <Modal
          show={true}
          onHide={() => setSelectedCourse(null)}
          size="md"
          centered
        >
          <Modal.Header closeButton>Add / Edit Course</Modal.Header>
          <Modal.Body className="px-4">
            <Form className="px-2 py-1">
              <Row>
                <Col md={4} className="px-2 py-1">
                  <FormGroup>
                    <Form.Label>Course ID</Form.Label>
                    <FormControl
                      type="text"
                      placeholder="Enter Course ID"
                      value={selectedCourse.course_id}
                      onChange={(e) =>
                        setSelectedCourse({
                          ...selectedCourse,
                          course_id: e.target.value,
                        })
                      }
                    />
                  </FormGroup>
                </Col>
                <Col className="px-2 py-1">
                  <FormGroup>
                    <Form.Label>Course Name</Form.Label>
                    <FormControl
                      type="text"
                      placeholder="Enter Course Name"
                      value={selectedCourse.course_name}
                      onChange={(e) =>
                        setSelectedCourse({
                          ...selectedCourse,
                          course_name: e.target.value,
                        })
                      }
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col className="px-2 py-1">
                  <FormGroup>
                    <Form.Label>Class Per Week</Form.Label>
                    <FormControl
                      type="text"
                      placeholder="Enter Class Per Week"
                      value={selectedCourse.class_per_week}
                      onChange={(e) =>
                        setSelectedCourse({
                          ...selectedCourse,
                          class_per_week: Number.parseFloat(
                            e.target.value || "0"
                          ),
                        })
                      }
                    />
                  </FormGroup>
                </Col>

                <Col className="px-2 py-1">
                  <FormGroup>
                    <Form.Label>Batch</Form.Label>
                    <FormControl
                      type="text"
                      placeholder="Enter Batch"
                      value={selectedCourse.batch}
                      onChange={(e) =>
                        setSelectedCourse({
                          ...selectedCourse,
                          batch: Number.parseInt(e.target.value || "0"),
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
                      value={selectedCourse.type === "Theory" ? "0" : "1"}
                      onChange={(e) =>
                        setSelectedCourse({
                          ...selectedCourse,
                          type: e.target.value === "0" ? "Theory" : "Sessional",
                        })
                      }
                    >
                      <option value="0">Theory</option>
                      <option value="1">Sessional</option>
                    </Form.Select>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={4} className="px-2 py-1 d-flex align-items-center">
                  <FormGroup>
                    <Form.Label>Session</Form.Label>
                    <br />
                    <Form.Select
                      size="lg"
                      value={sessionValue.indexOf(selectedCourse.session)}
                      onChange={(e) =>
                        setSelectedCourse({
                          ...selectedCourse,
                          session:
                            sessionValue[Number.parseInt(e.target.value)],
                        })
                      }
                    >
                      <option value="0">{sessionValue[0]}</option>
                      <option value="1">{sessionValue[1]}</option>
                    </Form.Select>
                  </FormGroup>
                </Col>
                <Col md={6} className="px-2 py-1 d-flex align-items-center">
                  <FormGroup>
                    <Form.Label>Sections</Form.Label>
                    <br />
                    <Form>
                      <div className=" form-check-inline">
                        <input
                          name="group1"
                          type="checkbox"
                          className="form-check-input"
                          value="A"
                          checked={selectedCheckboxes.includes("A") || selectedCourse.sections.includes("A")}
                          onChange={handleCheckboxChange}
                        />
                        <label className="form-check-label">A</label>
                      </div>
                      <div className=" form-check-inline">
                        <input
                          name="group1"
                          type="checkbox"
                          className="form-check-input"
                          value="B"
                          checked={selectedCheckboxes.includes("B") || selectedCourse.sections.includes("B")}
                          onChange={handleCheckboxChange}
                        />
                        <label className="form-check-label">B</label>
                      </div>
                      <div className=" form-check-inline">
                        <input
                          name="group1"
                          type="checkbox"
                          className="form-check-input"
                          value="C"
                          checked={selectedCheckboxes.includes("C") || selectedCourse.sections.includes("C")}
                          onChange={handleCheckboxChange}
                        />
                        <label className="form-check-label">C</label>
                      </div>
                      <div className=" form-check-inline">
                        <input
                          name="group1"
                          type="checkbox"
                          className="form-check-input"
                          value="All"
                          checked={selectedCheckboxes.includes("All") || selectedCourse.sections.includes("All")}
                          onChange={handleCheckboxChange}
                        />
                        <label className="form-check-label">All</label>
                      </div>
                    </Form>
                  </FormGroup>
                </Col>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="outline-dark"
              onClick={() => setSelectedCourse(null)}
            >
              Close
            </Button>
            <Button
              variant="success"
              onClick={(e) => {
                e.preventDefault();

                // console.log(selectedCheckboxes,"first");
                
                const result = validateCourse(selectedCourse);
                if (result === null) {
                  toast.success("Course saved successfully");
                  console.log(selectedCourse);

                  setCourses((prevCourses) => [...prevCourses, selectedCourse]);
                  setSelectedCheckboxes([]);
                  // console.log(selectedCheckboxes,"last");
                } else toast.error(result);
              }}
            >
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      <Modal
        show={deleteCourse !== null}
        onHide={() => setDeleteCourse(null)}
        size="md"
        centered
      >
        <Modal.Header closeButton>Delete Course</Modal.Header>
        <Modal.Body className="px-4">
          <p>Are you sure you want to delete this course?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-dark" onClick={() => setDeleteCourse(null)}>
            Close
          </Button>
          <Button variant="danger">Delete</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
