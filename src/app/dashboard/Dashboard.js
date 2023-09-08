import React from "react";
import { useEffect, useState } from "react";
import { Alert, Button, Form, InputGroup, Modal } from "react-bootstrap";
import { getTheoryEmail,getScheduleEmail,getSessionalEmail } from "../api/dashboard";
import Emailtemplate from "./Emailtemplate";

function App() {
  const [theoryEmail, setTheoryEmail] = useState("");
  const [scheduleEmail, setScheduleEmail] = useState("");
  const [sessionalEmail, setSessionalEmail] = useState("");

  useEffect(() => {
    getTheoryEmail().then((res) => setTheoryEmail(res.email));
    getScheduleEmail().then((res) => setScheduleEmail(res.email));
    getSessionalEmail().then((res) => setSessionalEmail(res.email));
  }
  , []);


  
  return (
    <div>
      <div className="page-header">
        <h3 className="page-title">
          <span className="page-title-icon bg-gradient-primary text-white mr-2">
            <i className="mdi mdi-home"></i>
          </span>{" "}
          Dashboard{" "}
        </h3>
        <nav aria-label="breadcrumb">
          <ul className="breadcrumb">
            <li className="breadcrumb-item active" aria-current="page">
              <span></span>Overview{" "}
              <i className="mdi mdi-alert-circle-outline icon-sm text-primary align-middle"></i>
            </li>
          </ul>
        </nav>
      </div>
      <div className="row">
        <div className="col-md-4 stretch-card grid-margin">
          <div className="card bg-gradient-danger card-img-holder text-white">
            <div className="card-body">
              <img
                src={
                  require("../../assets/images/dashboard/circle.svg").default
                }
                className="card-img-absolute"
                alt="circle"
              />
              <h4 className="font-weight-normal mb-3">
                Current Session{" "}
                <i className="mdi mdi-cog-refresh-outline mdi-24px float-right"></i>
              </h4>
              <h2 className="mb-5">January 2023</h2>
              <h6 className="card-text">20% Complete</h6>
            </div>
          </div>
        </div>
        <div className="col-md-4 stretch-card grid-margin">
          <div className="card bg-gradient-info card-img-holder text-white">
            <div className="card-body">
              <img
                src={
                  require("../../assets/images/dashboard/circle.svg").default
                }
                className="card-img-absolute"
                alt="circle"
              />
              <h4 className="font-weight-normal mb-3">
                Current Progress{" "}
                <i className="mdi mdi-chart-line mdi-24px float-right"></i>
              </h4>
              <h2 className="mb-5">Schedule Collection</h2>
              <h6 className="card-text">35% Complete</h6>
            </div>
          </div>
        </div>
        <div className="col-md-4 stretch-card grid-margin">
          <div className="card bg-gradient-success card-img-holder text-white">
            <div className="card-body">
              <img
                src={
                  require("../../assets/images/dashboard/circle.svg").default
                }
                className="card-img-absolute"
                alt="circle"
              />
              <h4 className="font-weight-normal mb-3">
                Last Activity{" "}
                <i className="mdi mdi-diamond mdi-24px float-right"></i>
              </h4>
              <h2 className="mb-5">Prof. MMA</h2>
              <h6 className="card-text">Provided Schedule</h6>
            </div>
          </div>
        </div>
      </div>
      <Emailtemplate theoryEmail={theoryEmail} scheduleEmail={scheduleEmail} sessionalEmail={sessionalEmail}/>

      <div className="row">
        <div className="col-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title mb-4">Gmail Credentials</h4>
              <Alert variant="info" className="mb-3">
                <Alert.Heading>How to get Gmail Credentials?</Alert.Heading>
                <p>
                  <ol>
                    <li>
                      Go to{" "}
                      <a href="https://myaccount.google.com/lesssecureapps">
                        https://myaccount.google.com/lesssecureapps
                      </a>
                    </li>
                    <li>Turn on the option</li>
                    <li>Save the credentials</li>
                  </ol>
                </p>
              </Alert>
              <Form>
                <InputGroup className="mb-3">
                  <InputGroup.Text>Email</InputGroup.Text>
                  <Form.Control placeholder="Gmail Username" type="email" />
                  <InputGroup.Text>@gmail.com</InputGroup.Text>
                </InputGroup>
                <InputGroup className="mb-3">
                  <InputGroup.Text>Password</InputGroup.Text>
                  <Form.Control placeholder="Gmail Password" type="password" />
                </InputGroup>
                <Button className="btn-gradient-primary float-right">
                  Save
                </Button>
              </Form>
            </div>
          </div>
        </div>
      </div>

      <Modal show={false} onHide={() => {}}>
        <Modal.Header closeButton>
          <Modal.Title>Theory Course Preference</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <textarea
            className="form-control"
            rows="10"
            value={`Hello {teacher_name}! <br />;
I would like to request you to
fill up the form attached to this email for giving your preferred
theory course. <br />
{link} <br />
Thank you.`}
          ></textarea>
          <Alert variant="info" className="mt-3">
            Available Variables: <br /> <br />
            <code> teacher_name </code> <code> link </code>
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary">Close</Button>
          <Button variant="primary">Save changes</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default App;
