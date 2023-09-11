import axios from "axios";
import { api_url } from ".";


export const getPdfForStudent = (lvlTerm, section) =>
    axios.get(api_url(`/pdf/showTerm/${lvlTerm}/${section}`), { responseType: 'blob' }).then((res) => res.data);

export const getAllInitial = () =>
    axios.get(api_url(`/pdf/allInitial`)).then((res) => res.data);


export const getPdfForTeacher = (initial) =>
    axios.get(api_url(`/pdf/showTeacher/${initial}`), { responseType: 'blob' }).then((res) => res.data);

export const getPdfForRoom = (initial) =>
    axios.get(api_url(`/pdf/showRoom/${initial}`), { responseType: 'blob' }).then((res) => res.data);

export const getAllRooms = () =>
    axios.get(api_url(`/pdf/allRooms`)).then((res) => res.data);

export const getAllLevelTerms = () =>
    axios.get(api_url(`/pdf/allLevelTerm`)).then((res) => res.data);

export const regeneratePdfLevelTerm = (lvlTerm) =>
    axios.get(api_url(`/pdf/generate/${lvlTerm}`)).then((res) => res.data);