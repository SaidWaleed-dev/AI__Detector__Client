const TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

export const tokenService = {
    getAccessToken: () => localStorage.getItem(TOKEN_KEY),
    getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),
    
    setTokens: (access, refresh) => {
        if(access) localStorage.setItem(TOKEN_KEY, access);
        if(refresh) localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
    },
    
    clearTokens: () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
};
