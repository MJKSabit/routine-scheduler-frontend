import axios from "axios";
import { api_url } from ".";

export const getTheoryPreferencesForm = form_id =>
    axios.get(api_url(`/forms/${form_id}`)).then(res => res.data.data);

export const submitTheoryPreferencesForm = (form_id, data) =>
    axios.put(api_url(`/forms/${form_id}`), data).then(res => res.data);