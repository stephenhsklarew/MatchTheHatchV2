import { useState, useCallback } from 'react';
import { ClassificationResult } from '@/src/types';
import { getClassifier } from '@/src/services/classifier';

interface UseClassifierReturn {
  classify: (imageUri: string) => Promise<ClassificationResult>;
  isClassifying: boolean;
  result: ClassificationResult | null;
  error: string | null;
}

export function useClassifier(): UseClassifierReturn {
  const [isClassifying, setIsClassifying] = useState(false);
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const classify = useCallback(async (imageUri: string): Promise<ClassificationResult> => {
    setIsClassifying(true);
    setError(null);
    try {
      const classifier = getClassifier();
      const classificationResult = await classifier.classify(imageUri);
      setResult(classificationResult);
      return classificationResult;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Classification failed';
      setError(message);
      throw err;
    } finally {
      setIsClassifying(false);
    }
  }, []);

  return { classify, isClassifying, result, error };
}
