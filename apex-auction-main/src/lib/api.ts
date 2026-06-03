import axios from 'axios';

const apiHost = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const api = axios.create({
    baseURL: `${apiHost.replace(/\/$/, '')}/api`,
});

// Interceptor to add auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Interceptor to handle token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refreshToken');
                const response = await axios.post(`${apiHost.replace(/\/$/, '')}/api/auth/refresh-token`, {
                    token: refreshToken,
                });
                const { accessToken } = response.data;
                localStorage.setItem('accessToken', accessToken);
                api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                return api(originalRequest);
            } catch (err) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/auth';
                return Promise.reject(err);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
