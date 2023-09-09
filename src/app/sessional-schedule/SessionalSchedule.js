import { useEffect, useRef } from "react";
import { useState } from "react";
import { finalize, getStatus, initiate } from "../api/theory-assign";
import { Alert, Button, FormCheck, Modal, ProgressBar } from "react-bootstrap";
import { Form, Row, Col, FormControl, FormGroup } from "react-bootstrap";
import ScheduleSelectionTable, {
  days,
  possibleLabTimes,
} from "../shared/ScheduleSelctionTable";
import { getCourses, getSections } from "../api/db-crud";
import { toast } from "react-hot-toast";
import {
  getSchedules as getTheorySchedules,
  setSchedules as setSchedulesAPI,
} from "../api/theory-schedule";
import { MultiSet, set } from "mnemonist";

export default function SessionalSchedule() {
  const [theorySchedules, setTheorySchedules] = useState([]);
  const [labSchedules, setLabSchedules] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isChanged, setIsChanged] = useState(false);
  const [dualCheck, setDualCheck] = useState(MultiSet.from([]));

  const batches = [
    ...new Set(
      sections.map((section) => `${section.batch} ${section.level_term}`)
    ),
  ];

  const sectionsForBatch = sections.filter(
    (section) => `${section.batch} ${section.level_term}` === selectedBatch
  );

  const filledTheorySlots = new Set(
    theorySchedules.map((slot) => `${slot.day} ${slot.time}`)
  );

  const labTimes = [];
  days.forEach((day) => {
    possibleLabTimes.forEach((time) => {
      if (
        !filledTheorySlots.has(`${day} ${time}`) &&
        !filledTheorySlots.has(`${day} ${(time + 1) % 12}`) &&
        !filledTheorySlots.has(`${day} ${(time + 2) % 12}`)
      ) {
        labTimes.push(`${day} ${time}`);
      }
    });
  });

  const selectedLabSlots = labSchedules
    .filter((slot) => slot.course_id !== selectedCourse?.course_id)
    .map((slot) => `${slot.day} ${slot.time}`);

  console.log(selectedLabSlots);

  const selectedCourseSlots = labSchedules
    .filter((slot) => slot.course_id === selectedCourse?.course_id)
    .map((slot) => `${slot.day} ${slot.time}`);

  console.log(selectedCourseSlots);

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
      let [batch, section] = selectedSection.split(" ");
      section = section.substring(0, 1);
      getTheorySchedules(batch, section).then((res) => {
        setTheorySchedules(res);
      });
      setLabSchedules([]);
    } else {
      setTheorySchedules([]);
      setLabSchedules([]);
    }
  }, [selectedSection]);

  return (
    <div>
      <div className="page-header">
        <h3 className="page-title"> Sessional Schedule Assign </h3>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item active" aria-current="page">
              Sessional Schedule
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
                filled={[...filledTheorySlots, ...selectedLabSlots]}
                selected={selectedCourseSlots}
                onChange={(day, time, checked) => {
                  if (!selectedCourse) {
                    toast.error("Select a course first");
                    return;
                  }

                  if (labTimes.findIndex((slot) => slot === `${day} ${time}`) === -1) {
                    toast.error("You can only select lab slots");
                    return;
                  }

                  if (checked) {
                    if (
                      selectedCourseSlots.length >=
                      Math.ceil(selectedCourse.class_per_week)
                    ) {
                      toast.error(
                        `You can only select ${Math.ceil(
                          selectedCourse.class_per_week
                        )} slots`
                      );
                      return;
                    }

                    if (
                      selectedCourse.class_per_week >= 1 &&
                      dualCheck.has(`${day} ${time}`)
                    ) {
                      toast.error(
                        `You can only select 0.75 credit course for dual slot`
                      );
                      return;
                    }

                    if (selectedCourse.class_per_week === 0.5) {
                      setDualCheck((dualCheck) => {
                        dualCheck.add(`${day} ${time}`);
                        return dualCheck;
                      });
                    }

                    setIsChanged(true);
                    setLabSchedules([
                      ...labSchedules,
                      { day, time, course_id: selectedCourse.course_id },
                    ]);
                  } else {
                    if (selectedCourse.class_per_week === 0.5) {
                      setDualCheck((dualCheck) => {
                        dualCheck.remove(`${day} ${time}`);
                        return dualCheck;
                      });
                    }
                    setIsChanged(true);
                    setLabSchedules(
                      labSchedules.filter(
                        (slot) =>
                          !(
                            slot.day === day &&
                            slot.time === time &&
                            slot.course_id === selectedCourse.course_id
                          )
                      )
                    );
                  }
                }}
                labTimes={labTimes}
                dualCheck={dualCheck}
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
                    // setSelectedSlots(new Set([]));
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
                    // setSelectedSlots(new Set([]));
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
                      setSelectedCourse(
                        courses.find((c) => c.course_id === e.target.value)
                      );
                      // setSelectedSlots(
                      //   new Set(
                      //     theorySchedules
                      //       .filter((s) => s.course_id === e.target.value)
                      //       .map((slot) => `${slot.day} ${slot.time}`)
                      //   )
                      // );
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
                      now={selectedCourseSlots.length}
                      max={selectedCourse.class_per_week}
                      label={`Selected ${selectedCourseSlots.length} / ${selectedCourse.class_per_week}`}
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
                    // setSchedulesAPI(
                    //   batch,
                    //   section,
                    //   selectedCourse.course_id,
                    //   [...selectedLabSlots].map((slot) => {
                    //     const [day, time] = slot.split(" ");
                    //     return { day, time };
                    //   })
                    // ).then((res) => {
                    //   toast.success("Schedule saved");
                    //   setIsChanged(false);
                    //   getTheorySchedules(batch, section).then(
                    //     setTheorySchedules
                    //   );
                    // });
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
