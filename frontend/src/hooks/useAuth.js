import { useState, useCallback } from 'react';
import * as authService from '../services/authService';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const getMe = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await authService.getMe();
      setUser(data);
      setError(null);
      return data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  return { user, isLoading, error, getMe };
}
