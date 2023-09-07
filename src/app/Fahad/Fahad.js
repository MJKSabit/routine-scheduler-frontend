import { useState, useEffect } from "react";
import {
  getCourses,
  getTeachers,
} from "../api/db-crud";
import FahadTeacher from "./FahadTeacher";
import { Container,Row,Col } from "react-bootstrap";


export default function Fahad() {

  const [teachers, setTeachers] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    getTeachers().then((res) => {
      setTeachers(res);
    });
    getCourses().then((res) => {
      setCourses(res);
    });

  }, []);





  return (

    <Container>
      <Row>
        <Col>
        {
          teachers && courses && <FahadTeacher  teacher={teachers} courses={courses}/>
        }
          
        </Col>
        <Col>
          <FahadTeacher />
        </Col>
      </Row>
    </Container>


    
  );
};

