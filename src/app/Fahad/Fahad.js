import { useState, useEffect } from "react";
import {
  getTeachers,
} from "../api/db-crud";
import FahadTeacher from "./FahadTeacher";


export default function Fahad() {

  const [teachers, setTeachers] = useState([]);
  const [teacher, setTeacher] = useState({});

  useEffect(() => {
    getTeachers().then((res) => {
      setTeachers(res);
    });
  }, []);

  const handleRowHover = (teacher) => {
    setTeacher(teacher);
    console.log(teacher)
  };

  const handleRowLeave = () => {
    setTeacher('');
  };

  return (
    <div>
      <div className="row">
        <div className="col-4 grid-margin">
          <div className="card">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th> Initial </th>
                    </tr>
                  </thead>
                  <tbody>
                    {teachers.map((teacher, index) => (
                      <tr key={index}  onMouseEnter={() => handleRowHover(teacher)}
                      onMouseLeave={handleRowLeave}>
                        <td> {teacher.initial} </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <FahadTeacher teacher={teacher} ongo={1} />
      </div>
    </div>
  );
};

