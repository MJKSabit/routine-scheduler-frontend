import axios from "axios";
import { api_url } from ".";


export const getPdfForStudent = (lvlTerm, section) =>
  axios.get(api_url(`/pdf/showTerm/${lvlTerm}/${section}`)).then((res) => res.data);
