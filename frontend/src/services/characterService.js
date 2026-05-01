import { api } from './api';

export const getCharacters = (univId, worldId) => api.get(`/universes/${univId}/worlds/${worldId}/characters/`);
export const createCharacter = (univId, worldId, data) => api.post(`/universes/${univId}/worlds/${worldId}/characters/`, data);
export const deleteCharacter = (univId, worldId, charId) => api.delete(`/universes/${univId}/worlds/${worldId}/characters/${charId}`);
export const updateCharacter = (univId, worldId, charId, data) => api.put(`/universes/${univId}/worlds/${worldId}/characters/${charId}`, data);
