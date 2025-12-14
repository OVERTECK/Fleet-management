import { api } from './api';
import { MaintenanceRecord, CreateMaintenanceRecordRequest } from '@/types';

export const maintenanceService = {
    async getAll(): Promise<MaintenanceRecord[]> {
        const response = await api.get('/maintenanceRecords');
        return response.data;
    },

    async getById(id: string): Promise<MaintenanceRecord> {
        const response = await api.get(`/maintenanceRecords/${id}`);
        return response.data;
    },

    async create(maintenance: CreateMaintenanceRecordRequest): Promise<void> {
        console.log('Sending maintenance data:', maintenance);

        const requestData = {
            carId: maintenance.carId,
            typeWork: maintenance.typeWork,
            price: Number(maintenance.price),
            date: maintenance.date,
        };

        console.log('Formatted maintenance request:', requestData);
        await api.post('/maintenanceRecords', requestData);
    },

    async update(maintenance: MaintenanceRecord): Promise<void> {
        await api.put('/maintenanceRecords', maintenance);
    },

    async delete(id: string): Promise<void> {
        await api.delete(`/maintenanceRecords/${id}`);
    },
};