import axios from "axios";
import { api_url } from ".";

export const getStatus = () =>
  axios.get(api_url("/assign/theory/status")).then((res) => res.data);

export const initiate = () =>
    axios.get(api_url("/assign/theory/initiate")).then((res) => res.data);
