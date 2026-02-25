import React from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { ClassificationResult } from '@/src/types';
import { Colors } from '@/src/constants/colors';
import { getClassInfo } from '@/src/constants/insect-classes';

interface ClassificationCardProps {
  result: ClassificationResult;
  onPress?: () => void;
}

export function ClassificationCard({ result, onPress }: ClassificationCardProps) {
  const { topPrediction, imageUri, timestamp, isAquaticInsect } = result;
  const classInfo = getClassInfo(topPrediction.className);
  const percentage = Math.round(topPrediction.confidence * 100);
  const date = new Date(timestamp);
  const dateStr = date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={onPress}
    >
      <Image source={{ uri: imageUri }} style={styles.thumbnail} />
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.commonName} numberOfLines={1}>
            {topPrediction.commonName}
          </Text>
          {!isAquaticInsect && (
            <View style={styles.warningBadge}>
              <Text style={styles.warningBadgeText}>!</Text>
            </View>
          )}
        </View>
        <Text style={styles.scientificName}>{topPrediction.className}</Text>
        <View style={styles.bottomRow}>
          <Text style={styles.confidence}>{percentage}% confidence</Text>
          <Text style={styles.date}>{dateStr}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  pressed: {
    opacity: 0.7,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commonName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    flex: 1,
  },
  warningBadge: {
    backgroundColor: Colors.warningBackground,
    borderWidth: 1,
    borderColor: Colors.warningBorder,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  },
  warningBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.warning,
  },
  scientificName: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    marginTop: 2,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  confidence: {
    fontSize: 12,
    color: Colors.primaryLight,
    fontWeight: '500',
  },
  date: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
});
