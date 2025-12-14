import axios from 'axios';

export const reportService = {
    exportTripsReport: async (): Promise<Blob> => {
        const response = await axios.get(`api/reports/trips`, {
            responseType: 'blob',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            }
        });
        return response.data;
    },

    exportCommonReport: async (): Promise<Blob> => {
        const response = await axios.get(`api/reports/common`, {
            responseType: 'blob',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            }
        });
        return response.data;
    },

    importTrips: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await axios.post(`api/import/trips`, formData, {
            headers: {
                'X-CSRF-TOKEN': localStorage.getItem('csrfToken'),
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    exportTripsByDate: async (startDate: string, endDate: string): Promise<Blob> => {
        const response = await axios.get(`api/reports/trips`, {
            params: { startDate, endDate },
            responseType: 'blob',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            }
        });
        return response.data;
    },
};