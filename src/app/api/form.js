import axios from "axios";
import { api_url } from ".";

const getOfferedCourses = () =>
    axios.get(api_url("/course")).then((res) => res.data);