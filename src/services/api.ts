import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';


export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Интерцептор для обработки ошибок
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error);
        return Promise.reject(error);
    }
);