import { useState, useCallback } from 'react';
import * as universeService from '../services/universeService';

export function useUniverse() {
  const [universes, setUniverses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUniverses = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await universeService.getUniverses();
      setUniverses(data);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createUniverse = async (universeData) => {
    const { data } = await universeService.createUniverse(universeData);
    await fetchUniverses();
    return data;
  };

  const deleteUniverse = async (id) => {
    await universeService.deleteUniverse(id);
    await fetchUniverses();
  };

  return { universes, isLoading, error, fetchUniverses, createUniverse, deleteUniverse };
}
