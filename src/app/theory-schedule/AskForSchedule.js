import { useEffect, useRef } from "react";
import { useState } from "react";
import { Alert, Button, FormCheck, Modal, ModalBody } from "react-bootstrap";
import { Form, Row, Col, FormControl, FormGroup } from "react-bootstrap";
import { finalize, getStatus, initiate } from "../api/theory-schedule";
import CardWithButton from "../shared/CardWithButton";

export default function TheoryAskSchedule() {
  const [status, setStatus] = useState({
    status: 0,
    values: [],
    submitted: [],
  });

  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState([]);

  useEffect(() => {
    getStatus().then((res) => {
      setStatus({ values: [], submitted: [], ...res });
    });
  }, []);

  return (
    <div>
      <div className="page-header">
        <h3 className="page-title"> Theory Schedule Assign </h3>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="!#" onClick={(event) => event.preventDefault()}>
                Theory Schedule
              </a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Ask for Schedule
            </li>
          </ol>
        </nav>
      </div>
      <CardWithButton
        title="Send Email with Form Link"
        subtitle="Initial Phase"
        status={status.status === 0 ? "Not Sent" : "Sent"}
        bgColor={status.status === 0 ? "danger" : "success"}
        icon={status.status === 0 ? "mdi-autorenew" : "mdi-check"}
        disabled={status.status !== 0}
        onClick={(e) => {
          initiate().then((res) => {
            getStatus().then((res) => {
              setStatus({ values: [], submitted: [], ...res });
            });
          });
        }}
      />
      <div className="row">
        <div className="col-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Emailed, Yet to submit the form </h4>
              {status.values.length !== 0 && (
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th> Initial </th>
                        <th> Name </th>
                        <th> Email </th>
                        <th> Course </th>
                        <th> Action </th>
                      </tr>
                    </thead>
                    <tbody>
                      {status.values.map((teacher, index) => (
                        <tr key={index}>
                          <td> {teacher.initial} </td>
                          <td> {teacher.name} </td>
                          <td> {teacher.email} </td>
                          <td> {teacher.course_id} </td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-primary btn-sm"
                            >
                              Resend
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {status.values.length === 0 && status.status >= 2 && (
                <Alert variant="success text-center">
                  All submitted, proceed to next step
                </Alert>
              )}
              {status.values.length === 0 && status.status === 0 && (
                <Alert variant="warning text-center">
                  Initialize the process to send email
                </Alert>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Already Submitted</h4>
              {status.submitted.length !== 0 && (
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th> Initial </th>
                        <th> Name </th>
                        <th> Email </th>
                        <th> Action </th>
                      </tr>
                    </thead>
                    <tbody>
                      {status.submitted.map((teacher, index) => (
                        <tr key={index}>
                          <td> {teacher.initial} </td>
                          <td> {teacher.name} </td>
                          <td> {teacher.email} </td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-primary btn-sm"
                              onClick={() => {
                                setSelectedTeacher({
                                  ...teacher,
                                });
                              }}
                            >
                              Show
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {status.values.length === 0 && status.status === 0 && (
                <Alert variant="warning text-center">
                  Initialize the process to send email
                </Alert>
              )}
            </div>
          </div>
        </div>
      </div>

      {selectedTeacher && (
        <Modal show={true} onHide={() => setSelectedTeacher(null)} centered>
          <Modal.Header closeButton>
            <Modal.Title>
              {selectedTeacher.name} ({selectedTeacher.initial})
            </Modal.Title>
          </Modal.Header>
          <ModalBody>
            <h4>Selected Timeslots</h4>
            <ul>
              {JSON.parse(selectedTeacher.response).map((slot) => (<li>
                {slot.day} {slot.time}{slot.time%12 < 6 ? "PM" : "AM"} - {slot.batch} {slot.section}
              </li>))}
            </ul>
          </ModalBody>
          <Modal.Footer>
            <Button
              variant="outline-danger"
              onClick={() => setSelectedTeacher(null)}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      <CardWithButton
        title="Assign Schedule to teachers"
        subtitle="Final Phase"
        status={
          status.status < 2
            ? "Waiting for everones response"
            : "This Phase is Completed"
        }
        bgColor={status.status < 2 ? "secondary" : "success"}
        icon={status.status < 2 ? "mdi-cancel" : "mdi-check"}
        disabled={true}
        onClick={(e) => {
          finalize().then((res) => {
            getStatus().then((res) => {
              setStatus({ values: [], submitted: [], ...res });
            });
          });
        }}
      />
    </div>
  );
}
