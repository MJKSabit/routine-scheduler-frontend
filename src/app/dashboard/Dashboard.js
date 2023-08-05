import React from "react";
import { Button, Card } from "react-bootstrap";

function App() {
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
      <div className="row">
        <div className="col-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title mb-5">Email Templates</h4>
              <div class="row flex-row flex-nowrap " style={{overflowX: 'auto'}}>
                <Card style={{ width: "28rem" }} bg="light" className="mr-3 col-4">
                  <Card.Body>
                    <Card.Title>
                      Theory Course{" "}
                      <i className="mdi mdi-email-open-outline mdi-24px float-right"></i>{" "}
                    </Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      For selecting course
                    </Card.Subtitle>
                    <Card.Text>
                      Hello {"{"}teacher_name{"}"}! <br />
                      I would like to request you to fill up the form attached
                      to this email for giving your preferred theory course.{" "}
                      <br />
                      {"{"}link{"}"} <br />
                      Thank you.
                    </Card.Text>
                    <Button variant="outline-success">Copy</Button>
                    <Button variant="outline-primary" className="float-right">
                      Edit
                    </Button>
                  </Card.Body>
                </Card>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
