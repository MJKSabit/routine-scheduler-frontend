import { useEffect, useRef } from "react";
import { useState } from "react";
import { finalize, getStatus, initiate } from "../api/theory-assign";
import { Alert, Button, FormCheck, Modal } from "react-bootstrap";
import { Form, Row, Col, FormControl, FormGroup } from "react-bootstrap";
import ScheduleSelectionTable, { days } from "../shared/ScheduleSelctionTable";

export default function TheoryPreference() {
  const [selected, setSelected] = useState(new Set([]));
  const [onlyNonDept, setOnlyNonDept] = useState(true);

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
              Fixed Schedule
            </li>
          </ol>
        </nav>
      </div>
      <div className="row">
        <div className="col-9 grid-margin">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Schedule </h4>
              <ScheduleSelectionTable
                filled={new Set(days.map((day) => `${day} 2`))}
                selected={selected}
                onChange={(day, time, checked) => {
                  if (checked) {
                    setSelected(new Set([...selected, `${day} ${time}`]));
                  } else {
                    setSelected((selected) => {
                      const newSelected = new Set(selected);
                      newSelected.delete(`${day} ${time}`);
                      return newSelected;
                    });
                  }
                }}
              />
            </div>
          </div>
        </div>

        <div className="col-3 grid-margin">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Select Course </h4>
              <Form>
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    checked={onlyNonDept}
                    onChange={(e) => setOnlyNonDept(e.target.checked)}
                    id="flexCheckDefault"
                  />
                  <label class="form-check-label" for="flexCheckDefault">
                    Non-departmental only
                  </label>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
