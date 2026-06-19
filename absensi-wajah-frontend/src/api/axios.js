import axios from 'axios';

const api = axios.create({
    baseURL : import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
    headers: {
        'Accept': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

api.interceptors.response.use(null, async (error) => {
    if (error.config && error.response?.status === 404 && !error.config._retry) {
        error.config._retry = true;
        await new Promise(r => setTimeout(r, 1500));
        return api(error.config);
    }
    return Promise.reject(error);
});

export function warmUpBackend() {
    api.get('/login', { timeout: 8000 }).catch(() => {});
}

setInterval(() => {
    const token = localStorage.getItem('auth_token');
    if (token) warmUpBackend();
}, 120000);

export default api;