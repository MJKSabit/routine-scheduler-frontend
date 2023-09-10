import axios from "axios";
import { api_url } from ".";

export const getSchedules = (batch, section) => 
    axios.get(api_url(`/schedule/theory/${batch}/${section}`)).then((res) => res.data);

export const setSchedules = (batch, section, course, schedules) => 
    axios.post(api_url(`/schedule/theory/${batch}/${section}/${course}`), schedules).then((res) => res.data);

export const initiate = () =>
    axios.get(api_url("/schedule/theory/initiate")).then((res) => res.data);

export const getStatus = () =>
    axios.get(api_url("/schedule/theory/status")).then((res) => res.data);

export const finalize = () =>
    axios.get(api_url("/schedule/theory/finalize")).then((res) => res.data);

export const getAllSchedule = () =>
    axios.get(api_url("/schedule/all")).then((res) => res.data);