import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
});

API.interceptors.request.use((req) => {
    try {
        const savedUser = localStorage.getItem('user');
        const user = savedUser ? JSON.parse(savedUser) : null;
        if (user && user.token) {
            req.headers.Authorization = `Bearer ${user.token}`;
        }
    } catch (error) {
        console.error("Erro ao processar token no interceptor:", error);
    }
    return req;
});

export default API;
