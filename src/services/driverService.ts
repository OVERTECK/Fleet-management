import { api } from './api';
import { Driver } from '@/types';

export const driverService = {
    async getAll(): Promise<Driver[]> {
        const response = await api.get('/drivers');
        return response.data;
    },

    async getById(id: string): Promise<Driver> {
        const response = await api.get(`/drivers/${id}`);
        return response.data;
    },

    async create(driver: Omit<Driver, 'id'>): Promise<void> {
        await api.post('/drivers', driver);
    },

    async update(driver: Driver): Promise<void> {
        await api.put('/drivers', driver);
    },

    async delete(id: string): Promise<void> {
        await api.delete(`/drivers/${id}`);
    },
};