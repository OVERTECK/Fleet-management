import { api } from './api';
import { Assignment } from '@/types';

export const assignmentService = {
    async getAll(): Promise<Assignment[]> {
        const response = await api.get('/targets');
        return response.data;
    },

    async getById(id: string): Promise<Assignment> {
        const response = await api.get(`/targets/${id}`);
        return response.data;
    },

    async create(assignment: Omit<Assignment, 'id'>): Promise<void> {
        await api.post('/targets', assignment);
    },

    async update(assignment: Assignment): Promise<void> {
        await api.put('/targets', assignment);
    },

    async delete(id: string): Promise<void> {
        await api.delete(`/targets/${id}`);
    },
};