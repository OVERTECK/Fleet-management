import { api } from './api';
import { Trip, CreateTripRequest } from '@/types';

export const tripService = {
    async getAll(): Promise<Trip[]> {
        const response = await api.get('/trips');
        return response.data;
    },

    async getById(id: string): Promise<Trip> {
        const response = await api.get(`/trips/${id}`);
        return response.data;
    },

    async create(trip: CreateTripRequest): Promise<void> {
        console.log('Sending trip data to backend:', trip);

        const requestData = {
            carId: trip.carId,
            driverId: trip.driverId,
            timeStart: trip.timeStart,
            timeEnd: trip.timeEnd,
            traveledKM: trip.traveledKM,
            consumptionLitersFuel: trip.consumptionLitersFuel,
        };

        console.log('Formatted trip request data:', requestData);

        await api.post('/trips', requestData);
    },

    async update(trip: Trip): Promise<void> {
        console.log('Updating trip:', trip);
        await api.put('/trips', trip);
    },

    async delete(id: string): Promise<void> {
        await api.delete(`/trips/${id}`);
    },
};