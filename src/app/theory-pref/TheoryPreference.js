import { useState } from "react";

export default function TheoryPreference() {
  const [phase, setPhase] = useState(1);
  const [teachers, setTeachers] = useState([]);

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
                Send Email with Form Link{" "}
                <button
                  type="button"
                  className="btn btn-rounded btn-light btn-sm float-right"
                >
                  <i className="mdi mdi-autorenew mdi-24px float-right"></i>
                </button>
              </h4>
              <h2 className="mb-5">Initial Phase</h2>
              <h6 className="card-text">Not Initiated</h6>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
      <div className="col-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">
                Yet to submit the form{" "}
              </h4>
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
                    {teachers.map((teacher, index) => (
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
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col stretch-card grid-margin">
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
                Assign Teachers according to Seniorty{" "}
                <button
                  disabled
                  type="button"
                  className="btn btn-rounded btn-light btn-sm float-right"
                >
                  <i className="mdi mdi-autorenew mdi-24px float-right"></i>
                </button>
              </h4>
              <h2 className="mb-5">Final Phase</h2>
              <h6 className="card-text">Only Avaliable when everybody submitted</h6>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
