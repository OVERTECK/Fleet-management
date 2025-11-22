import { api } from './api';
import { Driver, CreateDriverRequest } from '@/types';

export const driverService = {
    async getAll(): Promise<Driver[]> {
        const response = await api.get('/drivers');
        return response.data;
    },

    async getById(id: string): Promise<Driver> {
        const response = await api.get(`/drivers/${id}`);
        return response.data;
    },

    async create(driver: CreateDriverRequest): Promise<void> {
        console.log('Sending driver data to backend:', driver);

        const requestData = {
            name: driver.name,
            lastName: driver.lastName,
            pathronymic: driver.pathronymic || '',
            contactData: driver.contactData,
            categoryDrive: driver.categoryDrive,
        };

        console.log('Formatted request data:', requestData);

        await api.post('/drivers', requestData);
    },

    async update(driver: Driver): Promise<void> {
        console.log('Updating driver:', driver);
        await api.put('/driver', driver);
    },

    async delete(id: string): Promise<void> {
        await api.delete(`/drivers/${id}`);
    },
};