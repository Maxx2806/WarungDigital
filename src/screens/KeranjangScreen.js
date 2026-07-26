import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import COLORS from '../constants/colors';
import { formatRupiah } from '../utils/format';
import { getCart, saveCart, clearCart, addTransaction, getSession } from '../services/storage';

export default function KeranjangScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [checkingOut, setCheckingOut] = useState(false);

  const loadCart = useCallback(async () => {
    const data = await getCart();
    setCart(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadCart);
    return unsubscribe;
  }, [navigation, loadCart]);

  const updateQty = async (id, delta) => {
    const updated = cart
      .map((item) => (item.id === id ? { ...item, qty: item.qty + delta } : item))
      .filter((item) => item.qty > 0);
    setCart(updated);
    await saveCart(updated);
  };

  const removeItem = async (id) => {
    const updated = cart.filter((item) => item.id !== id);
    setCart(updated);
    await saveCart(updated);
  };

  const total = cart.reduce((sum, item) => sum + item.harga * item.qty, 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    Alert.alert('Konfirmasi Checkout', `Total belanja ${formatRupiah(total)}. Lanjutkan?`, [
      { text: 'Batal', style: 'cancel' },
      { text: 'Bayar', onPress: doCheckout },
    ]);
  };

  const doCheckout = async () => {
    setCheckingOut(true);
    try {
      const session = await getSession();
      const transaction = {
        id: 't' + Date.now(),
        tanggal: new Date().toISOString(),
        items: cart,
        total,
        kasir: session?.namaWarung || '-',
      };
      await addTransaction(transaction);
      await clearCart();
      setCart([]);
      Alert.alert('Transaksi Berhasil', 'Terima kasih! Transaksi tersimpan di Riwayat.', [
        { text: 'Lihat Riwayat', onPress: () => navigation.navigate('Riwayat') },
      ]);
    } catch (e) {
      Alert.alert('Gagal', 'Checkout tidak berhasil, coba lagi.');
    } finally {
      setCheckingOut(false);
    }
  };

  if (loading) return <LoadingSpinner label="Memuat keranjang..." />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Keranjang Belanja</Text>

      <FlatList
        data={cart}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemName} numberOfLines={1}>{item.nama}</Text>
              <Text style={styles.itemPrice}>{formatRupiah(item.harga)}</Text>
            </View>
            <View style={styles.qtyRow}>
              <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQty(item.id, -1)}>
                <Text style={styles.qtyBtnText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.qtyValue}>{item.qty}</Text>
              <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQty(item.id, 1)}>
                <Text style={styles.qtyBtnText}>+</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => removeItem(item.id)} style={styles.removeBtn}>
              <Text style={styles.removeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <EmptyState icon="🛒" title="Keranjang masih kosong" subtitle="Tambahkan produk dari halaman Katalog" />
        }
      />

      {cart.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatRupiah(total)}</Text>
          </View>
          <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout} disabled={checkingOut}>
            <Text style={styles.checkoutBtnText}>{checkingOut ? 'Memproses...' : 'Checkout Sekarang'}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, paddingTop: 55, paddingHorizontal: 16 },
  title: { fontSize: 22, fontWeight: '800', color: COLORS.text, marginBottom: 14 },
  listContent: { paddingBottom: 20, flexGrow: 1 },
  cartItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: 12, padding: 12, marginBottom: 10 },
  itemName: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  itemPrice: { fontSize: 13, color: COLORS.primary, marginTop: 2 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 10 },
  qtyBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.background, borderWidth: 1, borderColor: COLORS.border, justifyContent: 'center', alignItems: 'center' },
  qtyBtnText: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  qtyValue: { marginHorizontal: 10, fontWeight: '700', color: COLORS.text },
  removeBtn: { padding: 4 },
  removeBtnText: { color: COLORS.danger, fontSize: 16 },
  footer: { borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 14, paddingBottom: 10 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  totalLabel: { fontSize: 15, color: COLORS.textSecondary },
  totalValue: { fontSize: 20, fontWeight: '800', color: COLORS.primary },
  checkoutBtn: { backgroundColor: COLORS.secondary, borderRadius: 10, paddingVertical: 14, alignItems: 'center' },
  checkoutBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});