import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { 
  StoreSettings, 
  Product, 
  WhatsAppOrder, 
  Sale, 
  CashMovement, 
  CashRegisterDay, 
  KardexMovement,
  SizeExchangeRecord 
} from '../types';
import { 
  INITIAL_STORE_SETTINGS, 
  INITIAL_PRODUCTS, 
  INITIAL_ORDERS, 
  INITIAL_SALES, 
  INITIAL_CASH_MOVEMENTS, 
  INITIAL_CASH_DAY, 
  INITIAL_KARDEX 
} from '../data/seedData';

// Keys for local persistence
const STORAGE_KEYS = {
  SETTINGS: 'brk_settings_v1',
  PRODUCTS: 'brk_products_v1',
  ORDERS: 'brk_orders_v1',
  SALES: 'brk_sales_v1',
  CASH_MOVEMENTS: 'brk_cash_movements_v1',
  CASH_DAY: 'brk_cash_day_v1',
  KARDEX: 'brk_kardex_v1',
  SIZE_EXCHANGES: 'brk_size_exchanges_v1',
};

// Check if Supabase credentials exist in environment
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase: SupabaseClient | null = 
  (supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http')) 
    ? createClient(supabaseUrl, supabaseAnonKey) 
    : null;

export const isSupabaseConfigured = (): boolean => {
  return supabase !== null;
};

// --- Storage Service Implementation with LocalStorage Fallback ---

export const storageService = {
  // Settings
  getSettings(): StoreSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Error reading settings from localStorage', e);
    }
    return INITIAL_STORE_SETTINGS;
  },

  saveSettings(settings: StoreSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Error saving settings', e);
    }
  },

  // Products
  getProducts(): Product[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Error reading products from localStorage', e);
    }
    return INITIAL_PRODUCTS;
  },

  saveProducts(products: Product[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.error('Error saving products', e);
    }
  },

  // WhatsApp Orders
  getOrders(): WhatsAppOrder[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Error reading orders from localStorage', e);
    }
    return INITIAL_ORDERS;
  },

  saveOrders(orders: WhatsAppOrder[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.error('Error saving orders', e);
    }
  },

  // Sales
  getSales(): Sale[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SALES);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Error reading sales from localStorage', e);
    }
    return INITIAL_SALES;
  },

  saveSales(sales: Sale[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
    } catch (e) {
      console.error('Error saving sales', e);
    }
  },

  // Cash Movements
  getCashMovements(): CashMovement[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CASH_MOVEMENTS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Error reading cash movements from localStorage', e);
    }
    return INITIAL_CASH_MOVEMENTS;
  },

  saveCashMovements(movements: CashMovement[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CASH_MOVEMENTS, JSON.stringify(movements));
    } catch (e) {
      console.error('Error saving cash movements', e);
    }
  },

  // Cash Register Day
  getCashDay(): CashRegisterDay {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CASH_DAY);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Error reading cash day from localStorage', e);
    }
    return INITIAL_CASH_DAY;
  },

  saveCashDay(day: CashRegisterDay): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CASH_DAY, JSON.stringify(day));
    } catch (e) {
      console.error('Error saving cash day', e);
    }
  },

  // Kardex
  getKardex(): KardexMovement[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.KARDEX);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Error reading kardex from localStorage', e);
    }
    return INITIAL_KARDEX;
  },

  saveKardex(kardex: KardexMovement[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.KARDEX, JSON.stringify(kardex));
    } catch (e) {
      console.error('Error saving kardex', e);
    }
  },

  // Size Exchanges
  getSizeExchanges(): SizeExchangeRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SIZE_EXCHANGES);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Error reading size exchanges from localStorage', e);
    }
    return [];
  },

  saveSizeExchanges(exchanges: SizeExchangeRecord[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SIZE_EXCHANGES, JSON.stringify(exchanges));
    } catch (e) {
      console.error('Error saving size exchanges', e);
    }
  },

  // Reset all data to Seed Demo
  resetToDemo(): void {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_STORE_SETTINGS));
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(INITIAL_SALES));
    localStorage.setItem(STORAGE_KEYS.CASH_MOVEMENTS, JSON.stringify(INITIAL_CASH_MOVEMENTS));
    localStorage.setItem(STORAGE_KEYS.CASH_DAY, JSON.stringify(INITIAL_CASH_DAY));
    localStorage.setItem(STORAGE_KEYS.KARDEX, JSON.stringify(INITIAL_KARDEX));
    localStorage.setItem(STORAGE_KEYS.SIZE_EXCHANGES, JSON.stringify([]));
  },

  // Clear all data
  clearAll(): void {
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
  },
};
