import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import { Button, CloseButton, Badge } from "react-bootstrap";
import { toast } from "react-hot-toast";

import { getLabCourses, getLabRooms } from "../api/db-crud";
import CardWithButton from "../shared/CardWithButton";

export default function LabRoomAssign() {
  const [offeredCourse, setOfferedCourse] = useState([
    // { course_id: "CSE 101", name: "Introduction to Computer Science" },
    // { course_id: "CSE 102", name: "Introduction to Programming" },
    // { course_id: "CSE 103", name: "Discrete Mathematics" },
  ]);

  const [savedConstraints, setSavedConstraints] = useState(false);
  const [viewRoomAssignment, setViewRoomAssignment] = useState(false);
  const [viewCourseAssignment, setViewCourseAssignment] = useState(false);

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
  const [uniqueNamedCourses, setUniqueNamedCourses] = useState([]);
  const [fixedRoomAllocation, setFixedRoomAllocation] = useState([]);

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
  let uniqueCourses = offeredCourse.filter((obj) => {
    if (!uniqueNames[obj.name]) {
      uniqueNames[obj.name] = true;
      return true;
    }
    return false;
  });

  useEffect(() => {
    setUniqueNamedCourses(uniqueCourses);
    // console.log(uniqueNamedCourses);
  }, [offeredCourse]);

  let maxAllowed = Math.ceil(offeredCourse.length / rooms.length);

  const roomAlloc = rooms.map((room) => {
    return {
      room: room.room,
      count: 0,
      courses: [],
    };
  });

  const countMinIndex = (arr) => {
    let minCount = Infinity;
    let minIndex = -1;

    // console.log(item.rooms);

    arr.forEach((room) => {
      const room_index = rooms.findIndex((r) => r.room === room);
      // console.log(index, roomAlloc[index].count);
      if (roomAlloc[room_index].count < minCount) {
        minCount = roomAlloc[room_index].count;
        minIndex = room_index;
      }
    });
    return minIndex;
  };

  const labRoomAssignHandler = () => {
    let remainedCourse = offeredCourse;
    let remainedRoom = rooms;
    let c = 0;

    // for constraints
    courseRoom.forEach((item) => {
      const minIndex = countMinIndex(item.rooms);
      const courses = offeredCourse.filter(
        (course) => course.course_id === item.course_id
      );
      remainedCourse = remainedCourse.filter(
        (course) => course.course_id !== item.course_id
      );
      // console.log("for ",roomAlloc[room_index].room, minIndex);
      roomAlloc[minIndex].count += courses.length;
      roomAlloc[minIndex].courses.push(...courses);
    });

    roomAlloc.forEach((room) => {
      if (room.count >= maxAllowed) {
        c++;
        remainedRoom = remainedRoom.filter((r) => r.room !== room.room);
      }
    });

    maxAllowed = Math.floor(remainedCourse.length / (rooms.length - c));
    // console.log(remainedCourse.length,rooms.length,c,maxAllowed);

    // console.log(remainedCourse);

    // for remaining courses
    roomAlloc.forEach((room) => {
      if (room.count < maxAllowed) {
        const courses = remainedCourse.splice(0, maxAllowed - room.count);
        room.count += courses.length;
        room.courses.push(...courses);
        remainedCourse = remainedCourse.filter(
          (course) => !courses.includes(course)
        );
      }
    });

    // let i = 0;

    while (remainedCourse.length > 0) {
      const minIndex = countMinIndex(remainedRoom.map((r) => r.room));
      const course = remainedCourse[0];
      roomAlloc[minIndex].count += 1;
      roomAlloc[minIndex].courses.push(course);
      remainedCourse = remainedCourse.filter((c) => c !== course);
      remainedRoom = remainedRoom.filter(
        (r) => r.room !== roomAlloc[minIndex].room
      );
    }

    setSavedConstraints(true);
    setFixedRoomAllocation(roomAlloc);

    // lab room assignment in this roomAlloc array

    console.log(roomAlloc);
  };

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

      <CardWithButton
        title="In this stage, provide constraints for different labs with
        different lab rooms"
        subtitle="Initial Phase"
        status="In Progress"
        bgColor={"success"}
        icon={"mdi-autorenew"}
        disabled={true}
        onClick={(e) => {}}
      />

      <div className="row">
        <div className="col-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Sessional Constraints</h4>
              <div className="border border-dark rounded btn-block p-3">
                {courseRoom.map((item, index) => (
                  <span
                    className="d-inline-block border border-secondary m-1"
                    key={index}
                  >
                    <Badge bg="info" text="light" className="mr-1">
                      {item.course_id}
                    </Badge>
                    {item.rooms.map((room, index) => (
                      <>
                        <Badge bg="primary" text="light" className="ml-1">
                          {room}
                        </Badge>
                        <button
                          className="btn btn-sm btn-outline-primary"
                          style={{ padding: "0.1rem" }}
                          onClick={() => {
                            const updatedRoom = item.rooms.filter(
                              (r) => r !== room
                            );
                            if (updatedRoom.length === 0) {
                              setCourseRoom(
                                courseRoom.filter(
                                  (course) =>
                                    course.course_id !== item.course_id
                                )
                              );

                              setUniqueNamedCourses([
                                ...uniqueNamedCourses,
                                offeredCourse.find(
                                  (course) =>
                                    course.course_id === item.course_id
                                ),
                              ]);
                            } else {
                              const index = courseRoom.findIndex(
                                (course) => course.course_id === item.course_id
                              );
                              const updatedCourseRoom = [...courseRoom];
                              updatedCourseRoom[index].rooms = updatedRoom;
                              setCourseRoom(updatedCourseRoom);
                            }
                          }}
                        >
                          <i className="mdi mdi-close mdi-14px"></i>
                        </button>
                      </>
                    ))}

                    <button
                      className="btn btn-sm btn-danger ml-2"
                      style={{ padding: "0.1rem" }}
                      onClick={() => {
                        setUniqueNamedCourses([
                          ...uniqueNamedCourses,
                          offeredCourse.find(
                            (course) => course.course_id === item.course_id
                          ),
                        ]);
                        setCourseRoom(
                          courseRoom.filter(
                            (course) => course.course_id !== item.course_id
                          )
                        );
                      }}
                    >
                      <i className="mdi mdi-close mdi-14px"></i>
                    </button>
                  </span>
                ))}
              </div>
              <form className="mt-3">
                <div className="row align-items-end">
                  <div className="col-5">
                    <select
                      class="form-select text-dark"
                      multiple
                      aria-label="multiple select example"
                      style={{ height: 300, width: "100%" }}
                      ref={selectedCourseRef}
                    >
                      {uniqueNamedCourses.map((course) => (
                        <option className="p-1" value={course.course_id}>
                          {course.course_id} - {course.name}
                        </option>
                      ))}
                    </select>

                    <h5 className="text-end mt-2">Courses</h5>
                  </div>

                  <div className="col-2 d-flex flex-column justify-content-between p-1 mb-4">
                    <div className="d-grid gap-5 mt-5">
                      <Button
                        variant="outline-success"
                        size="sm"
                        className="btn-block"
                        onClick={(e) => {
                          const selectedCourseOptions = Array.from(
                            selectedCourseRef.current.selectedOptions
                          )
                            .map((option) => option.value)
                            .map((course_id) =>
                              uniqueNamedCourses.find(
                                (course) => course.course_id === course_id
                              )
                            );

                          const selectedRoomOptions = Array.from(
                            selectedRoomRef.current.selectedOptions
                          )
                            .map((option) => option.value)
                            .map((room_id) =>
                              rooms.find((room) => room.room === room_id)
                            );

                          selectedCourseOptions.map((course) => {
                            setUniqueNamedCourses(
                              uniqueNamedCourses.filter(
                                (c) => c.course_id !== course.course_id
                              )
                            );

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
                        MUST USE
                      </Button>
                    </div>
                  </div>

                  <div className="col-5">
                    <select
                      class="form-select text-dark"
                      multiple
                      aria-label="multiple select example"
                      style={{ height: 300, width: "100%" }}
                      ref={selectedRoomRef}
                    >
                      {rooms.map((room) => (
                        <option className="p-1" value={room.room}>
                          {room.room}
                        </option>
                      ))}
                    </select>
                    <h5 className="text-right mt-1">Rooms</h5>
                  </div>
                </div>
                <div className="d-flex justify-content-end mt-2">
                  <Button
                    variant="success"
                    size="lg"
                    className="mb-2 btn-rounded"
                    onClick={labRoomAssignHandler}
                  >
                    Generate Lab Room Assignment
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {savedConstraints && (
        <div className="row">
          {!viewRoomAssignment && !viewCourseAssignment && (
            <div className="col-7 grid-margin">
              <div className="card">
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th> Lab Room </th>
                          <th> Number of courses </th>
                        </tr>
                      </thead>
                      <tbody>
                        {fixedRoomAllocation.map((room, index) => (
                          <tr key={index}>
                            <td> {room.room} </td>
                            <td> {room.count}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {viewRoomAssignment && !viewCourseAssignment && (
            <div className="col-7 grid-margin">
              <div className="card">
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th> Lab Room </th>
                          <th> Assigned Courses </th>
                        </tr>
                      </thead>
                      <tbody>
                        {fixedRoomAllocation.map((room, index) => (
                          <tr key={index}>
                            <td> {room.room} </td>
                            {room.courses.length === 0 ? (
                              <td> None </td>
                            ) : (
                              <td>
                                <ul>
                                  {room.courses.map((course, index) => (
                                    <li key={index}>
                                      {course.course_id} - {course.name} ({" "}
                                      {course.level_term} ) {course.section}
                                    </li>
                                  ))}
                                </ul>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {viewCourseAssignment && !viewRoomAssignment && (
            <div className="col-7 grid-margin">
              <div className="card">
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th> Course ID </th>
                          <th> Course Name </th>
                          <th> Level-Term </th>
                          <th> Section </th>
                          <th> Assigned Room </th>
                        </tr>
                      </thead>
                      <tbody>
                        {offeredCourse.map((course, index) => (
                          <tr key={index}>
                            <td> {course.course_id} </td>
                            <td> {course.name} </td>
                            <td> {course.level_term} </td>
                            <td> {course.section} </td>
                            {fixedRoomAllocation.map(
                              (room, index) =>
                                room.courses.find(
                                  (c) =>
                                    c.course_id === course.course_id &&
                                    c.section === course.section
                                ) && <td> {room.room} </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="col-5 grid-margin">
            <div className="card">
              <div className="card-body">
                <div>
                  <div
                    className="d-flex justify-content-center flex-column "
                  >
                    <Button
                      variant={viewRoomAssignment ? "dark" : "outline-dark"}
                      size="sm"
                      className="btn-block mb-3"
                      onClick={() => {
                        setViewRoomAssignment(true);
                        setViewCourseAssignment(false);
                      }}
                    >
                      View Room Assignment
                    </Button>
                    <Button
                      variant={viewCourseAssignment ? "dark" : "outline-dark"}
                      size="sm"
                      className="btn-block mb-3"
                      onClick={() => {
                        setViewCourseAssignment(true);
                        setViewRoomAssignment(false);
                      }}
                    >
                      View Course Assignment
                    </Button>
                    <Button
                      variant={!(viewCourseAssignment || viewRoomAssignment) ? "dark" : "outline-dark"}
                      size="sm"
                      className="btn-block mb-3"
                      onClick={() => {
                        setViewCourseAssignment(false);
                        setViewRoomAssignment(false);
                      }}
                    >
                      View Statistics
                    </Button>
                  </div>
                  <Button
                    variant="outline-danger"
                    size="md"
                    className="btn-block btn-rounded mt-5"
                    onClick={() => {
                      //initialize all states
                      setSavedConstraints(false);
                      setViewRoomAssignment(false);
                      setViewCourseAssignment(false);
                      setFixedRoomAllocation([]);
                    }}
                  >
                    Reschedule
                  </Button>
                </div>
                <div className="mt-5">
                  <Button
                    variant="success"
                    size="md"
                    className="btn-block btn-rounded"
                    onClick={() => {}}
                  >
                    Continue With This Assignment
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
