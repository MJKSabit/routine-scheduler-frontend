import axios from "axios";
import { api_url } from ".";

export const getTeachers = () =>
  axios.get(api_url("/teacher")).then((res) => res.data);
export const getTeacher = (initial) =>
  axios.get(api_url(`/teacher/${initial}`)).then((res) => res.data);
export const createTeacher = (teacher) =>
  axios.post(api_url("/teacher"), teacher).then((res) => res.data);
export const updateTeacher = (initial, teacher) =>
  axios.put(api_url(`/teacher/${initial}`), teacher).then((res) => res.data);
export const deleteTeacher = (initial) =>
  axios.delete(api_url(`/teacher/${initial}`)).then((res) => res.data);

export const getCourses = () =>
    axios.get(api_url("/course")).then((res) => res.data);

export const addCourse = (course) =>
    axios.post(api_url("/course"), course).then((res) => res.data);

export const editCourse = (course_id, course) =>
    axios.put(api_url(`/course/${course_id}`), course).then((res) => res.data);

export const deleteCourse = (course_id) =>
    axios.delete(api_url(`/course/${course_id}`)).then((res) => res.data);

export const getRooms = () =>
  axios.get(api_url("/room")).then((res) => res.data);
export const getRoom = (room) =>
  axios.get(api_url(`/room/${room}`)).then((res) => res.data);
export const createRoom = (room) =>
  axios.post(api_url("/room"), room).then((res) => res.data);
export const updateRoom = (room, newRoom) =>
  axios.put(api_url(`/room/${room}`), newRoom).then((res) => res.data);
export const deleteRoom = (room) =>
  axios.delete(api_url(`/room/${room}`)).then((res) => res.data);

export const getSections = () =>
  axios.get(api_url("/section")).then((res) => res.data);
export const getSection = (batch,section) =>
  axios.get(api_url(`/section/${batch}/${section}`)).then((res) => res.data);
export const createSection = (section) =>
  axios.post(api_url("/section"), section).then((res) => res.data);
export const updateSection = (batch,section, newSection) =>
  axios.put(api_url(`/section/${batch}/${section}`), newSection).then((res) => res.data);
export const deleteSection = (batch,section) =>
  axios.delete(api_url(`/section/${batch}/${section}`)).then((res) => res.data);


export const getLabRooms = () =>
  axios.get(api_url("/room/labs")).then((res) => res.data);
export const getLabCourses = () =>
  axios.get(api_url("/course/labs")).then((res) => res.data);
 


//send to db
export const sendFahadTest = (data) =>
  axios.post(api_url("/send/fahad"), data).then((res) => res.data);

  export const sendData = (data) =>
  axios.post(api_url("/send/lab"), data).then((res) => res.data);

