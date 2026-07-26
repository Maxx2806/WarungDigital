import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEYS = {
  USER_SESSION: '@warung_user_session',
  USER_CREDENTIALS: '@warung_user_credentials',
  PRODUCTS: '@warung_products',
  CART: '@warung_cart',
  TRANSACTIONS: '@warung_transactions',
};

const getItem = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value != null ? JSON.parse(value) : null;
  } catch (e) {
    console.error(`Gagal membaca ${key}`, e);
    return null;
  }
};

const setItem = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.error(`Gagal menyimpan ${key}`, e);
    return false;
  }
};

export const saveSession = (user) => setItem(STORAGE_KEYS.USER_SESSION, user);
export const getSession = () => getItem(STORAGE_KEYS.USER_SESSION);
export const clearSession = () => AsyncStorage.removeItem(STORAGE_KEYS.USER_SESSION);

export const saveCredentials = (cred) => setItem(STORAGE_KEYS.USER_CREDENTIALS, cred);
export const getCredentials = () => getItem(STORAGE_KEYS.USER_CREDENTIALS);

export const getProducts = async () => (await getItem(STORAGE_KEYS.PRODUCTS)) || [];
export const saveProducts = (products) => setItem(STORAGE_KEYS.PRODUCTS, products);

export const addProduct = async (product) => {
  const products = await getProducts();
  const updated = [product, ...products];
  await saveProducts(updated);
  return updated;
};

export const deleteProduct = async (productId) => {
  const products = await getProducts();
  const updated = products.filter((p) => p.id !== productId);
  await saveProducts(updated);
  return updated;
};

export const getCart = async () => (await getItem(STORAGE_KEYS.CART)) || [];
export const saveCart = (cart) => setItem(STORAGE_KEYS.CART, cart);
export const clearCart = () => setItem(STORAGE_KEYS.CART, []);

export const addToCart = async (product, qty = 1) => {
  const cart = await getCart();
  const existingIndex = cart.findIndex((item) => item.id === product.id);
  let updated;
  if (existingIndex >= 0) {
    updated = [...cart];
    updated[existingIndex] = {
      ...updated[existingIndex],
      qty: updated[existingIndex].qty + qty,
    };
  } else {
    updated = [...cart, { ...product, qty }];
  }
  await saveCart(updated);
  return updated;
};

export const removeFromCart = async (productId) => {
  const cart = await getCart();
  const updated = cart.filter((item) => item.id !== productId);
  await saveCart(updated);
  return updated;
};

export const getTransactions = async () => (await getItem(STORAGE_KEYS.TRANSACTIONS)) || [];

export const addTransaction = async (transaction) => {
  const transactions = await getTransactions();
  const updated = [transaction, ...transactions];
  await setItem(STORAGE_KEYS.TRANSACTIONS, updated);
  return updated;
};