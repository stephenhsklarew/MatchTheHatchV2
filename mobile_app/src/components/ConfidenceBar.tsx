import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Colors } from '@/src/constants/colors';

interface ConfidenceBarProps {
  label: string;
  sublabel?: string;
  confidence: number;
  isTop?: boolean;
  isAquatic?: boolean;
}

export function ConfidenceBar({ label, sublabel, confidence, isTop, isAquatic }: ConfidenceBarProps) {
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: confidence,
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, [confidence]);

  const percentage = Math.round(confidence * 100);

  const barColor = isTop
    ? isAquatic
      ? Colors.confidenceHigh
      : Colors.warning
    : Colors.confidenceLow;

  return (
    <View style={[styles.container, isTop && styles.topContainer]}>
      <View style={styles.labelRow}>
        <View style={styles.labelLeft}>
          <Text style={[styles.label, isTop && styles.topLabel]}>{label}</Text>
          {sublabel && <Text style={styles.sublabel}>{sublabel}</Text>}
        </View>
        <Text style={[styles.percentage, isTop && styles.topPercentage]}>
          {percentage}%
        </Text>
      </View>
      <View style={styles.barBackground}>
        <Animated.View
          style={[
            styles.barFill,
            {
              backgroundColor: barColor,
              width: animatedWidth.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  topContainer: {
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 4,
  },
  labelLeft: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  topLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  sublabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  percentage: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontVariant: ['tabular-nums'],
  },
  topPercentage: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  barBackground: {
    height: 8,
    backgroundColor: '#EEEEEE',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
});
