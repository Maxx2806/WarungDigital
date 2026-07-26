import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import COLORS from '../constants/colors';

export default function EmptyState({ icon = '📦', title = 'Belum ada data', subtitle = '' }) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 60, paddingHorizontal: 24 },
  icon: { fontSize: 48, marginBottom: 12 },
  title: { fontSize: 16, fontWeight: '600', color: COLORS.text, textAlign: 'center' },
  subtitle: { fontSize: 13, color: COLORS.textSecondary, textAlign: 'center', marginTop: 4 },
});