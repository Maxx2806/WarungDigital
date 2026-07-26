import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';
import COLORS from '../constants/colors';
import { getSession, saveSession, getCredentials, saveCredentials } from '../services/storage';

export default function ProfilScreen() {
  const { logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [updatingPhoto, setUpdatingPhoto] = useState(false);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    const load = async () => {
      const session = await getSession();
      setProfile(session);
      setLoading(false);
    };
    load();
  }, []);

  const changePhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Izin Ditolak', 'Izinkan akses galeri untuk mengganti foto profil di pengaturan HP.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.6,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (result.canceled) return;

    setUpdatingPhoto(true);
    try {
      const uri = result.assets[0].uri;
      const updatedProfile = { ...profile, foto: uri };
      await saveSession(updatedProfile);
      const cred = await getCredentials();
      if (cred) await saveCredentials({ ...cred, foto: uri });
      setProfile(updatedProfile);
    } finally {
      setUpdatingPhoto(false);
    }
  };

  const handleResetData = () => {
    Alert.alert(
      'Reset Semua Data',
      'Ini akan menghapus SEMUA data: akun, produk, keranjang, dan riwayat transaksi. Aplikasi akan kembali ke kondisi awal. Yakin?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            setResetting(true);
            try {
              await AsyncStorage.clear();
              logout();
            } finally {
              setResetting(false);
            }
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert('Keluar', 'Yakin ingin keluar dari akun?', [
      { text: 'Batal', style: 'cancel' },
      { text: 'Keluar', style: 'destructive', onPress: logout },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={changePhoto}>
          {profile?.foto ? (
            <Image source={{ uri: profile.foto }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Text style={{ fontSize: 32 }}>👤</Text>
            </View>
          )}
          <View style={styles.editBadge}>
            <Text style={{ fontSize: 11 }}>{updatingPhoto ? '...' : '✏️'}</Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.name}>{profile?.namaWarung || '-'}</Text>
        <Text style={styles.email}>{profile?.email || '-'}</Text>
      </View>

      <View style={styles.infoCard}>
        <InfoRow label="Username" value={profile?.username} />
        <InfoRow label="Email" value={profile?.email} />
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Keluar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.resetBtn} onPress={handleResetData} disabled={resetting}>
        <Text style={styles.resetText}>
          {resetting ? 'Mereset Data...' : 'Reset Semua Data (Testing)'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

function InfoRow({ label, value }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value || '-'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, paddingTop: 60, paddingHorizontal: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  header: { alignItems: 'center', marginBottom: 24 },
  avatar: { width: 96, height: 96, borderRadius: 48, backgroundColor: COLORS.border },
  avatarPlaceholder: { justifyContent: 'center', alignItems: 'center' },
  editBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: COLORS.surface, borderRadius: 12, width: 24, height: 24, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  name: { fontSize: 20, fontWeight: '800', color: COLORS.text, marginTop: 12 },
  email: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  infoCard: { backgroundColor: COLORS.surface, borderRadius: 12, padding: 16, marginBottom: 20 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.background },
  infoLabel: { fontSize: 13, color: COLORS.textSecondary },
  infoValue: { fontSize: 13, fontWeight: '600', color: COLORS.text },
  logoutBtn: { borderWidth: 1, borderColor: COLORS.danger, borderRadius: 10, paddingVertical: 14, alignItems: 'center' },
  logoutText: { color: COLORS.danger, fontWeight: '700', fontSize: 15 },
  resetBtn: { marginTop: 14, paddingVertical: 12, alignItems: 'center' },
  resetText: { color: COLORS.textSecondary, fontSize: 12, textDecorationLine: 'underline' },
});