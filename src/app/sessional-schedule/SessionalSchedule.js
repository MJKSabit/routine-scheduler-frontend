import { useEffect, useRef } from "react";
import { useState } from "react";
import { finalize, getStatus, initiate } from "../api/theory-assign";
import { Alert, Button, FormCheck, Modal, ProgressBar } from "react-bootstrap";
import { Form, Row, Col, FormControl, FormGroup } from "react-bootstrap";
import ScheduleSelectionTable, { days } from "../shared/ScheduleSelctionTable";
import { getCourses, getSections } from "../api/db-crud";
import { toast } from "react-hot-toast";
import {
  getSchedules,
  setSchedules as setSchedulesAPI,
} from "../api/theory-schedule";

export default function SessionalSchedule() {
  const [selectedSlots, setSelectedSlots] = useState(new Set([]));
  const [schedules, setSchedules] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isChanged, setIsChanged] = useState(false);

  const batches = [
    ...new Set(
      sections.map((section) => `${section.batch} ${section.level_term}`)
    ),
  ];
  const sectionsForBatch = sections.filter(
    (section) => `${section.batch} ${section.level_term}` === selectedBatch
  );

  useEffect(() => {
    getSections().then((sections) => {
      setSections(sections.filter((section) => section.type === 1));
    });
    getCourses().then((courses) => {
      setCourses(courses);
    });
  }, []);

  useEffect(() => {
    if (selectedSection) {
      const [batch, section] = selectedSection.split(" ");
      getSchedules(batch, section).then((res) => {
        setSchedules(res);
      });
    }
  }, [selectedSection]);

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
                filled={
                  new Set([
                    ...days.map((day) => `${day} 2`),
                    ...schedules
                      .filter(
                        (s) =>
                          !selectedCourse ||
                          s.course_id !== selectedCourse.course_id
                      )
                      .map((slot) => `${slot.day} ${slot.time}`),
                  ])
                }
                selected={selectedSlots}
                onChange={(day, time, checked) => {
                  if (!selectedCourse) {
                    toast.error("Select a course first");
                    return;
                  }

                  if (checked) {
                    if (selectedSlots.size >= selectedCourse.class_per_week) {
                      toast.error(
                        `You can only select ${selectedCourse.class_per_week} slots`
                      );
                      return;
                    }
                    setIsChanged(true);
                    setSelectedSlots(
                      new Set([...selectedSlots, `${day} ${time}`])
                    );
                  } else {
                    setIsChanged(true);
                    setSelectedSlots((selected) => {
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
                <Form.Select
                  className="form-control-sm btn-block"
                  onChange={(e) => {
                    if (
                      e.target.value !== selectedBatch &&
                      isChanged &&
                      !window.confirm(
                        "You have unsaved changes. Are you sure you want to continue?"
                      )
                    ) {
                      e.target.value = selectedBatch;
                      return;
                    }
                    setSelectedBatch(e.target.value);
                    setSelectedSection(null);
                    setSelectedCourse(null);
                    setIsChanged(false);
                    setSelectedSlots(new Set([]));
                  }}
                >
                  <option
                    value={null}
                    selected={selectedBatch === null}
                    disabled
                  >
                    {" "}
                    Select Batch{" "}
                  </option>
                  {batches.map((batch) => (
                    <option value={batch} selected={selectedBatch === batch}>
                      {batch.split(" ")[1]}
                    </option>
                  ))}
                </Form.Select>
                <Form.Select
                  className="form-control-sm btn-block"
                  onChange={(e) => {
                    if (
                      e.target.value !== selectedSection &&
                      isChanged &&
                      !window.confirm(
                        "You have unsaved changes. Are you sure you want to continue?"
                      )
                    ) {
                      e.target.value = selectedSection;
                      return;
                    }
                    setSelectedSection(e.target.value);
                    setSelectedCourse(null);
                    setIsChanged(false);
                    setSelectedSlots(new Set([]));
                  }}
                >
                  <option
                    value={null}
                    selected={selectedSection === null}
                    disabled
                  >
                    {" "}
                    Select Section{" "}
                  </option>
                  {sectionsForBatch.map((section) => (
                    <option
                      value={`${section.batch} ${section.section}`}
                      selected={
                        selectedSection ===
                        `${section.batch} ${section.section}`
                      }
                    >
                      Section {section.section}
                    </option>
                  ))}
                </Form.Select>
                <div className="form-check btn-block">
                  <Form.Select
                    className="form-control-sm btn-block"
                    onChange={(e) => {
                      if (
                        selectedCourse &&
                        e.target.value !== selectedCourse.course_id &&
                        isChanged &&
                        !window.confirm(
                          "You have unsaved changes. Are you sure you want to continue?"
                        )
                      ) {
                        e.target.value = selectedCourse.course_id;
                        return;
                      }
                      setSelectedCourse(
                        courses.find((c) => c.course_id === e.target.value)
                      );
                      setIsChanged(false);
                      setSelectedSlots(
                        new Set(
                          schedules
                            .filter((s) => s.course_id === e.target.value)
                            .map((slot) => `${slot.day} ${slot.time}`)
                        )
                      );
                    }}
                  >
                    <option
                      value={null}
                      selected={selectedCourse === null}
                      disabled
                    >
                      {" "}
                      Select Course{" "}
                    </option>
                    {courses &&
                      courses
                        .filter((c) =>
                          c.sections
                            .map((s) => `${c.batch} ${s}`)
                            .includes(selectedSection)
                        )
                        .map((course) => (
                          <option
                            value={course.course_id}
                            selected={selectedCourse === course.course_id}
                          >
                            {course.course_id}
                          </option>
                        ))}
                  </Form.Select>
                  {selectedCourse && (
                    <ProgressBar
                      variant="success"
                      now={selectedSlots.size}
                      max={selectedCourse.class_per_week}
                      label={`Selected ${selectedSlots.size} / ${selectedCourse.class_per_week}`}
                      className="my-3"
                      style={{ height: "2rem" }}
                    />
                  )}
                </div>
                <Button
                  variant="primary"
                  className="btn-sm btn-block"
                  onClick={() => {
                    if (!selectedCourse) {
                      toast.error("Select a course first");
                      return;
                    }
                    const [batch, section] = selectedSection.split(" ");
                    setSchedulesAPI(
                      batch,
                      section,
                      selectedCourse.course_id,
                      [...selectedSlots].map((slot) => {
                        const [day, time] = slot.split(" ");
                        return { day, time };
                      })
                    ).then((res) => {
                      toast.success("Schedule saved");
                      setIsChanged(false);
                      getSchedules(batch, section).then(setSchedules);
                    });
                  }}
                >
                  {" "}
                  Assign{" "}
                </Button>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
