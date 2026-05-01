import { useState, useCallback } from 'react';
import * as worldService from '../services/worldService';

export function useWorld() {
  const [worlds, setWorlds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWorlds = useCallback(async (univId) => {
    if (!univId) return;
    setIsLoading(true);
    try {
      const { data } = await worldService.getWorlds(univId);
      setWorlds(data);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createWorld = async (univId, worldData) => {
    const { data } = await worldService.createWorld(univId, worldData);
    await fetchWorlds(univId);
    return data;
  };

  const deleteWorld = async (univId, worldId) => {
    await worldService.deleteWorld(univId, worldId);
    await fetchWorlds(univId);
  };

  return { worlds, setWorlds, isLoading, error, fetchWorlds, createWorld, deleteWorld };
}
