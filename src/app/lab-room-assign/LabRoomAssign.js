import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import { Button } from "react-bootstrap";
import { toast } from "react-hot-toast";

import { getLabCourses, getLabRooms } from "../api/db-crud";

export default function LabRoomAssign() {
  const [offeredCourse, setOfferedCourse] = useState([
    // { course_id: "CSE 101", name: "Introduction to Computer Science" },
    // { course_id: "CSE 102", name: "Introduction to Programming" },
    // { course_id: "CSE 103", name: "Discrete Mathematics" },
  ]);

  const [rooms, setRooms] = useState([
    // { room: "MCL" },
    // { room: "MML" },
    // { room: "CL" },
    // { room: "SEL" },
    // { room: "NL" },
  ]);

  const [courseRoom, setCourseRoom] = useState([
    // { course_id: "CSE 101", rooms: ["MCL", "MML"] },
  ]);

  useEffect(() => {
    getLabRooms().then((res) => {
      // console.log(res);
      setRooms(res);
    });
    getLabCourses().then((res) => {
      // console.log(res);
      setOfferedCourse(res);
    });
  }, []);

  const uniqueNames = {};

  // Filter and show only the unique named courses
  const uniqueNamedCourses = offeredCourse.filter((obj) => {
    if (!uniqueNames[obj.name]) {
      uniqueNames[obj.name] = true;
      return true;
    }
    return false;
  });

  const maxAllowed = Math.ceil(offeredCourse.length / rooms.length);
  const roomAlloc = rooms.map((room) => {
    return {
      room: room.room,
      count: 0,
      courses: [],
    };
  });

  // console.log(roomAlloc);

  const labRoomAssignHandler = () => {

    let remainedCourse = offeredCourse;
    // for constraints
    courseRoom.map((item) => {
      
      let minCount = Infinity;
      let minIndex = -1;

      // console.log(item.rooms);

      item.rooms.map((room) => {
        const room_index = rooms.findIndex((r) => r.room === room);
        // console.log(index, roomAlloc[index].count);
        if (roomAlloc[room_index].count < minCount) {
          minCount = roomAlloc[room_index].count;
          minIndex = room_index;
        }
      });

      const courses = offeredCourse.filter((course) => course.course_id === item.course_id);
      remainedCourse = offeredCourse.filter((course) => course.course_id !== item.course_id)
      // console.log("for ",roomAlloc[room_index].room, minIndex);
      roomAlloc[minIndex].count += courses.length;
      roomAlloc[minIndex].courses.push(...courses);
    });


    // console.log(remainedCourse);

    // for remaining courses
    roomAlloc.map((room) => {
      if (room.count < maxAllowed) {
        const courses = remainedCourse.splice(0, maxAllowed - room.count);
        room.count += courses.length;
        room.courses.push(...courses);
        remainedCourse = remainedCourse.filter((course) => !courses.includes(course));
      }
    }
    );

    // lab room assignment in this roomAlloc array


    console.log(roomAlloc);

    

  }

  // console.log(uniqueNamedCourses);

  const selectedCourseRef = useRef();
  const selectedRoomRef = useRef();

  return (
    <div>
      <div className="page-header">
        <h3 className="page-title"> Lab Room Assignment </h3>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">Room Assign</li>
          </ol>
        </nav>
      </div>

      <div className="row">
        <div className="col stretch-card grid-margin">
          <div
            className={`card bg-gradient-success card-img-holder text-white`}
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
                In this stage, provide constraints for different labs with
                different lab rooms
                <button
                  type="button"
                  className="btn btn-rounded btn-light btn-sm float-right position-relative z-index-3 box box-hover"
                  onClick={(e) => {}}
                >
                  <i className={"mdi mdi-autorenew mdi-24px float-right"}></i>
                </button>
              </h4>
              <h2 className="mb-5">Initial Phase</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center auth px-0">
                <div className="row w-100 mx-0">
                  <div className="col-lg-12 mx-auto">
                    <div className="auth-form-light text-left py-5 px-4 px-sm-5">
                      <div className="brand-logo">
                        <img
                          src={require("../../assets/images/logo.svg").default}
                          alt="logo"
                        />
                      </div>
                      <h4>Sessional Constraints</h4>
                      <h6 className="font-weight-light">
                        {courseRoom.map((item) => (
                          <div>
                            {item.course_id} Must Use {item.rooms.join(", ")}
                          </div>
                        ))}
                      </h6>
                      <form>
                        <div className="row">
                          <div className="col-5" style={{ padding: 10 }}>
                            <select
                              class="form-select"
                              multiple
                              aria-label="multiple select example"
                              style={{ height: 400, width: "100%" }}
                              ref={selectedCourseRef}
                            >
                              {uniqueNamedCourses.map((course) => (
                                <option value={course.course_id}>
                                  {course.course_id} - {course.name}
                                </option>
                              ))}
                            </select>

                            <h5 className="text-end m-2">Courses</h5>
                          </div>

                          <div
                            className="col-2 d-flex flex-column justify-content-between"
                            style={{ padding: 30 }}
                          >
                            <div className="d-grid gap-5 mt-5">
                              <Button
                                variant="outline-success"
                                size="sm"
                                className="mb-2 btn-block"
                                onClick={(e) => {
                                  const selectedCourseOptions = Array.from(
                                    selectedCourseRef.current.selectedOptions
                                  )
                                    .map((option) => option.value)
                                    .map((course_id) =>
                                      uniqueNamedCourses.find(
                                        (course) =>
                                          course.course_id === course_id
                                      )
                                    );

                                  const selectedRoomOptions = Array.from(
                                    selectedRoomRef.current.selectedOptions
                                  )
                                    .map((option) => option.value)
                                    .map((room_id) =>
                                      rooms.find(
                                        (room) => room.room === room_id
                                      )
                                    );

                                  selectedCourseOptions.map((course) => {
                                    setCourseRoom([
                                      ...courseRoom,
                                      {
                                        course_id: course.course_id,
                                        rooms: selectedRoomOptions.map(
                                          (room) => room.room
                                        ),
                                      },
                                    ]);
                                  });
                                }}
                              >
                                Must Use
                              </Button>
                              <Button variant="outline-danger" size="sm" onClick={labRoomAssignHandler}>Save</Button>
                            </div>
                          </div>

                          <div className="col-5" style={{ padding: 10 }}>
                            <select
                              class="form-select"
                              multiple
                              aria-label="multiple select example"
                              style={{ height: 400, width: "100%" }}
                              ref={selectedRoomRef}
                            >
                              {rooms.map((room) => (
                                <option value={room.room}>{room.room}</option>
                              ))}
                            </select>
                            <h5 className="text-start m-2">Rooms</h5>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
