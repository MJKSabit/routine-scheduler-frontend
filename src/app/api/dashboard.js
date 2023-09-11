import axios from "axios";
import { api_url } from ".";


export const getTheoryEmail = () =>
  axios.get(api_url("/dashboard/email/theory")).then((res) => res.data);
export const getScheduleEmail = () =>
    axios.get(api_url("/dashboard/email/schedule")).then((res) => res.data);
export const getSessionalEmail = () =>
    axios.get(api_url("/dashboard/email/sessional")).then((res) => res.data);

export const setTheoryEmail = (email) =>
    axios.put(api_url("/dashboard/email/theory"), email).then((res) => res.data);
export const setScheduleEmail = (email) =>
    axios.put(api_url("/dashboard/email/schedule"), email).then((res) => res.data);
export const setSessionalEmail = (email) =>
    axios.put(api_url("/dashboard/email/sessional"), email).then((res) => res.data);