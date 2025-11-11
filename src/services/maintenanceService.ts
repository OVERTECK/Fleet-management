import { api } from './api';
import { MaintenanceRecord } from '@/types';

export const maintenanceService = {
    async getAll(): Promise<MaintenanceRecord[]> {
        const response = await api.get('/maintenance');
        return response.data;
    },

    async getById(id: string): Promise<MaintenanceRecord> {
        const response = await api.get(`/maintenance/${id}`);
        return response.data;
    },

    async create(maintenance: Omit<MaintenanceRecord, 'id'>): Promise<void> {
        await api.post('/maintenance', maintenance);
    },

    async update(maintenance: MaintenanceRecord): Promise<void> {
        await api.put('/maintenance', maintenance);
    },

    async delete(id: string): Promise<void> {
        await api.delete(`/maintenance/${id}`);
    },
};