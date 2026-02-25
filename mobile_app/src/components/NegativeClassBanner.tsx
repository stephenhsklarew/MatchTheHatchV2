import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/src/constants/colors';

export function NegativeClassBanner() {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>!</Text>
      <Text style={styles.text}>
        This does not appear to be an aquatic insect. Results may not be useful for fly pattern matching.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.warningBackground,
    borderWidth: 1,
    borderColor: Colors.warningBorder,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  icon: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.warning,
    marginRight: 8,
    marginTop: -2,
  },
  text: {
    flex: 1,
    fontSize: 14,
    color: Colors.warning,
    lineHeight: 20,
  },
});
