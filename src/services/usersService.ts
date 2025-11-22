import { api } from './api';

export interface User {
    id: string;
    login: string;
    roleId: number;
}

export interface LoginRequest {
    login: string;
    password: string;
}

export interface RegisterRequest {
    login: string;
    password: string;
    roleId: number;
}

export const usersService = {
    async login(credentials: LoginRequest): Promise<User> {
        const response = await api.post('/login', credentials);
        return response.data;
    },

    async register(userData: RegisterRequest): Promise<User> {
        const response = await api.post('/registration', userData);
        return response.data;
    },

    async getCurrentUser(): Promise<User> {
        const response = await api.get('/users/me');
        return response.data;
    },

    async logout(): Promise<void> {
        // На бэкенде обычно инвалидируется токен
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    },
};