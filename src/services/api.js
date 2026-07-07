import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const detectContent = async (data) => {
    try {
        const response = await api.post('/api/detection/detect', data);
        return response.data;
    } catch (error) {
        console.error('Error detecting content:', error);
        throw error;
    }
};

export default api;
