import { ClassifierService } from '@/src/types';
import { MockClassifier } from './mock-classifier';

const USE_MOCK = true; // Flip to false when TFLite model is ready (Phase 2)

let classifierInstance: ClassifierService | null = null;

export function getClassifier(): ClassifierService {
  if (!classifierInstance) {
    if (USE_MOCK) {
      classifierInstance = new MockClassifier();
    } else {
      // Phase 2: classifierInstance = new TFLiteClassifier();
      throw new Error('TFLite classifier not yet implemented. Set USE_MOCK=true.');
    }
  }
  return classifierInstance;
}
