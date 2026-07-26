import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import COLORS from '../constants/colors';
import { formatRupiah, formatDateLong } from '../utils/format';

export default function RiwayatDetailScreen({ route }) {
  const { transaction } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.summary}>
        <Text style={styles.summaryLabel}>Tanggal Transaksi</Text>
        <Text style={styles.summaryValue}>{formatDateLong(transaction.tanggal)}</Text>
        <Text style={[styles.summaryLabel, { marginTop: 10 }]}>Kasir</Text>
        <Text style={styles.summaryValue}>{transaction.kasir}</Text>
      </View>

      <Text style={styles.sectionTitle}>Item Dibeli</Text>
      <FlatList
        data={transaction.items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemName}>{item.nama}</Text>
              <Text style={styles.itemSub}>{item.qty} x {formatRupiah(item.harga)}</Text>
            </View>
            <Text style={styles.itemTotal}>{formatRupiah(item.qty * item.harga)}</Text>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 16 }}
      />

      <View style={styles.footer}>
        <Text style={styles.totalLabel}>Total Pembayaran</Text>
        <Text style={styles.totalValue}>{formatRupiah(transaction.total)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 16 },
  summary: { backgroundColor: COLORS.surface, borderRadius: 12, padding: 16, marginBottom: 16 },
  summaryLabel: { fontSize: 12, color: COLORS.textSecondary },
  summaryValue: { fontSize: 15, fontWeight: '700', color: COLORS.text, marginTop: 2 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: COLORS.text, marginBottom: 8 },
  itemRow: { flexDirection: 'row', backgroundColor: COLORS.surface, borderRadius: 10, padding: 12, marginBottom: 8, alignItems: 'center' },
  itemName: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  itemSub: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  itemTotal: { fontSize: 14, fontWeight: '700', color: COLORS.primary },
  footer: { borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 14, flexDirection: 'row', justifyContent: 'space-between' },
  totalLabel: { fontSize: 15, color: COLORS.textSecondary },
  totalValue: { fontSize: 20, fontWeight: '800', color: COLORS.primary },
});