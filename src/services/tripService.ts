import { api } from './api';
import { Trip } from '@/types';

export const tripService = {
    async getAll(): Promise<Trip[]> {
        const response = await api.get('/trips');
        return response.data;
    },

    async getById(id: string): Promise<Trip> {
        const response = await api.get(`/trips/${id}`);
        return response.data;
    },

    async create(trip: Omit<Trip, 'id'>): Promise<void> {
        await api.post('/trips', trip);
    },

    async update(trip: Trip): Promise<void> {
        await api.put('/trips', trip);
    },

    async delete(id: string): Promise<void> {
        await api.delete(`/trips/${id}`);
    },
};