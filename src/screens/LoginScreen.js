import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { getCredentials, saveSession } from '../services/storage';
import COLORS from '../constants/colors';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!username.trim()) newErrors.username = 'Username / email wajib diisi';
    if (!password) newErrors.password = 'Password wajib diisi';
    else if (password.length < 4) newErrors.password = 'Password minimal 4 karakter';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const credentials = await getCredentials();
      if (!credentials) {
        setErrors({ general: 'Belum ada akun terdaftar. Silakan daftar dahulu.' });
        return;
      }
      const usernameMatch =
        credentials.username.toLowerCase() === username.trim().toLowerCase() ||
        credentials.email.toLowerCase() === username.trim().toLowerCase();

      if (!usernameMatch || credentials.password !== password) {
        setErrors({ general: 'Username / email atau password salah' });
        return;
      }

      const session = {
        namaWarung: credentials.namaWarung,
        email: credentials.email,
        username: credentials.username,
        foto: credentials.foto || null,
      };
      await saveSession(session);
      login(session);
    } catch (e) {
      Alert.alert('Terjadi kesalahan', 'Gagal login, coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.logo}>🏪</Text>
        <Text style={styles.title}>Warung Digital</Text>
        <Text style={styles.subtitle}>Masuk untuk kelola warungmu</Text>

        {errors.general ? <Text style={styles.errorGeneral}>{errors.general}</Text> : null}

        <View style={styles.field}>
          <Text style={styles.label}>Username / Email</Text>
          <TextInput
            style={[styles.input, errors.username && styles.inputError]}
            placeholder="Masukkan username atau email"
            placeholderTextColor={COLORS.textSecondary}
            autoCapitalize="none"
            value={username}
            onChangeText={(t) => {
              setUsername(t);
              setErrors((p) => ({ ...p, username: null, general: null }));
            }}
          />
          {errors.username ? <Text style={styles.errorText}>{errors.username}</Text> : null}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={[styles.input, errors.password && styles.inputError]}
            placeholder="Minimal 4 karakter"
            placeholderTextColor={COLORS.textSecondary}
            secureTextEntry
            value={password}
            onChangeText={(t) => {
              setPassword(t);
              setErrors((p) => ({ ...p, password: null, general: null }));
            }}
          />
          {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={submitting}>
          {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Masuk</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.linkWrap}>
          <Text style={styles.link}>
            Belum punya akun? <Text style={styles.linkBold}>Daftar di sini</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.background },
  container: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  logo: { fontSize: 56, textAlign: 'center', marginBottom: 8 },
  title: { fontSize: 26, fontWeight: '800', textAlign: 'center', color: COLORS.text },
  subtitle: { fontSize: 14, textAlign: 'center', color: COLORS.textSecondary, marginBottom: 28 },
  field: { marginBottom: 16 },
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