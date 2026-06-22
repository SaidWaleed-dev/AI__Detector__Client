import apiClient from '../api/apiClient';

export const authService = {
    login: async (email, password) => {
        const response = await apiClient.post('/api/auth/login', { email, password });
        return response.data;
    },
    register: async (username, email, password) => {
        const response = await apiClient.post('/api/auth/register', { fullName: username, email, password });
        return response.data;
    },
    guestLogin: async () => {
        const response = await apiClient.post('/api/auth/guest');
        return response.data;
    },
    googleLogin: async (idToken) => {
        const response = await apiClient.post('/api/auth/google', { idToken });
        return response.data;
    },
    logout: async (email = '', refreshToken = '') => {
        const response = await apiClient.post('/api/auth/logout', { email, refreshToken });
        return response.data;
    },
    getUser: async (id) => {
        const response = await apiClient.get(`/api/auth/user/${id}`);
        return response.data;
    },
    forgotPassword: async (email) => {
        const response = await apiClient.post('/api/auth/forgot-password', { email });
        return response.data;
    },
    verifyOtp: async (email, otpCode, type) => {
        const response = await apiClient.post('/api/auth/verify-otp', { email, otpCode, type });
        return response.data;
    },
    resetPassword: async (email, token, newPassword) => {
        const response = await apiClient.post('/api/auth/reset-password', { email, token, newPassword });
        return response.data;
    }
};
