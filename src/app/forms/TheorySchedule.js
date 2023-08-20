import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import { Button, Form, ProgressBar } from "react-bootstrap";
import { toast } from "react-hot-toast";
import { useParams } from "react-router-dom";
import {
  getTheoryPreferencesForm,
  getTheoryScheduleForm,
  submitTheoryPreferencesForm,
  submitTheoryScheduleForm,
} from "../api/form";
import ScheduleSelectionTable, { days } from "../shared/ScheduleSelctionTable";

export default function TheorySchedule() {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);

  const currentSectionSlots = new Set(
    selectedSlots
      .filter((s) => s.split(" / ")[1] === selectedSection)
      .map((slot) => slot.split(" / ")[0])
  );

  const isLastTeacher = form && form.teachers.length && form.teachers[form.teachers.length - 1].initial === form.initial;

  useEffect(() => {
    getTheoryScheduleForm(id).then((res) => {
      const alreadySelectedSlots = [];
      res.sections.forEach((section) => {
        if (section.schedule === null)
          section.schedule = [];
        section.schedule
          .filter((s) => s.course_id === res.course_id)
          .forEach((slot) => {
            alreadySelectedSlots.push(
              `${slot.day} ${slot.time} / ${section.batch} ${section.section}`
            );
          });
      });
      setForm(res);
      setSections(res.sections);
      setSelectedSlots(alreadySelectedSlots);
    });
  }, [id]);

  useEffect(() => {
    if (form && selectedSection) {
      setSchedules(
        form.sections.find((s) => `${s.batch} ${s.section}` === selectedSection)
          .schedule
      );
    }
  }, [form, selectedSection]);

  return (
    <div>
      <div className="d-flex align-items-center auth px-0">
        <div className="row w-100 mx-0">
          <div className="col-lg-10 mx-auto">
            <div className="auth-form-light text-left py-5 px-4 px-sm-5">
              <div className="brand-logo">
                <img
                  src={require("../../assets/images/logo.svg").default}
                  alt="logo"
                />
              </div>
              <h4>Theory Schedule Preference</h4>
              <h6 className="font-weight-light">
                {form &&
                  `${
                    form.teachers.filter((t) => t.initial === form.initial)[0]
                      .name
                  } (${form.initial}))`}
              </h6>

              <div className="row">
                <div className="col-10">
                  <ScheduleSelectionTable
                    filled={
                      new Set([
                        ...days.map((day) => `${day} 2`),
                        ...schedules.map((slot) => `${slot.day} ${slot.time}`),
                      ])
                    }
                    onChange={(day, time, checked) => {
                      if (!selectedSection) {
                        toast.error("Please select a section first");
                        return;
                      }
                      if (checked) {
                        if (currentSectionSlots.size >= form.class_per_week) {
                          toast.error(
                            "You have already entered the maximum number of classes per week for this section"
                          );
                          return;
                        }
                        setSelectedSlots([
                          ...selectedSlots,
                          `${day} ${time} / ${selectedSection}`,
                        ]);
                      } else {
                        setSelectedSlots(
                          selectedSlots.filter(
                            (slot) =>
                              slot !== `${day} ${time} / ${selectedSection}`
                          )
                        );
                      }
                    }}
                    selected={currentSectionSlots}
                  />
                </div>
                <div className="col-2">
                  <h4>{form && form.course_id} </h4>
                  <ul>
                    {form &&
                      form.teachers.map((teacher) => <li> {teacher.name} </li>)}
                  </ul>
                  <h4>Select Section</h4>
                  <Form>
                    <Form.Select
                      className="form-control-sm btn-block text-dark"
                      onChange={(e) => {
                        setSelectedSection(e.target.value);
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
                      {sections.map((section) => (
                        <option
                          value={`${section.batch} ${section.section}`}
                          selected={
                            selectedSection ===
                            `${section.batch} ${section.section}`
                          }
                        >
                          {section.level_term} - Section {section.section}
                        </option>
                      ))}
                    </Form.Select>
                    {form && (
                      <>
                        <p className="mt-2">
                          Provided {selectedSlots.length} of{" "}
                          {form.class_per_week * form.sections.length} slots
                        </p>
                        <ProgressBar
                          variant="success"
                          now={selectedSlots.length}
                          max={form.class_per_week * form.sections.length}
                          label={`Selected ${selectedSlots.length} / ${
                            form.class_per_week * form.sections.length
                          }`}
                          className="my-3"
                          style={{ height: "2rem" }}
                        />
                      </>
                    )}
                  </Form>

                  <Button variant="primary" className="btn-sm btn-block" onClick={e => {
                    if (form.class_per_week * form.sections.length !== selectedSlots.length) {
                      if (isLastTeacher) {
                        toast.error("Please select all the slots");
                        return;
                      } else {
                        if (!window.confirm("You have not selected all the slots. Are you sure you want to submit?"))
                          return;
                      }
                    }
                    submitTheoryScheduleForm(id, selectedSlots.map(slot => {
                      const [day, time] = slot.split(" / ")[0].split(" ");
                      const [batch, section] = slot.split(" / ")[1].split(" ");
                      return {
                        day,
                        time,
                        batch,
                        section
                      }
                    })).then(res => {
                      toast.success("Submitted successfully");
                    })
                  }}>
                    {" "}
                    Submit{" "}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
