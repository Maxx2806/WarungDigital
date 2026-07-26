import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import KatalogScreen from '../screens/KatalogScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import AddProductScreen from '../screens/AddProductScreen';
import KeranjangScreen from '../screens/KeranjangScreen';
import RiwayatScreen from '../screens/RiwayatScreen';
import RiwayatDetailScreen from '../screens/RiwayatDetailScreen';
import ProfilScreen from '../screens/ProfilScreen';
import LoadingSpinner from '../components/LoadingSpinner';
import COLORS from '../constants/colors';
import { useAuth } from '../context/AuthContext';

const RootStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TAB_ICONS = { Katalog: '🛍️', Keranjang: '🛒', Riwayat: '🧾', Profil: '👤' };

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: { height: 58, paddingBottom: 8, paddingTop: 6 },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarIcon: ({ focused }) => (
          <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>{TAB_ICONS[route.name]}</Text>
        ),
      })}
    >
      <Tab.Screen name="Katalog" component={KatalogScreen} />
      <Tab.Screen name="Keranjang" component={KeranjangScreen} />
      <Tab.Screen name="Riwayat" component={RiwayatScreen} />
      <Tab.Screen name="Profil" component={ProfilScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { isLoggedIn, checkingSession } = useAuth();

  if (checkingSession) {
    return <LoadingSpinner label="Menyiapkan aplikasi..." />;
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {!isLoggedIn ? (
          <RootStack.Group>
            <RootStack.Screen name="Login" component={LoginScreen} />
            <RootStack.Screen name="Register" component={RegisterScreen} />
          </RootStack.Group>
        ) : (
          <RootStack.Group>
            <RootStack.Screen name="Main" component={MainTabs} />
            <RootStack.Screen
              name="ProductDetail"
              component={ProductDetailScreen}
              options={{ headerShown: true, title: 'Detail Produk', headerStyle: { backgroundColor: COLORS.primary }, headerTintColor: '#fff' }}
            />
            <RootStack.Screen
              name="AddProduct"
              component={AddProductScreen}
              options={{ headerShown: true, title: 'Tambah Produk', headerStyle: { backgroundColor: COLORS.primary }, headerTintColor: '#fff' }}
            />
            <RootStack.Screen
              name="RiwayatDetail"
              component={RiwayatDetailScreen}
              options={{ headerShown: true, title: 'Detail Transaksi', headerStyle: { backgroundColor: COLORS.primary }, headerTintColor: '#fff' }}
            />
          </RootStack.Group>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}