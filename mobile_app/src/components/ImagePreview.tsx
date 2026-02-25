import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Colors } from '@/src/constants/colors';

interface ImagePreviewProps {
  uri: string;
  size?: number;
}

export function ImagePreview({ uri, size = 200 }: ImagePreviewProps) {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Image source={{ uri }} style={styles.image} resizeMode="cover" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: Colors.border,
    alignSelf: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
