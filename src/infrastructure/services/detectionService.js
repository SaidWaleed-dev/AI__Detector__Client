import apiClient from '../api/apiClient';

export const detectionService = {
    detect: async (data) => {
        const response = await apiClient.post('/api/detection/detect', data);
        return response.data;
    },
    getHistory: async (userId) => {
        const response = await apiClient.get(`/api/detection/history/${userId}`);
        return response.data;
    }
};
