import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ClassificationResult } from '@/src/types';

const HISTORY_KEY = 'classification_history';
const MAX_HISTORY = 50;

interface UseClassificationHistoryReturn {
  history: ClassificationResult[];
  addResult: (result: ClassificationResult) => Promise<void>;
  removeResult: (id: string) => Promise<void>;
  clearHistory: () => Promise<void>;
  isLoading: boolean;
}

export function useClassificationHistory(): UseClassificationHistoryReturn {
  const [history, setHistory] = useState<ClassificationResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem(HISTORY_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (err) {
      console.warn('Failed to load classification history:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const saveHistory = async (items: ClassificationResult[]) => {
    try {
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(items));
    } catch (err) {
      console.warn('Failed to save classification history:', err);
    }
  };

  const addResult = useCallback(async (result: ClassificationResult) => {
    setHistory((prev) => {
      const updated = [result, ...prev].slice(0, MAX_HISTORY);
      saveHistory(updated);
      return updated;
    });
  }, []);

  const removeResult = useCallback(async (id: string) => {
    setHistory((prev) => {
      const updated = prev.filter((r) => r.id !== id);
      saveHistory(updated);
      return updated;
    });
  }, []);

  const clearHistory = useCallback(async () => {
    setHistory([]);
    await AsyncStorage.removeItem(HISTORY_KEY);
  }, []);

  return { history, addResult, removeResult, clearHistory, isLoading };
}
