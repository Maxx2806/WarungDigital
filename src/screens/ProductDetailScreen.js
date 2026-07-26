import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import COLORS from '../constants/colors';
import { formatRupiah } from '../utils/format';
import { addToCart, deleteProduct } from '../services/storage';

export default function ProductDetailScreen({ route, navigation }) {
  const { product } = route.params;
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async () => {
    setAdding(true);
    try {
      await addToCart(product, qty);
      Alert.alert('Berhasil', `${qty} ${product.nama} ditambahkan ke keranjang`, [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      Alert.alert('Gagal', 'Tidak bisa menambahkan ke keranjang');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = () => {
    Alert.alert('Hapus Produk', `Yakin ingin menghapus "${product.nama}" dari katalog?`, [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: async () => {
          await deleteProduct(product.id);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
      {product.foto ? (
        <Image source={{ uri: product.foto }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]}>
          <Text style={{ fontSize: 60 }}>🛒</Text>
        </View>
      )}

      <View style={styles.body}>
        <Text style={styles.name}>{product.nama}</Text>
        <Text style={styles.category}>{product.kategori || 'Umum'}</Text>
        <Text style={styles.price}>{formatRupiah(product.harga)}</Text>
        <Text style={styles.stock}>Stok tersedia: {product.stok}</Text>

        {!!product.deskripsi && (
          <>
            <Text style={styles.sectionTitle}>Deskripsi</Text>
            <Text style={styles.description}>{product.deskripsi}</Text>
          </>
        )}

        <Text style={styles.sectionTitle}>Jumlah</Text>
        <View style={styles.qtyRow}>
          <TouchableOpacity style={styles.qtyBtn} onPress={() => setQty((q) => Math.max(1, q - 1))}>
            <Text style={styles.qtyBtnText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.qtyValue}>{qty}</Text>
          <TouchableOpacity style={styles.qtyBtn} onPress={() => setQty((q) => Math.min(product.stok || 99, q + 1))}>
            <Text style={styles.qtyBtnText}>+</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.cartBtn} onPress={handleAddToCart} disabled={adding}>
          <Text style={styles.cartBtnText}>
            {adding ? 'Menambahkan...' : `Tambah ke Keranjang · ${formatRupiah(product.harga * qty)}`}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
          <Text style={styles.deleteBtnText}>Hapus Produk dari Katalog</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  image: { width: '100%', height: 240, backgroundColor: COLORS.border },
  imagePlaceholder: { justifyContent: 'center', alignItems: 'center' },
  body: { padding: 20 },
  name: { fontSize: 22, fontWeight: '800', color: COLORS.text },
  category: { fontSize: 13, color: COLORS.textSecondary, marginTop: 4 },
  price: { fontSize: 20, fontWeight: '700', color: COLORS.primary, marginTop: 10 },
  stock: { fontSize: 13, color: COLORS.textSecondary, marginTop: 4 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: COLORS.text, marginTop: 20, marginBottom: 6 },
  description: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 20 },
  qtyRow: { flexDirection: 'row', alignItems: 'center' },
  qtyBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, justifyContent: 'center', alignItems: 'center' },
  qtyBtnText: { fontSize: 18, fontWeight: '700', color: COLORS.text },
  qtyValue: { fontSize: 16, fontWeight: '700', marginHorizontal: 18, color: COLORS.text },
  cartBtn: { backgroundColor: COLORS.primary, borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginTop: 24 },
  cartBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  deleteBtn: { paddingVertical: 14, alignItems: 'center', marginTop: 8 },
  deleteBtnText: { color: COLORS.danger, fontWeight: '600', fontSize: 13 },
});