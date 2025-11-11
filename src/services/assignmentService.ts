import { api } from './api';
import { Assignment } from '@/types';

export const assignmentService = {
    async getAll(): Promise<Assignment[]> {
        const response = await api.get('/assignments');
        return response.data;
    },

    async getById(id: string): Promise<Assignment> {
        const response = await api.get(`/assignments/${id}`);
        return response.data;
    },

    async create(assignment: Omit<Assignment, 'id'>): Promise<void> {
        await api.post('/assignments', assignment);
    },

    async update(assignment: Assignment): Promise<void> {
        await api.put('/assignments', assignment);
    },

    async delete(id: string): Promise<void> {
        await api.delete(`/assignments/${id}`);
    },
};