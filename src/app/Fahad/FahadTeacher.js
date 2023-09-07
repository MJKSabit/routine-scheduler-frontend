import React, { useEffect, useState } from "react"; // Import React as well
import { Button, Form, Badge } from "react-bootstrap";
import { toast } from "react-hot-toast";
import { sendFahadTest } from "../api/db-crud";

export default function FahadTeacher({ teacher, courses }) {

 
  


  const [initial, setInitial] = useState("");
  const [theoryCourses, setTheoryCourses] = useState([]);
  const [totalTheory, setTotalTheory] = useState(0); // Initialize totalTheory to 0
  const [theory, setTheory] = useState([]);
  const [disabled, setDisabled] = useState(false);



  useEffect(() => {
    if (courses && courses.length > 0) {
      var filterCourse = courses.filter((course) => course.type === 0);
      setTheoryCourses(filterCourse);
    }
  }, [courses]);

  const setInitialChange = (e) => {
    // Moved this part to useEffect to fix the initial teacher filter
    setInitial(e.target.value);
  };

  useEffect(() => {
    if (teacher) {
      var t = teacher.filter((teacher) => teacher.initial === initial);
      if (t.length > 0) {
        var rank = t[0].seniority_rank;
        if (rank >= 1 && rank <= 5) {
          setTotalTheory(rank);
        } else {
          setTotalTheory(5);
        }
      } else {
        toast.error("no teacher");
        setTotalTheory(0); // Reset totalTheory when no teacher is found
      }
    }
  }, [initial, teacher]);

  const handleTheory = (course_id) => {
    if (totalTheory > 0) {
      setTheory([...theory, { id: course_id }]);
      setTotalTheory(totalTheory - 1);
    } else {
      setDisabled(true);
      toast.error("no theory");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    sendFahadTest({
      initial: initial,
      theory: theory,
    })
      .then((res) => {
        toast.success("success");
      })
      .catch((err) => {
        toast.error("error");
      });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="exampleForm.ControlSelect1">
        <Form.Label>Teacher</Form.Label>
        <Form.Control
          type="text"
          value={initial} // Use value to bind the input to the state
          onChange={(e) => setInitialChange(e)}
        />
      </Form.Group>
      {theory.map((course) => (
        <Badge variant="primary" key={course.id}>
          {course.id}
        </Badge>
      ))}

      <Form.Group controlId="exampleForm.ControlSelect1">
        <Form.Label>Course</Form.Label>
        <Form.Control as="select" disabled={disabled} onChange={(e) => handleTheory(e.target.value)}>
          {theoryCourses.map((course) => (
            <option key={course.course_id}>{course.course_id}</option>
          ))}
        </Form.Control>
      </Form.Group>
      <Button type="submit">
        Submit
      </Button>
    </Form>
  );
}
