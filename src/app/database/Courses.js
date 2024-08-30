import { useEffect, useState } from "react";
import { Button, FormCheck, Modal } from "react-bootstrap";
import { Form, Row, Col, FormControl, FormGroup } from "react-bootstrap";

import { toast } from "react-hot-toast";
import {
  addCourse,
  deleteCourse,
  editCourse,
  getCourses,
  getSections,
} from "../api/db-crud";

const validateCourse = (course) => {
  if (course.course_id === "") {
    return "Course ID cannot be empty";
  }
  if (course.name === "") {
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
  const sessionValue = ["Jan-23"]; // it will be fetched from database

  const [sections, setSections] = useState([]);
  const [courses, setCourses] = useState([]);

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [deleteCourseSelected, setDeleteCourseSelected] = useState(null);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);

  const handleCheckboxChange = (e) => {
    const checkboxValue = e.target.value;
    const isChecked = e.target.checked;

    setSelectedCheckboxes((prevSelected) => {
      if (isChecked) {
        return [...prevSelected, checkboxValue];
      } else {
        return prevSelected.filter((item) => item !== checkboxValue);
      }
    });
  };

  useEffect(() => {
    getCourses().then((res) => {
      setCourses(res);
    });
    getSections().then((res) => {
      setSections(res);
    });
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      setSelectedCourse((prevSelectedCourse) => ({
        ...prevSelectedCourse,
        sections: selectedCheckboxes,
      }));
    }
  }, [selectedCheckboxes]);

  useEffect(() => {
    if (selectedCourse) {
      setSelectedCheckboxes(selectedCourse.sections);
    }
  }, [selectedCourse]);

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
                    setSelectedCourse({
                      course_id: "",
                      name: "",
                      type: 0,
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
                        <td> {course.name} </td>
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
                              onClick={() => {
                                setSelectedCourse({
                                  ...course,
                                  index,
                                  prev_course_id: course.course_id,
                                  prev_session: course.session,
                                });
                              }}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="btn btn-danger btn-sm"
                              onClick={() => setDeleteCourseSelected(course)}
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
      {selectedCourse !== null && (
        <Modal
          show={true}
          onHide={() => setSelectedCourse(null)}
          size="md"
          centered
        >
          <Modal.Header closeButton>
            {" "}
            {selectedCourse.prev_course_id ? "Edit" : "Add"} Course
          </Modal.Header>
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
                      value={selectedCourse.name}
                      onChange={(e) =>
                        setSelectedCourse({
                          ...selectedCourse,
                          name: e.target.value,
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

                <Col md={4} className="px-2 py-1 d-flex align-items-center">
                  <FormGroup>
                    <Form.Label>Type</Form.Label>
                    <br />
                    <Form.Select
                      size="lg"
                      value={selectedCourse.type}
                      onChange={(e) =>
                        setSelectedCourse({
                          ...selectedCourse,
                          type: e.target.value === "0" ? 0 : 1,
                        })
                      }
                    >
                      <option value="0">Theory</option>
                      <option value="1">Sessional</option>
                    </Form.Select>
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
                      {sessionValue.map((session, index) => (
                        <option key={index} value={index}>
                          {session}
                        </option>
                      ))}
                    </Form.Select>
                  </FormGroup>
                </Col>
                <Col md={8} className="px-2 py-1 d-flex align-items-center">
                  <FormGroup>
                    <Form.Label>Sections</Form.Label>
                    <br />
                    <Form>
                      {sections
                        .filter(
                          (s) =>
                            s.batch === selectedCourse.batch &&
                            s.type === selectedCourse.type &&
                            s.session === selectedCourse.session
                        )
                        .map((section, index) => (
                          <div className=" form-check-inline">
                            <input
                              name="group1"
                              type="checkbox"
                              className="form-check-input"
                              value={section.section}
                              checked={
                                selectedCheckboxes.includes(section.section) ||
                                selectedCourse.sections.includes(
                                  section.section
                                )
                              }
                              onChange={handleCheckboxChange}
                            />
                            <label className="form-check-label">
                              {section.section}
                            </label>
                          </div>
                        ))}
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
                const possibleSections = sections
                  .filter(
                    (s) =>
                      s.batch === selectedCourse.batch &&
                      s.type === selectedCourse.type &&
                      s.session === selectedCourse.session
                  )
                  .map((s) => s.section);
                selectedCourse.sections = selectedCheckboxes.filter((s) =>
                  possibleSections.includes(s)
                );
                console.log(selectedCourse.sections);
                const result = validateCourse(selectedCourse);
                if (result === null) {
                  if (selectedCourse.prev_course_id) {
                    editCourse(
                      selectedCourse.prev_course_id,
                      selectedCourse
                    ).then((res) => {
                      toast.success("Course updated successfully");
                      setCourses((prevCourses) =>
                        prevCourses.map((c) =>
                          c.course_id === selectedCourse.prev_course_id
                            ? selectedCourse
                            : c
                        )
                      );
                      setSelectedCourse(null);
                      setSelectedCheckboxes([]);
                    });
                  } else {
                    addCourse(selectedCourse).then((res) => {
                      toast.success("Course added successfully");
                      setCourses((prevCourses) => [...prevCourses, res]);
                      setSelectedCourse(null);
                      setSelectedCheckboxes([]);
                    });
                  }

                  toast.success("Course saved successfully");
                  console.log(selectedCourse);

                  setCourses((prevCourses) => [
                    ...prevCourses.filter(
                      (c) => c.course_id !== selectedCourse.course_id
                    ),
                    selectedCourse,
                  ]);
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

      {deleteCourseSelected !== null && (
        <Modal
          show={deleteCourseSelected !== null}
          onHide={() => setDeleteCourseSelected(null)}
          size="md"
          centered
        >
          <Modal.Header closeButton>Delete {deleteCourseSelected.course_id}</Modal.Header>
          <Modal.Body className="px-4">
            <p>Are you sure you want to delete this course?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="outline-dark"
              onClick={() => setDeleteCourseSelected(null)}
            >
              Close
            </Button>
            <Button
              variant="danger"
              onClick={(e) => {
                deleteCourse(deleteCourseSelected.course_id).then((res) => {
                  toast.success("Course deleted successfully");
                  setCourses((prevCourses) =>
                    prevCourses.filter(
                      (c) => c.course_id !== deleteCourseSelected.course_id
                    )
                  );
                  setDeleteCourseSelected(null);
                });
              }}
            >
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}
