import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === "development" ? 
    'http://localhost:8000' : 'https://api.overteck.ru';

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

api.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error)
);