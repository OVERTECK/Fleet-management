import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // КРИТИЧЕСКИ ВАЖНО для отправки кук
});

// Убираем лишние интерцепторы - они могут мешать
api.interceptors.request.use(
    (config) => {
        // Только минимальное логирование
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