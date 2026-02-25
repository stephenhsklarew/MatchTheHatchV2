import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useClassifier } from '@/src/hooks/useClassifier';
import { useClassificationHistory } from '@/src/hooks/useClassificationHistory';
import { ImagePreview } from '@/src/components/ImagePreview';
import { ConfidenceBar } from '@/src/components/ConfidenceBar';
import { NegativeClassBanner } from '@/src/components/NegativeClassBanner';
import { getClassInfo } from '@/src/constants/insect-classes';
import { Colors } from '@/src/constants/colors';
import { ClassificationResult } from '@/src/types';

export default function ResultScreen() {
  const { imageUri } = useLocalSearchParams<{ imageUri: string }>();
  const router = useRouter();
  const { classify, isClassifying, error } = useClassifier();
  const { addResult } = useClassificationHistory();
  const [result, setResult] = useState<ClassificationResult | null>(null);

  useEffect(() => {
    if (imageUri) {
      classify(imageUri).then((r) => {
        setResult(r);
        addResult(r);
      });
    }
  }, [imageUri]);

  if (isClassifying || !result) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Analyzing image...</Text>
        {imageUri && <ImagePreview uri={imageUri} size={160} />}
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Classification failed</Text>
        <Text style={styles.errorDetail}>{error}</Text>
        <Pressable style={styles.doneButton} onPress={() => router.back()}>
          <Text style={styles.doneButtonText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const topClass = getClassInfo(result.topPrediction.className);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ImagePreview uri={result.imageUri} size={200} />

      <View style={styles.resultSection}>
        <Text style={styles.topClassName}>
          {result.topPrediction.commonName}
        </Text>
        <Text style={styles.topScientificName}>
          {result.topPrediction.className}
        </Text>

        {!result.isAquaticInsect && <NegativeClassBanner />}

        {topClass?.description && (
          <Text style={styles.description}>{topClass.description}</Text>
        )}

        {result.isAquaticInsect && topClass?.flyPatterns && topClass.flyPatterns.length > 0 && (
          <View style={styles.flyPatternsSection}>
            <Text style={styles.flyPatternsTitle}>Suggested Fly Patterns</Text>
            <View style={styles.flyPatternsList}>
              {topClass.flyPatterns.map((pattern) => (
                <View key={pattern} style={styles.flyPatternChip}>
                  <Text style={styles.flyPatternText}>{pattern}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.confidenceSection}>
          <Text style={styles.sectionTitle}>All Predictions</Text>
          {result.predictions.map((pred, index) => (
            <ConfidenceBar
              key={pred.className}
              label={pred.commonName}
              sublabel={pred.className}
              confidence={pred.confidence}
              isTop={index === 0}
              isAquatic={pred.isAquatic}
            />
          ))}
        </View>
      </View>

      <Pressable style={styles.doneButton} onPress={() => router.back()}>
        <Text style={styles.doneButtonText}>Done</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: 32,
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.error,
  },
  errorDetail: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  resultSection: {
    marginTop: 20,
  },
  topClassName: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  topScientificName: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  flyPatternsSection: {
    marginBottom: 20,
  },
  flyPatternsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  flyPatternsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  flyPatternChip: {
    backgroundColor: Colors.primaryLight + '20',
    borderColor: Colors.primaryLight,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  flyPatternText: {
    fontSize: 13,
    color: Colors.primaryDark,
  },
  confidenceSection: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  doneButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  doneButtonText: {
    color: Colors.textOnPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
});
