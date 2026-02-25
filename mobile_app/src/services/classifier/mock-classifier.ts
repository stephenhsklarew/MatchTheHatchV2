import { ClassifierService, ClassificationResult, ClassPrediction } from '@/src/types';
import { INSECT_CLASSES } from '@/src/constants/insect-classes';
import { softmax } from '@/src/utils/softmax';

const MOCK_SCENARIOS = [
  // Strong mayfly prediction
  [3.5, 0.8, 1.2, -1.5, -2.0],
  // Strong stonefly prediction
  [0.5, 3.8, 0.9, -1.2, -1.8],
  // Strong caddisfly prediction
  [1.0, 0.6, 3.6, -1.0, -2.2],
  // Moderate mayfly (less confident)
  [2.0, 1.5, 1.2, 0.3, -0.5],
  // Negative: spider
  [-0.5, -1.0, -0.8, 3.2, 0.5],
  // Negative: beetle
  [-0.3, -0.8, -0.5, 0.8, 3.0],
  // Close call: mayfly vs caddisfly
  [2.2, 0.5, 2.0, -1.0, -1.5],
];

export class MockClassifier implements ClassifierService {
  private scenarioIndex = 0;

  isReady(): boolean {
    return true;
  }

  async classify(imageUri: string): Promise<ClassificationResult> {
    // Simulate inference delay (500-1500ms)
    const delay = 500 + Math.random() * 1000;
    await new Promise((resolve) => setTimeout(resolve, delay));

    const logits = MOCK_SCENARIOS[this.scenarioIndex % MOCK_SCENARIOS.length];
    this.scenarioIndex++;

    const probabilities = softmax(logits);

    const predictions: ClassPrediction[] = INSECT_CLASSES.map((cls, i) => ({
      className: cls.scientificName,
      commonName: cls.commonName,
      confidence: probabilities[i],
      isAquatic: cls.isAquatic,
    }));

    // Sort by confidence descending
    predictions.sort((a, b) => b.confidence - a.confidence);

    const topPrediction = predictions[0];

    return {
      id: Date.now().toString(),
      predictions,
      topPrediction,
      isAquaticInsect: topPrediction.isAquatic,
      imageUri,
      timestamp: Date.now(),
    };
  }
}
