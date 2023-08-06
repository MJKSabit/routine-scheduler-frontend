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
