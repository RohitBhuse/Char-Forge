import { api } from './api';

export const getWorlds = (univId) => api.get(`/universes/${univId}/worlds/`);
export const createWorld = (univId, data) => api.post(`/universes/${univId}/worlds/`, data);
export const deleteWorld = (univId, worldId) => api.delete(`/universes/${univId}/worlds/${worldId}`);
export const initWorldAttributes = (univId, worldId) => api.get(`/universes/${univId}/worlds/${worldId}/add_attribute_list`);
