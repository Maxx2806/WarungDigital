import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import COLORS from '../constants/colors';
import { saveCredentials, getCredentials } from '../services/storage';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterScreen({ navigation }) {
  const [namaWarung, setNamaWarung] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!namaWarung.trim()) newErrors.namaWarung = 'Nama warung wajib diisi';
    if (!username.trim()) newErrors.username = 'Username wajib diisi';
    else if (username.trim().length < 3) newErrors.username = 'Username minimal 3 karakter';
    if (!email.trim()) newErrors.email = 'Email wajib diisi';
    else if (!EMAIL_REGEX.test(email.trim())) newErrors.email = 'Format email tidak valid';
    if (!password) newErrors.password = 'Password wajib diisi';
    else if (password.length < 6) newErrors.password = 'Password minimal 6 karakter';
    if (confirmPassword !== password) newErrors.confirmPassword = 'Konfirmasi password tidak sama';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const existing = await getCredentials();
      if (existing && existing.username.toLowerCase() === username.trim().toLowerCase()) {
        setErrors({ general: 'Username sudah terdaftar, gunakan username lain' });
        return;
      }
      await saveCredentials({
        namaWarung: namaWarung.trim(),
        username: username.trim(),
        email: email.trim(),
        password,
        foto: null,
      });
      Alert.alert('Registrasi Berhasil', 'Silakan login dengan akun barumu', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (e) {
      Alert.alert('Terjadi kesalahan', 'Gagal mendaftar, coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Daftar Warung Baru</Text>
        <Text style={styles.subtitle}>Buat akun untuk mulai mengelola warungmu</Text>

        {errors.general ? <Text style={styles.errorGeneral}>{errors.general}</Text> : null}

        <Field label="Nama Warung" value={namaWarung} onChangeText={(t) => { setNamaWarung(t); setErrors((p) => ({ ...p, namaWarung: null })); }} error={errors.namaWarung} placeholder="Masukkan nama warung anda" />
        <Field label="Username" value={username} onChangeText={(t) => { setUsername(t); setErrors((p) => ({ ...p, username: null, general: null })); }} error={errors.username} placeholder="Masukkan username" autoCapitalize="none" />
        <Field label="Email" value={email} onChangeText={(t) => { setEmail(t); setErrors((p) => ({ ...p, email: null })); }} error={errors.email} placeholder="Masukkan email" keyboardType="email-address" autoCapitalize="none" />
        <Field label="Password" value={password} onChangeText={(t) => { setPassword(t); setErrors((p) => ({ ...p, password: null })); }} error={errors.password} placeholder="Masukkan password" secureTextEntry />
        <Field label="Konfirmasi Password" value={confirmPassword} onChangeText={(t) => { setConfirmPassword(t); setErrors((p) => ({ ...p, confirmPassword: null })); }} error={errors.confirmPassword} placeholder="Konfirmasi password" secureTextEntry />

        <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={submitting}>
          {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Daftar</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.linkWrap}>
          <Text style={styles.link}>
            Sudah punya akun? <Text style={styles.linkBold}>Masuk</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field({ label, error, ...props }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, error && styles.inputError]}
        placeholderTextColor={COLORS.textSecondary}
        {...props}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.background },
  container: { flexGrow: 1, padding: 24, paddingTop: 60 },
  title: { fontSize: 24, fontWeight: '800', color: COLORS.text },
  subtitle: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 24, marginTop: 4 },
  field: { marginBottom: 14 },
  label: { fontSize: 13, fontWeight: '600', color: COLORS.text, marginBottom: 6 },
  input: { backgroundColor: COLORS.surface, borderRadius: 10, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15 },
  inputError: { borderColor: COLORS.danger },
  errorText: { color: COLORS.danger, fontSize: 12, marginTop: 4 },
  errorGeneral: { color: COLORS.danger, fontSize: 13, textAlign: 'center', marginBottom: 12, backgroundColor: '#FDECEA', padding: 10, borderRadius: 8 },
  button: { backgroundColor: COLORS.primary, borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  linkWrap: { marginTop: 20, alignItems: 'center' },
  link: { color: COLORS.textSecondary, fontSize: 13 },
  linkBold: { color: COLORS.primary, fontWeight: '700' },
});