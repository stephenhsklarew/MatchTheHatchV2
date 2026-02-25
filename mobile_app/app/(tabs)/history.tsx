import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useClassificationHistory } from '@/src/hooks/useClassificationHistory';
import { ClassificationCard } from '@/src/components/ClassificationCard';
import { Colors } from '@/src/constants/colors';

export default function HistoryScreen() {
  const { history, clearHistory, isLoading } = useClassificationHistory();
  const router = useRouter();

  const handleClear = () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to delete all classification history?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: clearHistory },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <Text style={styles.loadingText}>Loading history...</Text>
      </View>
    );
  }

  if (history.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyIcon}>🔍</Text>
        <Text style={styles.emptyTitle}>No Classifications Yet</Text>
        <Text style={styles.emptyText}>
          Take a photo or pick an image from your library to identify an insect.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ClassificationCard
            result={item}
            onPress={() =>
              router.push({ pathname: '/result', params: { imageUri: item.imageUri } })
            }
          />
        )}
        contentContainerStyle={styles.list}
      />
      <Pressable style={styles.clearButton} onPress={handleClear}>
        <Text style={styles.clearButtonText}>Clear History</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: Colors.background,
  },
  list: {
    padding: 16,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  clearButton: {
    paddingVertical: 14,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  clearButtonText: {
    color: Colors.error,
    fontSize: 15,
    fontWeight: '500',
  },
});
