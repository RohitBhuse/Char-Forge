import { api } from './api';

export const login = (data) => api.post('/auth/login', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
export const register = (data) => api.post('/auth/register', data);
export const getMe = () => api.get('/auth/me');
