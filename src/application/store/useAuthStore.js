import { create } from 'zustand';
import { authService } from '../../infrastructure/services/authService';
import { tokenService } from '../../infrastructure/storage/tokenService';

export const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true, // initial state can be true if we verify token on load
    error: null,

    init: async () => {
        set({ isLoading: true });
        const token = tokenService.getAccessToken();
        if (token) {
            try {
                // simple base64 payload decode to extract claims
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));
                
                const decoded = JSON.parse(jsonPayload);
                const isGuest = decoded.role === 'Guest' || decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] === 'Guest';
                
                set({ 
                    user: { 
                        id: decoded.nameid || decoded.sub || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'], 
                        email: decoded.email || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'], 
                        isGuest: isGuest 
                    }, 
                    isAuthenticated: true, 
                    isLoading: false 
                });
        } catch (err) {
            console.error("Token decode error:", err);
            set({ isLoading: false, isAuthenticated: false, user: null });
        }
        } else {
            set({ isLoading: false, isAuthenticated: false, user: null });
        }
    },

    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const data = await authService.login(email, password);
            if(data && data.token) {
               tokenService.setTokens(data.token, data.refreshToken);
               set({ user: { id: data.userId, email: data.email, fullName: data.fullName }, isAuthenticated: true, isLoading: false });
            }
            return data;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Login failed', isLoading: false });
            throw error;
        }
    },

    register: async (username, email, password) => {
        set({ isLoading: true, error: null });
        try {
            const data = await authService.register(username, email, password);
            set({ isLoading: false });
            return data;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Registration failed', isLoading: false });
            throw error;
        }
    },

    verifyOtp: async (email, otpCode, type) => {
        set({ isLoading: true, error: null });
        try {
            const data = await authService.verifyOtp(email, otpCode, type);
            if (type === 'registration' && data && data.token) {
                tokenService.setTokens(data.token, data.refreshToken);
                set({ 
                    user: { id: data.userId, email: data.email, fullName: data.fullName }, 
                    isAuthenticated: true, 
                    isLoading: false 
                });
            } else {
                set({ isLoading: false });
            }
            return data;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Verification failed', isLoading: false });
            throw error;
        }
    },

    guestLogin: async () => {
        set({ isLoading: true, error: null });
        try {
            const data = await authService.guestLogin();
            if(data && data.token) {
               tokenService.setTokens(data.token, data.refreshToken);
               set({ user: { id: data.userId, email: data.email, fullName: data.fullName, isGuest: true }, isAuthenticated: true, isLoading: false });
            }
            return data;
        } catch (error) {
            set({ error: 'Guest login failed', isLoading: false });
            throw error;
        }
    },
    googleLogin: async (idToken) => {
        set({ isLoading: true, error: null });
        try {
            const data = await authService.googleLogin(idToken);
            if(data && data.token) {
               tokenService.setTokens(data.token, data.refreshToken);
               set({ user: { id: data.userId, email: data.email, fullName: data.fullName }, isAuthenticated: true, isLoading: false });
            }
            return data;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Google login failed', isLoading: false });
            throw error;
        }
    },

    logout: async () => {
        set({ isLoading: true });
        try {
            const currentUser = useAuthStore.getState().user;
            const email = currentUser?.email || '';
            const refreshToken = tokenService.getRefreshToken() || '';
            await authService.logout(email, refreshToken);
        } catch { /* ignore if token invalid */ }
        finally {
            tokenService.clearTokens();
            set({ user: null, isAuthenticated: false, isLoading: false });
        }
    }
}));
