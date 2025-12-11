import { api } from './api';

export interface User {
    id: string;
    login: string;
    role: string | { id: number; title: string };
    roleId: number;
}

export const usersService = {
    async login(credentials: { login: string; password: string }): Promise<User> {
        try {
            const response = await api.post('/login', credentials, {
                withCredentials: true,
            });

            console.log('Login response headers:', response.headers);
            console.log('Login response data:', response.data);

            if (response.data) {
                const userData = {
                    id: response.data.id || '',
                    login: response.data.login || '',
                    role: response.data.role || '',
                    roleId: response.data.roleId || 0,
                };
                localStorage.setItem('currentUser', JSON.stringify(userData));
                localStorage.setItem('csrfToken', response.data.csrfToken || '');
            }

            return response.data;
        } catch (error) {
            console.error('Login service error:', error);
            throw error;
        }
    },

    async register(userData: { login: string; password: string; roleId: number }): Promise<User> {
        try {
            const response = await api.post('/registration', userData, {
                withCredentials: true,
            });

            console.log('Register response headers:', response.headers);

            if (response.data) {
                const userInfo = {
                    id: response.data.id || '',
                    login: response.data.login || '',
                    role: response.data.role || '',
                    roleId: response.data.roleId || 0,
                };
                localStorage.setItem('currentUser', JSON.stringify(userInfo));
                localStorage.setItem('csrfToken', response.data.csrfToken || '');
            }

            return response.data;
        } catch (error) {
            console.error('Register service error:', error);
            throw error;
        }
    },

    async getCurrentUser(): Promise<User> {
        try {
            const cached = localStorage.getItem('currentUser');
            if (cached) {
                try {
                    return JSON.parse(cached);
                } catch (e) {
                    console.warn('Invalid cached user data');
                }
            }

            const response = await api.get('/users/me', {
                withCredentials: true,
            });

            if (response.data) {
                const userData = {
                    id: response.data.id || '',
                    login: response.data.login || '',
                    role: response.data.role || '',
                    roleId: response.data.roleId || 0,
                };
                localStorage.setItem('currentUser', JSON.stringify(userData));
                localStorage.setItem('csrfToken', response.data.csrfToken || '');
                return userData;
            }

            throw new Error('No user data received');
        } catch (error) {
            console.error('Get current user error:', error);
            throw error;
        }
    },

    logout() {
        localStorage.removeItem('currentUser');
    }
};