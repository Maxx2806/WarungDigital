import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import ItemCard from '../components/ItemCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import COLORS from '../constants/colors';
import { getProducts, saveProducts } from '../services/storage';
import { fetchInitialProducts } from '../services/api';

export default function KatalogScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const loadProducts = useCallback(async () => {
    try {
      let data = await getProducts();
      if (!data || data.length === 0) {
        data = await fetchInitialProducts();
        await saveProducts(data);
      }
      setProducts(data);
    } catch (e) {
      console.error('Gagal memuat produk', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadProducts);
    return unsubscribe;
  }, [navigation, loadProducts]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadProducts();
  };

  const filtered = products.filter((p) => p.nama.toLowerCase().includes(searchText.toLowerCase()));

  if (loading) {
    return <LoadingSpinner label="Memuat katalog produk..." />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Katalog Produk</Text>
          <Text style={styles.subtitle}>{products.length} produk tersedia</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('AddProduct')}>
          <Text style={styles.addBtnText}>+ Tambah</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.search}
        placeholder="Cari produk..."
        placeholderTextColor={COLORS.textSecondary}
        value={searchText}
        onChangeText={setSearchText}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <ItemCard product={item} onPress={() => navigation.navigate('ProductDetail', { product: item })} />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="🛍️"
            title={searchText ? 'Produk tidak ditemukan' : 'Belum ada produk'}
            subtitle={searchText ? 'Coba kata kunci lain' : 'Tekan tombol + Tambah untuk menambahkan produk pertama'}
          />
        }
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[COLORS.primary]} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, paddingTop: 55, paddingHorizontal: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  title: { fontSize: 22, fontWeight: '800', color: COLORS.text },
  subtitle: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  addBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 20 },
  addBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  search: { backgroundColor: COLORS.surface, borderRadius: 10, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: 14, paddingVertical: 10, marginBottom: 14, fontSize: 14 },
  listContent: { paddingBottom: 20, flexGrow: 1 },
});