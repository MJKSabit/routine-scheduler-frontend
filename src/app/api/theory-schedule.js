import axios from "axios";
import { api_url } from ".";

export const getSchedules = (batch, section) => 
    axios.get(api_url(`/schedule/theory/${batch}/${section}`)).then((res) => res.data);

export const setSchedules = (batch, section, course, schedules) => 
    axios.post(api_url(`/schedule/theory/${batch}/${section}/${course}`), schedules).then((res) => res.data);