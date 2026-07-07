import axios from 'axios';
import { tokenService } from '../storage/tokenService';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050';

// Mock database helpers
const getMockUsers = () => JSON.parse(localStorage.getItem('sentinel_mock_users') || '[]');
const saveMockUsers = (users) => localStorage.setItem('sentinel_mock_users', JSON.stringify(users));

const getMockHistory = (userId) => JSON.parse(localStorage.getItem(`sentinel_mock_history_${userId}`) || '[]');
const saveMockHistory = (userId, history) => localStorage.setItem(`sentinel_mock_history_${userId}`, JSON.stringify(history));

// Create a default user if none exist
const initMockDb = () => {
    const users = getMockUsers();
    if (users.length === 0) {
        users.push({
            id: 'user-default-1',
            fullName: 'Demo User',
            email: 'demo@sentinel.ai',
            password: 'password123',
            isVerified: true
        });
        saveMockUsers(users);
    }
};
initMockDb();

const mockAdapter = async (config) => {
    const { url, method, data: rawData } = config;
    const data = rawData ? JSON.parse(rawData) : {};

    // Helper to return mock response
    const response = (status, data) => {
        return {
            data,
            status,
            statusText: status === 200 || status === 201 ? 'OK' : 'Error',
            headers: {},
            config
        };
    };

    // Helper to reject with axios-like error
    const reject = (status, message) => {
        const error = new Error(message);
        error.response = {
            status,
            data: { message }
        };
        return Promise.reject(error);
    };

    // Match endpoints
    if (url.includes('/api/auth/login')) {
        const users = getMockUsers();
        const user = users.find(u => u.email === data.email);
        if (!user || user.password !== data.password) {
            return reject(400, 'Invalid email or password');
        }
        if (!user.isVerified) {
            return reject(401, 'Please verify your email address first');
        }
        // Generate token and return
        const token = 'mock-jwt-token-' + user.id;
        tokenService.setAccessToken(token);
        return response(200, {
            token,
            user: { id: user.id, fullName: user.fullName, email: user.email }
        });
    }

    if (url.includes('/api/auth/register')) {
        const users = getMockUsers();
        if (users.some(u => u.email === data.email)) {
            return reject(400, 'User with this email already exists');
        }
        const newUser = {
            id: 'user-' + Math.random().toString(36).substr(2, 9),
            fullName: data.fullName,
            email: data.email,
            password: data.password,
            isVerified: false // Needs OTP
        };
        users.push(newUser);
        saveMockUsers(users);
        return response(201, {
            message: 'Registration successful! Verification code sent.',
            email: newUser.email
        });
    }

    if (url.includes('/api/auth/guest')) {
        const guestUser = {
            id: 'guest-' + Math.random().toString(36).substr(2, 9),
            fullName: 'Guest Analyst',
            email: 'guest@sentinel.ai',
            isGuest: true
        };
        const token = 'mock-guest-token-' + guestUser.id;
        tokenService.setAccessToken(token);
        return response(200, {
            token,
            user: guestUser
        });
    }

    if (url.includes('/api/auth/google')) {
        const googleUser = {
            id: 'google-' + Math.random().toString(36).substr(2, 9),
            fullName: 'Google User',
            email: 'google@sentinel.ai'
        };
        const token = 'mock-google-token-' + googleUser.id;
        tokenService.setAccessToken(token);
        return response(200, {
            token,
            user: googleUser
        });
    }

    if (url.includes('/api/auth/logout')) {
        tokenService.removeAccessToken();
        return response(200, { message: 'Logged out successfully' });
    }

    if (url.includes('/api/auth/forgot-password')) {
        const users = getMockUsers();
        const user = users.find(u => u.email === data.email);
        if (!user) {
            return reject(400, 'User with this email does not exist');
        }
        return response(200, { message: 'Verification code sent to your email' });
    }

    if (url.includes('/api/auth/verify-otp')) {
        const users = getMockUsers();
        const userIndex = users.findIndex(u => u.email === data.email);
        if (userIndex === -1) {
            return reject(400, 'User not found');
        }
        if (data.otpCode !== '123456' && data.otpCode !== '111111' && data.otpCode.length !== 6) {
            return reject(400, 'Invalid verification code');
        }
        
        users[userIndex].isVerified = true;
        saveMockUsers(users);
        
        const token = 'mock-jwt-token-' + users[userIndex].id;
        tokenService.setAccessToken(token);
        return response(200, {
            token,
            user: { id: users[userIndex].id, fullName: users[userIndex].fullName, email: users[userIndex].email }
        });
    }

    if (url.includes('/api/auth/reset-password')) {
        const users = getMockUsers();
        const userIndex = users.findIndex(u => u.email === data.email);
        if (userIndex === -1) {
            return reject(400, 'User not found');
        }
        users[userIndex].password = data.newPassword;
        saveMockUsers(users);
        return response(200, { message: 'Password updated successfully' });
    }

    if (url.match(/\/api\/auth\/user\/([\w-]+)/)) {
        const userId = url.split('/').pop();
        const users = getMockUsers();
        const user = users.find(u => u.id === userId);
        if (!user) {
            return reject(404, 'User not found');
        }
        return response(200, { id: user.id, fullName: user.fullName, email: user.email });
    }

    if (url.includes('/api/detection/detect')) {
        const text = data.text || '';
        const isAi = text.toLowerCase().includes('gpt') || text.toLowerCase().includes('ai') || text.length % 2 === 0;
        const aiProbability = isAi ? Math.floor(Math.random() * 40) + 60 : Math.floor(Math.random() * 30);
        
        const authHeader = config.headers.Authorization || '';
        const userId = authHeader.replace('Bearer mock-jwt-token-', '').replace('Bearer mock-guest-token-', '') || 'user-default-1';

        const mockResult = {
            contentId: 'det-' + Math.random().toString(36).substr(2, 9),
            contentType: data.contentType || 1,
            data: text || 'Uploaded file analysis',
            aiProbability,
            analyzedAt: new Date().toISOString(),
            classification: aiProbability > 60 ? 'Likely AI' : aiProbability > 30 ? 'Mixed content' : 'Proven Human',
            confidenceIndex: Math.floor(Math.random() * 15) + 80,
            uploadedAt: new Date().toISOString()
        };

        if (!userId.includes('guest')) {
            const history = getMockHistory(userId);
            history.unshift(mockResult);
            saveMockHistory(userId, history);
        }

        return response(200, mockResult);
    }

    if (url.match(/\/api\/detection\/history\/clear\/([\w-]+)/)) {
        const userId = url.split('/').pop();
        saveMockHistory(userId, []);
        return response(200, { message: 'History cleared successfully' });
    }

    if (url.match(/\/api\/detection\/history\/([\w-]+)/)) {
        if (method && method.toLowerCase() === 'delete') {
            const contentId = url.split('/').pop();
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith('sentinel_mock_history_')) {
                    try {
                        const history = JSON.parse(localStorage.getItem(key) || '[]');
                        const filtered = history.filter(item => item.contentId !== contentId);
                        if (filtered.length !== history.length) {
                            localStorage.setItem(key, JSON.stringify(filtered));
                            break;
                        }
                    } catch (e) {
                        console.error(e);
                    }
                }
            }
            return response(200, { message: 'Record deleted successfully' });
        }
        const userId = url.split('/').pop();
        const history = getMockHistory(userId);
        return response(200, history);
    }

    return reject(404, 'Endpoint not found');
};

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    // adapter: mockAdapter // Force local mock adapter for offline sandbox testing
});

apiClient.interceptors.request.use(
    (config) => {
        const token = tokenService.getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
        }
        return Promise.reject(error);
    }
);

export default apiClient;
