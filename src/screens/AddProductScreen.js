import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView,
  Image, Alert, ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import COLORS from '../constants/colors';
import { addProduct } from '../services/storage';

export default function AddProductScreen({ navigation }) {
  const [nama, setNama] = useState('');
  const [harga, setHarga] = useState('');
  const [stok, setStok] = useState('');
  const [kategori, setKategori] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [foto, setFoto] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const pickImage = async () => {
    setPermissionDenied(false);
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      setPermissionDenied(true);
      Alert.alert(
        'Izin Ditolak',
        'Aplikasi butuh akses galeri untuk memilih foto produk. Aktifkan izin di pengaturan HP.'
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.6,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (!result.canceled) {
      setFoto(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    setPermissionDenied(false);
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      setPermissionDenied(true);
      Alert.alert('Izin Ditolak', 'Aplikasi butuh akses kamera untuk mengambil foto produk.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ quality: 0.6, allowsEditing: true, aspect: [1, 1] });
    if (!result.canceled) {
      setFoto(result.assets[0].uri);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!nama.trim()) newErrors.nama = 'Nama produk wajib diisi';
    if (!harga.trim()) newErrors.harga = 'Harga wajib diisi';
    else if (isNaN(Number(harga)) || Number(harga) <= 0) newErrors.harga = 'Harga harus berupa angka > 0';
    if (!stok.trim()) newErrors.stok = 'Stok wajib diisi';
    else if (isNaN(Number(stok)) || Number(stok) < 0 || !Number.isInteger(Number(stok)))
      newErrors.stok = 'Stok harus berupa bilangan bulat';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const newProduct = {
        id: 'p' + Date.now(),
        nama: nama.trim(),
        harga: Number(harga),
        stok: Number(stok),
        kategori: kategori.trim() || 'Umum',
        deskripsi: deskripsi.trim(),
        foto,
      };
      await addProduct(newProduct);
      Alert.alert('Berhasil', 'Produk baru berhasil ditambahkan', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      Alert.alert('Gagal', 'Tidak bisa menyimpan produk');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
      <TouchableOpacity style={styles.photoBox} onPress={pickImage}>
        {foto ? (
          <Image source={{ uri: foto }} style={styles.photo} />
        ) : (
          <View style={styles.photoPlaceholder}>
            <Text style={{ fontSize: 32 }}>📷</Text>
            <Text style={styles.photoText}>Pilih Foto dari Galeri</Text>
          </View>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={takePhoto} style={styles.cameraLink}>
        <Text style={styles.cameraLinkText}>Atau ambil foto dengan kamera</Text>
      </TouchableOpacity>

      {permissionDenied && (
        <Text style={styles.permissionWarning}>
          Izin kamera/galeri ditolak. Kamu masih bisa menambahkan produk tanpa foto.
        </Text>
      )}

      <Field
        label="Nama Produk *"
        value={nama}
        onChangeText={(t) => { setNama(t); setErrors((p) => ({ ...p, nama: null })); }}
        error={errors.nama}
        placeholder="Masukkan nama produk"
      />
      <Field
        label="Harga (Rp) *"
        value={harga}
        onChangeText={(t) => { setHarga(t); setErrors((p) => ({ ...p, harga: null })); }}
        error={errors.harga}
        placeholder="Masukkan harga produk"
        keyboardType="numeric"
      />
      <Field
        label="Stok *"
        value={stok}
        onChangeText={(t) => { setStok(t); setErrors((p) => ({ ...p, stok: null })); }}
        error={errors.stok}
        placeholder="Masukkan stok produk"
        keyboardType="numeric"
      />
      <Field label="Kategori" value={kategori} onChangeText={setKategori} placeholder="Masukkan kategori produk" />
      <Field
        label="Deskripsi"
        value={deskripsi}
        onChangeText={setDeskripsi}
        placeholder="Masukkan deskripsi produk"
        multiline
      />

      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={submitting}>
        {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitBtnText}>Simpan Produk</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

function Field({ label, error, ...props }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, error && styles.inputError, props.multiline && { height: 90, textAlignVertical: 'top' }]}
        placeholderTextColor={COLORS.textSecondary}
        {...props}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  photoBox: { alignSelf: 'center', marginBottom: 6 },
  photo: { width: 140, height: 140, borderRadius: 12 },
  photoPlaceholder: { width: 140, height: 140, borderRadius: 12, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center' },
  photoText: { fontSize: 11, color: COLORS.textSecondary, marginTop: 6, textAlign: 'center', width: 100 },
  cameraLink: { alignSelf: 'center', marginBottom: 16, marginTop: 8 },
  cameraLinkText: { color: COLORS.primary, fontSize: 12, fontWeight: '600' },
  permissionWarning: { color: COLORS.warning, fontSize: 12, textAlign: 'center', marginBottom: 16, backgroundColor: '#FFF8E1', padding: 8, borderRadius: 8 },
  field: { marginBottom: 14 },
  label: { fontSize: 13, fontWeight: '600', color: COLORS.text, marginBottom: 6 },
  input: { backgroundColor: COLORS.surface, borderRadius: 10, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14 },
  inputError: { borderColor: COLORS.danger },
  errorText: { color: COLORS.danger, fontSize: 12, marginTop: 4 },
  submitBtn: { backgroundColor: COLORS.primary, borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginTop: 10 },
  submitBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});