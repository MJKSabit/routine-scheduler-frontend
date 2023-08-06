import { useEffect } from "react";
import { useState } from "react";
import { getStatus, initiate } from "../api/theory-assign";
import { Alert } from "react-bootstrap";

export default function TheoryPreference() {
  const [status, setStatus] = useState({ status: 0, values: [] });

  useEffect(() => {
    getStatus().then((res) => {
      setStatus({ values: [], ...res });
    });
  }, []);

  return (
    <div>
      <div className="page-header">
        <h3 className="page-title"> Theory Course Assign </h3>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">Phases</li>
          </ol>
        </nav>
      </div>
      <div className="row">
        <div className="col stretch-card grid-margin">
          <div
            className={`card bg-gradient-${
              status.status === 0 ? "danger" : "success"
            } card-img-holder text-white`}
          >
            <div className="card-body">
              <img
                src={
                  require("../../assets/images/dashboard/circle.svg").default
                }
                className="card-img-absolute"
                alt="circle"
              />
              <h4 className="font-weight-normal mb-3">
                Send Email with Form Link{" "}
                <button
                  disabled={status.status !== 0}
                  type="button"
                  className="btn btn-rounded btn-light btn-sm float-right position-relative z-index-3"
                  onClick={(e) => {
                    initiate().then((res) => {
                      getStatus().then((res) => {
                        setStatus({ values: [], ...res });
                      });
                    });
                  }}
                >
                  <i
                    className={`mdi ${
                      status.status === 0 ? "mdi-autorenew" : "mdi-check"
                    } mdi-24px float-right`}
                  ></i>
                </button>
              </h4>
              <h2 className="mb-5">Initial Phase</h2>
              <h6 className="card-text">
                {status.status === 0 ? "Not Sent" : "Sent"}
              </h6>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Yet to submit the form </h4>
              {status.values.length !== 0 && (
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
                      {status.values.map((teacher, index) => (
                        <tr key={index}>
                          <td> {teacher.initial} </td>
                          <td> {teacher.name} </td>
                          <td> {teacher.email} </td>
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
                <Alert variant="success text-center">All submitted, waiting for next phase</Alert>
              )}
              {status.values.length === 0 && status.status == 0 && (
                <Alert variant="warning text-center">Initialize the process to send email</Alert>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col stretch-card grid-margin">
          <div
            className={`card bg-gradient-${
              status.status < 2
                ? "danger"
                : status.status === 2
                ? "info"
                : "success"
            } card-img-holder text-white`}
          >
            <div className="card-body">
              <img
                src={
                  require("../../assets/images/dashboard/circle.svg").default
                }
                className="card-img-absolute"
                alt="circle"
              />
              <h4 className="font-weight-normal mb-3">
                Assign Teachers according to Seniorty{" "}
                <button
                  disabled={status.status !== 2}
                  type="button"
                  className="btn btn-rounded btn-light btn-sm float-right position-relative z-index-3"
                >
                  <i
                    className={`mdi ${
                      status.status < 2
                        ? "mdi-cancel"
                        : status.status === 2
                        ? "mdi-autorenew"
                        : "mdi-check"
                    } mdi-24px float-right`}
                  ></i>
                </button>
              </h4>
              <h2 className="mb-5">Final Phase</h2>
              <h6 className="card-text">
                Only Avaliable when everybody submitted
              </h6>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
