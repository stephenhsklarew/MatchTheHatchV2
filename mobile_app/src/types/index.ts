export interface ClassPrediction {
  className: string;
  commonName: string;
  confidence: number;
  isAquatic: boolean;
}

export interface ClassificationResult {
  id: string;
  predictions: ClassPrediction[];
  topPrediction: ClassPrediction;
  isAquaticInsect: boolean;
  imageUri: string;
  timestamp: number;
}

export interface ClassifierService {
  classify(imageUri: string): Promise<ClassificationResult>;
  isReady(): boolean;
}
