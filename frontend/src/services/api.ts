import axios from 'axios';
import { useAuthStore } from '../hooks/useAuthStore';
import { useCartStore } from '../hooks/useCartStore';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  const sessionId = useCartStore.getState().sessionId;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers['x-session-id'] = sessionId;

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  puffs?: number;
  images: Record<string, string>; // { default: string, [flavor]: string }
  flavors: string[];
  category: { id: string; name: string; slug: string };
  stock: { flavor: string; quantity: number }[];
  featured: boolean;
  totalStock: number;
}

export interface CepResult {
  cep: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  isDeliveryAvailable: boolean;
  deliveryFee: number;
  deliveryMessage: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  subtotal: number;
  shipping: number;
  cashbackEarned?: number;
  deliveryType: string;
  createdAt: string;
  pixCode?: string;
  pixQrCode?: string;
  items: { name: string; flavor: string; quantity: number; price: number }[];
}

export interface Settings {
  storeName: string;
  storePhone?: string;
  storeWhatsApp?: string;
  storeInstagram?: string;
  deliveryFee: number;
  deliveryCity: string;
  cashbackPercent: number;
}

export const apiService = {
  // Auth
  async login(phone: string, password: string) {
    const { data } = await api.post('/auth/login', { phone, password });
    return data;
  },

  async register(userData: { name: string; phone: string; email?: string; password: string; lgpdAccepted: string }) {
    const { data } = await api.post('/auth/register', userData);
    return data;
  },

  // Products
  async getProducts(params?: { category?: string; featured?: boolean; search?: string }) {
    const { data } = await api.get('/products', { params });
    return data;
  },

  async getProduct(slug: string): Promise<Product> {
    const { data } = await api.get(`/products/${slug}`);
    return data;
  },

  // CEP
  async searchCep(cep: string): Promise<CepResult> {
    const { data } = await api.get(`/cep/${cep}`);
    return data;
  },

  // Orders
  async createOrder(orderData: any): Promise<Order> {
    const { data } = await api.post('/orders', orderData);
    return data;
  },

  async trackOrder(orderNumber: string): Promise<Order> {
    const { data } = await api.get(`/orders/track/${orderNumber}`);
    return data;
  },

  // Settings
  async getSettings(): Promise<Settings> {
    const { data } = await api.get('/settings');
    return data;
  },

  // Admin
  async getAdminStats() {
    const { data } = await api.get('/admin/stats');
    return data;
  },

  async getAdminOrders(params?: { status?: string }) {
    const { data } = await api.get('/admin/orders', { params });
    return data;
  },

  async updateOrderStatus(orderId: string, status: string) {
    const { data } = await api.patch(`/admin/orders/${orderId}`, { status });
    return data;
  },

  async getAdminProducts() {
    const { data } = await api.get('/admin/products');
    return data;
  },

  async getAdminStock() {
    const { data } = await api.get('/admin/stock');
    return data;
  },

  async updateStock(stockId: string, quantity: number) {
    const { data } = await api.patch(`/admin/stock/${stockId}`, { quantity });
    return data;
  },

  async getAdminSettings(): Promise<Settings> {
    const { data } = await api.get('/admin/settings');
    return data;
  },

  async updateSettings(settings: Partial<Settings>) {
    const { data } = await api.put('/admin/settings', settings);
    return data;
  },
};

export default api;
