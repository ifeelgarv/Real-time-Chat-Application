import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: "http://locallhost:3000/api",
    withCredentials: true,
})