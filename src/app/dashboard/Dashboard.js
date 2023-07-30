import React from "react";
import { ProgressBar } from "react-bootstrap";
// import {Bar, Doughnut} from 'react-chartjs-2';
import DatePicker from "react-datepicker";
import logo from "../logo.svg";

// import "react-datepicker/dist/react-datepicker.css";

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
                src={require("../../assets/images/dashboard/circle.svg").default}
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
                src={require("../../assets/images/dashboard/circle.svg").default}
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
                src={require("../../assets/images/dashboard/circle.svg").default}
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
    </div>
  );
}

export default App;
