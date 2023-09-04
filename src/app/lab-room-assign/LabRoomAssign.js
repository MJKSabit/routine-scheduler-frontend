import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import { Button, CloseButton, Badge, ProgressBar } from "react-bootstrap";
import { toast } from "react-hot-toast";

import { getLabCourses, getLabRooms, getRoom } from "../api/db-crud";
import CardWithButton from "../shared/CardWithButton";
import Genetic from "genetic-js";
import { getRoomAssign, setRoomAssign } from "../api/theory-assign";

export default function LabRoomAssign() {
  const [offeredCourse, setOfferedCourse] = useState([
    // { course_id: "CSE 101", name: "Introduction to Computer Science" },
    // { course_id: "CSE 102", name: "Introduction to Programming" },
    // { course_id: "CSE 103", name: "Discrete Mathematics" },
  ]);

  const [savedConstraints, setSavedConstraints] = useState(false);
  const [viewRoomAssignment, setViewRoomAssignment] = useState(false);
  const [viewCourseAssignment, setViewCourseAssignment] = useState(false);
  const [viewLevelTermAssignment, setViewLevelTermAssignment] = useState(false);

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

  const [progress, setProgress] = useState(0);

  const [alreadySaved, setAlreadySaved] = useState(false);
  const [backendData, setBackendData] = useState([]);

  useEffect(() => {
    let rooms_, courses_;
    const labs = getLabRooms().then((res) => {
      // console.log(res);
      rooms_ = res;
      setRooms(res);
    });
    const courses = getLabCourses().then((res) => {
      // console.log(res);
      courses_ = res;
      setOfferedCourse(res);
    });

    Promise.all([labs, courses]).then(() => {
      getRoomAssign().then((res) => {
        setBackendData(res);
        if (res.length > 0) {
          setAlreadySaved(true);
          const labRooms = rooms_.map((room) => {
            const courses = res
              .filter((obj) => obj.room === room.room)
              .map((obj) => {
                return courses_.find(
                  (course) => course.course_id === obj.course_id
                );
              });
            return {
              room: room.room,
              count: courses.length,
              courses: courses,
            };
          });
          setFixedRoomAllocation(labRooms);
          setSavedConstraints(true);
        } else setAlreadySaved(false);
      });
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

  const geneticAlgorithm = (roomAssignments, rooms) => {
    const courses = Object.keys(roomAssignments);
    const genetic = Genetic.create();
    genetic.select1 = Genetic.Select1.Fittest;
    genetic.select2 = Genetic.Select2.RandomLinearRank;
    genetic.optimize = Genetic.Optimize.Minimize;

    genetic.seed = function () {
      const { courses, roomAssignments } = this.userData;
      const chromosome = {};
      courses.forEach((course) => {
        chromosome[course] = Math.floor(
          Math.random() * roomAssignments[course].length
        );
        chromosome[course] = roomAssignments[course][chromosome[course]];
      });
      return chromosome;
    };

    genetic.mutate = function (chromosome) {
      const { courses, roomAssignments } = this.userData;
      const course = courses[Math.floor(Math.random() * courses.length)];
      chromosome[course] = Math.floor(
        Math.random() * roomAssignments[course].length
      );
      chromosome[course] = roomAssignments[course][chromosome[course]];
      if (chromosome[course] === undefined) {
        console.log(course);
      }
      return chromosome;
    };

    genetic.crossover = function (mother, father) {
      const { courses } = this.userData;
      const son = {},
        daughter = {};
      courses.forEach((course) => {
        if (Math.random() < 0.5) {
          son[course] = mother[course];
          daughter[course] = father[course];
        } else {
          son[course] = father[course];
          daughter[course] = mother[course];
        }
      });
      return [son, daughter];
    };

    genetic.fitness = function (chromosome) {
      const { courses, rooms } = this.userData;
      // standard deviation of room used
      const roomUsed = {};
      rooms.forEach((room) => (roomUsed[room] = 0));
      courses.forEach((course) => {
        roomUsed[chromosome[course]] += 1;
      });
      let sum = 0,
        count = 0;
      rooms.forEach((room) => {
        sum += roomUsed[room];
        count += 1;
      });
      const mean = sum / count;
      let sd = 0;
      rooms.forEach((room) => {
        sd += (roomUsed[room] - mean) ** 2;
      });
      sd = Math.sqrt(sd / count);
      return sd;
    };

    // genetic.generation = function (pop, generation, stats) {
    //   return true;
    // };

    genetic.notification = function (pop, generation, stats, isFinished) {
      if (isFinished) {
        const solution = pop[0].entity;
        const roomStats = rooms.reduce((map, room) => {
          map[room] = { room, courses: [], count: 0 };
          return map;
        }, {});
        for (const course in solution) {
          const room = roomStats[solution[course]];
          room.courses.push(
            offeredCourse.find((c) => {
              const [course_id, section] = course.split(" ");
              return c.course_id === course_id && c.section === section;
            })
          );
          room.count += 1;
        }
        const roomUsed = Object.values(roomStats);
        console.log(`Finished`);
        console.log(roomUsed);
        setSavedConstraints(true);
        setFixedRoomAllocation(roomUsed);
      }
      setProgress(generation);
    };

    const config = {
      iterations: 1000,
      size: 100,
      crossover: 0.3,
      mutation: 0.3,
      skip: 20,
    };

    const userData = {
      courses,
      roomAssignments,
      rooms,
      offeredCourse,
    };

    genetic.evolve(config, userData);
  };

  const labRoomAssignHandler = () => {
    const roomNameOnly = rooms.map((room) => room.room);
    const courseNameOnly = offeredCourse.map(
      (course) => `${course.course_id} ${course.section}`
    );

    const courseRoomMap = courseRoom.reduce((map, obj) => {
      map[obj.course_id] = obj.rooms;
      return map;
    }, {});

    const allRoomSet = roomNameOnly;

    const possibleRoom = courseNameOnly.reduce((map, course) => {
      const [course_id, section] = course.split(" ");
      const roomSet = courseRoomMap[course_id] || allRoomSet;
      map[course] = roomSet;
      return map;
    }, {});

    geneticAlgorithm(possibleRoom, roomNameOnly);
  };

  const selectedCourseRef = useRef();
  const selectedRoomRef = useRef();

  const levelTermAllocation = fixedRoomAllocation.reduce((map, room) => {
    room.courses.forEach((course) => {
      const { level_term } = course;
      if (!map[level_term]) map[level_term] = new Set();
      map[level_term].add(room.room);
    });
    return map;
  }, {});

  const levelTermAllocationArray = Object.keys(levelTermAllocation)
    .map((level_term) => {
      return {
        level_term,
        rooms: Array.from(levelTermAllocation[level_term]),
      };
    })
    .sort((a, b) => {
      return a.level_term.localeCompare(b.level_term);
    });

  // .reduce((arr, room, level_term) => {
  //   arr.push({ level_term, rooms: Array.from(room) });
  //   return arr;
  // }, []);

  // console.log(levelTermAllocationArray);

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
        bgColor={alreadySaved ? "success" : "info"}
        icon={"mdi-autorenew"}
        disabled={true}
        onClick={(e) => {}}
      />

      {!alreadySaved && (
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
                                  (course) =>
                                    course.course_id === item.course_id
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
                  <div className="d-flex justify-content-between mt-2 ">
                    <ProgressBar
                      variant="success"
                      now={progress + 1}
                      label={`${progress + 1} / 1000 Generations`}
                      className="flex-grow-1 mt-2 mr-5"
                      style={{ height: "2rem" }}
                      max={1000}
                    />
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
      )}

      {savedConstraints && (
        <div className="row">
          {!viewLevelTermAssignment &&
            !viewRoomAssignment &&
            !viewCourseAssignment && (
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

          {!viewLevelTermAssignment &&
            viewRoomAssignment &&
            !viewCourseAssignment && (
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

          {!viewLevelTermAssignment &&
            viewCourseAssignment &&
            !viewRoomAssignment && (
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

          {viewLevelTermAssignment && (
            <div className="col-7 grid-margin">
              <div className="card">
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th> Level-Term </th>
                          <th> Used Labs </th>
                        </tr>
                      </thead>
                      <tbody>
                        {levelTermAllocationArray.map((lt, index) => (
                          <tr key={index}>
                            <td> {lt.level_term} </td>
                            {lt.rooms.length === 0 ? (
                              <td> None </td>
                            ) : (
                              <td>
                                <ul>
                                  {lt.rooms.map((room, index) => (
                                    <li key={index}>{room}</li>
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

          <div className="col-5 grid-margin">
            <div className="card">
              <div className="card-body">
                <div>
                  <div className="d-flex justify-content-center flex-column ">
                    <Button
                      variant={
                        !viewLevelTermAssignment && viewRoomAssignment
                          ? "dark"
                          : "outline-dark"
                      }
                      size="sm"
                      className="btn-block mb-3"
                      onClick={() => {
                        setViewRoomAssignment(true);
                        setViewCourseAssignment(false);
                        setViewLevelTermAssignment(false);
                      }}
                    >
                      View Room Assignment
                    </Button>
                    <Button
                      variant={
                        !viewLevelTermAssignment && viewCourseAssignment
                          ? "dark"
                          : "outline-dark"
                      }
                      size="sm"
                      className="btn-block mb-3"
                      onClick={() => {
                        setViewCourseAssignment(true);
                        setViewRoomAssignment(false);
                        setViewLevelTermAssignment(false);
                      }}
                    >
                      View Course Assignment
                    </Button>
                    <Button
                      variant={
                        !viewLevelTermAssignment &&
                        !(viewCourseAssignment || viewRoomAssignment)
                          ? "dark"
                          : "outline-dark"
                      }
                      size="sm"
                      className="btn-block mb-3"
                      onClick={() => {
                        setViewCourseAssignment(false);
                        setViewRoomAssignment(false);
                        setViewLevelTermAssignment(false);
                      }}
                    >
                      View Statistics
                    </Button>
                    <Button
                      variant={
                        viewLevelTermAssignment ? "dark" : "outline-dark"
                      }
                      size="sm"
                      className="btn-block mb-3"
                      onClick={() => {
                        setViewLevelTermAssignment(true);
                        setViewCourseAssignment(false);
                        setViewRoomAssignment(false);
                      }}
                    >
                      View Level-Term Assignment
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
                      setProgress(-1);
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
                    onClick={() => {
                      const data = [];
                      fixedRoomAllocation.forEach((room) => {
                        room.courses.forEach((course) => {
                          data.push({
                            course_id: course.course_id,
                            batch: course.batch,
                            section: course.section,
                            room: room.room,
                          });
                        });
                      });
                      setRoomAssign(data).then((res) => {
                        toast.success("Lab Room Assignment Saved");
                        setAlreadySaved(true);
                      });
                    }}
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
