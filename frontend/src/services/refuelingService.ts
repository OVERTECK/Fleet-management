import { api } from './api';
import { Refueling, CreateRefuelingRequest } from '@/types';

export const refuelingService = {
    async getAll(): Promise<Refueling[]> {
        const response = await api.get('/gasStations');
        return response.data;
    },

    async getById(id: string): Promise<Refueling> {
        const response = await api.get(`/gasStation/${id}`);
        return response.data;
    },

    async create(refueling: CreateRefuelingRequest): Promise<void> {
        console.log('Sending refueling data:', refueling);

        const requestData = {
            carId: refueling.carId,
            refilledLiters: Number(refueling.refilledLiters),
            price: Number(refueling.price),
            date: refueling.date,
        };

        console.log('Formatted refueling request:', requestData);
        await api.post('/gasStation', requestData);
    },

    async update(refueling: Refueling): Promise<void> {
        await api.put('/gasStation', refueling);
    },

    async delete(id: string): Promise<void> {
        await api.delete(`/gasStation/${id}`);
    },
};