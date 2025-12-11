import axios from 'axios';

export const reportService = {
    exportTrips: async () => {
        const response = await axios.get('/api/reports/trips', {
            responseType: 'blob',
            headers: {
                'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            }
        });
        return response.data;
    },

    exportTripsByDate: async (startDate: string, endDate: string) => {
        const response = await axios.get('/api/reports/trips', {
            params: { startDate, endDate },
            responseType: 'blob',
            headers: {
                'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            }
        });
        return response.data;
    },

    importTrips: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await axios.post('/api/import/trips', formData, {
            headers: {
                'X-CSRF-TOKEN': localStorage.getItem('csrfToken'),
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    }
};