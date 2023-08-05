import axios from 'axios';

export const UNAUTHORIZED = 401, FORBIDDEN = 403;
const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:8080";


export const api_url = (path) => (`${BASE_URL}/v1/api${path}`)

axios.interceptors.request.use( config => {
    const jwt = localStorage.getItem("token")
    if (jwt && config.url.includes(BASE_URL))
        config.headers.Authorization = `Bearer ${jwt}`
    return config
})