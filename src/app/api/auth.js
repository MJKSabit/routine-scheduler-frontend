import axios from 'axios'
import { api_url } from '.'

export const login = (username, password) => axios.post(api_url('/auth/login'), {username, password}).then(res => res.data)
export const forgetPassword = (username) => axios.post(api_url('/auth/forgot-password'), {username}).then(res => res.data)