import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import COLORS from '../constants/colors';
import { formatRupiah, formatDate } from '../utils/format';
import { getTransactions } from '../services/storage';

export default function RiwayatScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);

  const loadTransactions = useCallback(async () => {
    const data = await getTransactions();
    setTransactions(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadTransactions);
    return unsubscribe;
  }, [navigation, loadTransactions]);

  if (loading) return <LoadingSpinner label="Memuat riwayat transaksi..." />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Riwayat Transaksi</Text>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('RiwayatDetail', { transaction: item })}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.date}>{formatDate(item.tanggal)}</Text>
              <Text style={styles.itemCount}>{item.items.length} jenis produk</Text>
            </View>
            <Text style={styles.total}>{formatRupiah(item.total)}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <EmptyState
            icon="🧾"
            title="Belum ada transaksi"
            subtitle="Riwayat akan muncul setelah kamu checkout dari keranjang"
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, paddingTop: 55, paddingHorizontal: 16 },
  title: { fontSize: 22, fontWeight: '800', color: COLORS.text, marginBottom: 14 },
  listContent: { paddingBottom: 20, flexGrow: 1 },
  card: { flexDirection: 'row', backgroundColor: COLORS.surface, borderRadius: 12, padding: 14, marginBottom: 10, alignItems: 'center' },
  date: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  itemCount: { fontSize: 12, color: COLORS.textSecondary, marginTop: 3 },
  total: { fontSize: 15, fontWeight: '800', color: COLORS.primary },
});