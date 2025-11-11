import { api } from './api';
import { Refueling } from '@/types';

export const refuelingService = {
    async getAll(): Promise<Refueling[]> {
        const response = await api.get('/refueling');
        return response.data;
    },

    async getById(id: string): Promise<Refueling> {
        const response = await api.get(`/refueling/${id}`);
        return response.data;
    },

    async create(refueling: Omit<Refueling, 'id'>): Promise<void> {
        await api.post('/refueling', refueling);
    },

    async update(refueling: Refueling): Promise<void> {
        await api.put('/refueling', refueling);
    },

    async delete(id: string): Promise<void> {
        await api.delete(`/refueling/${id}`);
    },
};