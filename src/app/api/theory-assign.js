import axios from "axios";
import { api_url } from ".";

export const getStatus = () =>
  axios.get(api_url("/assign/theory/status")).then((res) => res.data);

export const initiate = () =>
    axios.get(api_url("/assign/theory/initiate")).then((res) => res.data);

export const finalize = () => 
    axios.get(api_url("/assign/theory/finalize")).then((res) => res.data);


export const getRoomAssign = () =>
  axios.get(api_url("/assign/room/status")).then((res) => res.data);

export const setRoomAssign = (data) => 
    axios.post(api_url("/assign/room/assign"), data).then((res) => res.data);
