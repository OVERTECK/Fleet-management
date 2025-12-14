import { api } from './api';
import { Car } from '@/types';

export const carService = {
    async getAll(): Promise<Car[]> {
        const response = await api.get('/cars');
        return response.data;
    },

    async getByVIN(vin: string): Promise<Car> {
        const response = await api.get(`/cars/${vin}`);
        return response.data;
    },

    async create(car: Omit<Car, 'totalKM'> & { totalKM?: number }): Promise<void> {
        await api.post('/cars', car);
    },

    async update(car: Car): Promise<void> {
        await api.put('/cars', car);
    },

    async delete(vin: string): Promise<void> {
        await api.delete(`/cars/${vin}`);
    },
};