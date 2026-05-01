import { api } from './api';

export const getUniverses = () => api.get('/universes/');
export const createUniverse = (data) => api.post('/universes/', data);
export const deleteUniverse = (id) => api.delete(`/universes/${id}`);
export const chatUniverse = (data) => api.post('/universes/chat', data);
