import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import { Button, CloseButton, Badge } from "react-bootstrap";
import { toast } from "react-hot-toast";

import { getLabCourses, getLabRooms , assignLabRooms } from "../api/db-crud";

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

    arr.map((room) => {
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
    courseRoom.map((item) => {
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

    roomAlloc.map((room) => {
      if (room.count >= maxAllowed) {
        c++;
        remainedRoom = remainedRoom.filter((r) => r.room !== room.room);
      }
    });

    maxAllowed = Math.floor(remainedCourse.length / (rooms.length - c));
    // console.log(remainedCourse.length,rooms.length,c,maxAllowed);

    // console.log(remainedCourse);

    // for remaining courses
    roomAlloc.map((room) => {
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
      remainedRoom = remainedRoom.filter((r) => r.room !== roomAlloc[minIndex].room);

    }

    setSavedConstraints(true);
    setFixedRoomAllocation(roomAlloc);

    // lab room assignment in this roomAlloc array

    // console.log(roomAlloc);
  };

  const finalAssignHandler = () => {
    const finalCourseRooms = [];

    offeredCourse.map((course) => {
      finalCourseRooms.push({
        course_id: course.course_id,
        section: course.section,
        room: fixedRoomAllocation.find((room) =>
          room.courses.find(
            (c) => c.course_id === course.course_id && c.section === course.section
         )).room
      });
      
    });
  
    // console.log("final",finalCourseRooms);

    assignLabRooms(finalCourseRooms).then((res) => {
      toast.success("Lab Room Assignment Successful");
    }).catch(console.log);

  };


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
                      {/* <h6 className="font-weight-light">
                        {courseRoom.map((item) => (
                          <div>
                            {item.course_id} Must Use {item.rooms.join(", ")}
                          </div>
                        ))}
                      </h6> */}
                      {courseRoom.map((item, index) => (
                        <div
                          key={index}
                          className="d-flex justify-content-between align-items-center "
                        >
                          <div className="d-flex justify-content-right align-items-center">
                            <div
                              className="d-flex justify-content-end align-items-center"
                              style={{ padding: 10 }}
                            >
                              {/* <Button variant="primary" size="sm">
                                {item.course_id}
                              </Button> */}
                              <Badge bg="success" text="light">
                                {item.course_id}
                              </Badge>
                              <button
                                type="button"
                                className="btn btn-rounded btn-light btn-sm float-right position-relative z-index-3 "
                                onClick={() => {
                                  setUniqueNamedCourses([
                                    ...uniqueNamedCourses,
                                    offeredCourse.find(
                                      (course) =>
                                        course.course_id === item.course_id
                                    ),
                                  ]);
                                  // console.log("hi",uniqueNamedCourses)
                                  setCourseRoom(
                                    courseRoom.filter(
                                      (course) =>
                                        course.course_id !== item.course_id
                                    )
                                  );
                                }}
                              >
                                <i
                                  className={
                                    "mdi mdi-close mdi-14px float-right"
                                  }
                                ></i>
                              </button>
                            </div>
                            <div
                              className="d-flex align-items-center"
                              style={{ padding: 5 }}
                            >
                              <h5
                                style={{
                                  margin: 0,
                                  fontSize: "1rem",
                                  color: "green",
                                }}
                              >
                                Must Use
                              </h5>
                            </div>
                            {item.rooms.map((room, index) => (
                              <div
                                className="d-flex justify-content-end align-items-center"
                                style={{ padding: 10 }}
                              >
                                {/* <Button variant="primary" size="sm">
                                  {room}
                                </Button> */}
                                <Badge bg="success" text="light">
                                  {room}
                                </Badge>
                                <button
                                  type="button"
                                  className="btn btn-rounded btn-light btn-sm float-right position-relative z-index-3 "
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
                                        (course) =>
                                          course.course_id === item.course_id
                                      );
                                      const updatedCourseRoom = [...courseRoom];
                                      updatedCourseRoom[index].rooms =
                                        updatedRoom;
                                      setCourseRoom(updatedCourseRoom);
                                    }
                                  }}
                                >
                                  <i
                                    className={
                                      "mdi mdi-close mdi-14px float-right"
                                    }
                                  ></i>
                                </button>
                                {/* <CloseButton
                                  style={{
                                    fontSize: "0.85rem",
                                    padding: "0.1rem",
                                    color: "red",
                                    borderColor: "violet",
                                  }}
                                  
                                /> */}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                      <form>
                        <div className="row">
                          <div className="col-5" style={{ padding: 10 }}>
                            <select
                              class="form-select"
                              multiple
                              aria-label="multiple select example"
                              style={{ height: 300, width: "100%" }}
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
                                Must Use
                              </Button>
                            </div>
                          </div>

                          <div className="col-5" style={{ padding: 10 }}>
                            <select
                              class="form-select"
                              multiple
                              aria-label="multiple select example"
                              style={{ height: 300, width: "100%" }}
                              ref={selectedRoomRef}
                            >
                              {rooms.map((room) => (
                                <option value={room.room}>{room.room}</option>
                              ))}
                            </select>
                            <h5 className="text-start m-2">Rooms</h5>
                          </div>
                        </div>
                        <div className="d-flex justify-content-end">
                          <Button
                            variant="outline-danger"
                            size="lg"
                            className="mb-2"
                            onClick={labRoomAssignHandler}
                          >
                            Save
                          </Button>
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
                    className="d-flex justify-content-right"
                    style={{ marginBottom: 35 }}
                  >
                    <Button
                      variant="outline-success"
                      size="lg"
                      className="w-100"
                      style={{ marginRight: 15 }}
                      onClick={() => {
                        setViewRoomAssignment(true);
                        setViewCourseAssignment(false);
                      }}
                    >
                      View Room Assignment
                    </Button>
                    <Button
                      variant="outline-success"
                      size="lg"
                      className="w-100"
                      style={{ marginRight: 15 }}
                      onClick={() => {
                        setViewCourseAssignment(true);
                        setViewRoomAssignment(false);
                      }}
                    >
                      View Course Assignment
                    </Button>
                    <Button
                      variant="outline-success"
                      size="lg"
                      className="w-100"
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
                    size="lg"
                    className="btn-block w-100"
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
                <div style={{ marginTop: 150 }}>
                  <Button
                    variant="outline-success"
                    size="lg"
                    className="btn-block w-100"
                    onClick={finalAssignHandler}
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
