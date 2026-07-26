import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import COLORS from '../constants/colors';
import { formatRupiah } from '../utils/format';

export default function ItemCard({ product, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      {product.foto ? (
        <Image source={{ uri: product.foto }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]}>
          <Text style={styles.imagePlaceholderText}>🛒</Text>
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{product.nama}</Text>
        <Text style={styles.price}>{formatRupiah(product.harga)}</Text>
        <Text style={styles.stock}>Stok: {product.stok}</Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', backgroundColor: COLORS.surface, borderRadius: 12, padding: 10, marginBottom: 10, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  image: { width: 56, height: 56, borderRadius: 8, backgroundColor: COLORS.border },
  imagePlaceholder: { justifyContent: 'center', alignItems: 'center' },
  imagePlaceholderText: { fontSize: 24 },
  info: { flex: 1, marginLeft: 12 },
  name: { fontSize: 15, fontWeight: '600', color: COLORS.text },
  price: { fontSize: 14, color: COLORS.primary, fontWeight: '700', marginTop: 2 },
  stock: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  chevron: { fontSize: 22, color: COLORS.border, marginLeft: 4 },
});