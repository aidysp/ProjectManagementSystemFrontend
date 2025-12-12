import axios from 'axios';
import { Board, CreateBoardFormData, User } from '../types';

const API_URL = 'http://localhost:8000';

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 секунд таймаут
});

// Интерцептор для токена
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('pms_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Интерцептор для ошибок
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('pms_token');
            localStorage.removeItem('pms_user');
            window.location.href = '/login';
        }

        // Более подробные ошибки
        const errorMessage = error.response?.data?.error?.message
            || error.response?.data?.message
            || error.message
            || 'Что-то пошло не так';

        console.error('API Error:', {
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            message: errorMessage
        });

        return Promise.reject(new Error(errorMessage));
    }
);

// Auth API
export const authAPI = {
    register: (data: { email: string; password: string; name: string }) =>
        api.post<{
            success: boolean;
            message: string;
            data: User & { token: string }
        }>('/api/auth/register', data),

    login: (data: { email: string; password: string }) =>
        api.post<{
            success: boolean;
            message: string;
            data: User & { token: string }
        }>('/api/auth/login', data),

    getMe: () => api.get<{
        success: boolean;
        data: User
    }>('/api/auth/me'),
};

// Boards API
export const boardsAPI = {
    getAll: () => api.get<{
        success: boolean;
        data: Board[];
        count: number
    }>('/api/boards'),

    getById: (id: string | number) =>
        api.get<{
            success: boolean;
            data: Board & { columns: any[] }
        }>(`/api/boards/${id}`),

    create: (data: CreateBoardFormData) =>
        api.post<{
            success: boolean;
            message: string;
            data: Board
        }>('/api/boards', data),

    update: (id: string | number, data: Partial<CreateBoardFormData>) =>
        api.put<{
            success: boolean;
            message: string;
            data: Board
        }>(`/api/boards/${id}`, data),

    delete: (id: string | number, archive: boolean = true) =>
        api.delete<{
            success: boolean;
            message: string;
            data: { boardId: string; status: string }
        }>(`/api/boards/${id}?archive=${archive}`),
};

// Test API
export const testAPI = {
    health: () => api.get('/health'),
    test: () => api.get('/api/test'),
    testDb: () => api.get('/api/test/db'),
};

export default api;