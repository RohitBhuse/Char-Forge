import { useState, useCallback } from 'react';
import * as characterService from '../services/characterService';

export function useCharacter() {
  const [characters, setCharacters] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCharacters = useCallback(async (univId, worldId) => {
    if (!univId || !worldId) return;
    setIsLoading(true);
    try {
      const { data } = await characterService.getCharacters(univId, worldId);
      setCharacters(data);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createCharacter = async (univId, worldId, charData) => {
    const { data } = await characterService.createCharacter(univId, worldId, charData);
    await fetchCharacters(univId, worldId);
    return data;
  };

  const deleteCharacter = async (univId, worldId, charId) => {
    await characterService.deleteCharacter(univId, worldId, charId);
    await fetchCharacters(univId, worldId);
  };

  return { characters, setCharacters, isLoading, error, fetchCharacters, createCharacter, deleteCharacter };
}
