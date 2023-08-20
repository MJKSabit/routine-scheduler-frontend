import axios from "axios";
import { api_url } from ".";

export const getSchedules = (batch, section) => 
    axios.get(api_url(`/schedule/theory/${batch}/${section}`)).then((res) => res.data);