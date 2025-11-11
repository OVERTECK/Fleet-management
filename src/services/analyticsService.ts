import { api } from './api';

export interface CostRanking {
    carId: string;
    model: string;
    totalCost: number;
    fuelCost: number;
    maintenanceCost: number;
}

export interface FuelAnomaly {
    carId: string;
    tripId: string;
    consumption: number;
    avgConsumption: number;
    deviation: number;
}

export const analyticsService = {
    async getCostRanking(): Promise<CostRanking[]> {
        // В реальном приложении этот эндпоинт должен быть на бэкенде
        const response = await api.get('/analytics/cost-ranking');
        return response.data;
    },

    async getFuelAnomalies(): Promise<FuelAnomaly[]> {
        // В реальном приложении этот эндпоинт должен быть на бэкенде
        const response = await api.get('/analytics/fuel-anomalies');
        return response.data;
    },

    async getMileageStatistics(): Promise<any> {
        const response = await api.get('/analytics/mileage');
        return response.data;
    },
};