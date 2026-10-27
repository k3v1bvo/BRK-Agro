import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  StoreSettings, 
  Product, 
  CartItem, 
  WhatsAppOrder, 
  Sale, 
  CashMovement, 
  CashRegisterDay, 
  KardexMovement, 
  SizeExchangeRecord,
  PaymentMethod
} from '../types';
import { storageService } from '../services/storage';
import { generateWhatsAppLink } from '../services/whatsapp';

interface StoreContextType {
  settings: StoreSettings;
  updateSettings: (newSettings: Partial<StoreSettings>) => void;
  products: Product[];
  saveProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  replenishStock: (productId: string, replenishments: { size: string; addQty: number }[], newCostPrice?: number) => void;
  
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: Product, size: string, quantity?: number, customText?: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, newQty: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartSavings: number;
  cartItemsCount: number;

  orders: WhatsAppOrder[];
  pendingOrdersCount: number;
  createWhatsAppOrder: (orderData: Omit<WhatsAppOrder, 'id' | 'createdAt' | 'status'>) => WhatsAppOrder;
  approveWhatsAppOrder: (orderId: string, paymentMethod: PaymentMethod, amountPaid: number, notes?: string) => void;
  cancelWhatsAppOrder: (orderId: string) => void;

  sales: Sale[];
  createDirectSale: (saleData: Omit<Sale, 'id' | 'date'>) => Sale;
  collectPendingBalance: (saleId: string, amount: number, paymentMethod: 'Efectivo' | 'QR') => void;

  cashMovements: CashMovement[];
  addCashMovement: (movement: Omit<CashMovement, 'id' | 'date' | 'createdAt'>) => void;
  cashDay: CashRegisterDay;
  closeCashDay: (actualCountedCash: number, closedBy: string, notes?: string) => void;

  kardex: KardexMovement[];
  sizeExchanges: SizeExchangeRecord[];
  executeSizeExchange: (exchange: {
    saleId: string;
    customerName: string;
    customerPhone?: string;
    productId: string;
    returnedSize: string;
    newSize: string;
    reason: string;
    notes?: string;
  }) => boolean;

  viewMode: 'store' | 'admin';
  setViewMode: (mode: 'store' | 'admin') => void;
  activeAdminTab: string;
  setActiveAdminTab: (tab: string) => void;

  resetToDemo: () => void;
  clearAll: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Helper to darken hex color for hover states
function adjustBrightness(hex: string, percent: number) {
  let num = parseInt(hex.replace('#', ''), 16);
  if (isNaN(num)) return hex;
  let amt = Math.round(2.55 * percent);
  let R = (num >> 16) + amt;
  let G = (num >> 8 & 0x00FF) + amt;
  let B = (num & 0x0000FF) + amt;
  return '#' + (
    0x1000000 + 
    (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 + 
    (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 + 
    (B < 255 ? (B < 1 ? 0 : B) : 255)
  ).toString(16).slice(1);
}

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<StoreSettings>(() => storageService.getSettings());
  const [products, setProducts] = useState<Product[]>(() => storageService.getProducts());
  const [orders, setOrders] = useState<WhatsAppOrder[]>(() => storageService.getOrders());
  const [sales, setSales] = useState<Sale[]>(() => storageService.getSales());
  const [cashMovements, setCashMovements] = useState<CashMovement[]>(() => storageService.getCashMovements());
  const [cashDay, setCashDay] = useState<CashRegisterDay>(() => storageService.getCashDay());
  const [kardex, setKardex] = useState<KardexMovement[]>(() => storageService.getKardex());
  const [sizeExchanges, setSizeExchanges] = useState<SizeExchangeRecord[]>(() => storageService.getSizeExchanges());
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'store' | 'admin'>('store');
  const [activeAdminTab, setActiveAdminTab] = useState<string>('dashboard');

  // Update dynamic CSS theme variables when settings change
  useEffect(() => {
    if (settings.primaryColor) {
      document.documentElement.style.setProperty('--primary', settings.primaryColor);
      document.documentElement.style.setProperty('--primary-hover', adjustBrightness(settings.primaryColor, -20));
      document.documentElement.style.setProperty('--primary-light', adjustBrightness(settings.primaryColor, 85));
    }
    if (settings.accentColor) {
      document.documentElement.style.setProperty('--accent', settings.accentColor);
    }
  }, [settings.primaryColor, settings.accentColor]);

  // Settings update
  const updateSettings = (newSettings: Partial<StoreSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      storageService.saveSettings(updated);
      return updated;
    });
  };

  // Cart Management with Automatic Wholesale Pricing
  const recalculateCartItem = (item: CartItem, allItems: CartItem[]): CartItem => {
    // Total quantity for this product in entire cart
    const totalProdQty = allItems
      .filter((i) => i.product.id === item.product.id)
      .reduce((sum, i) => sum + i.quantity, 0);

    const isWholesale = totalProdQty >= (item.product.wholesaleMinQty || 3);
    const basePrice = isWholesale ? item.product.wholesalePrice : item.product.salePrice;
    const customization = item.customText && item.product.allowCustomization ? item.product.customizationPrice : 0;
    
    return {
      ...item,
      unitPrice: basePrice + customization,
      isWholesaleApplied: isWholesale,
    };
  };

  const addToCart = (product: Product, size: string, quantity = 1, customText?: string) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (i) => i.product.id === product.id && i.selectedSize === size && i.customText === customText
      );

      let updatedList: CartItem[];
      if (existingIdx >= 0) {
        updatedList = prev.map((item, idx) => 
          idx === existingIdx ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        const newItem: CartItem = {
          id: `${product.id}_${size}_${customText || ''}_${Date.now()}`,
          product,
          selectedSize: size,
          quantity,
          customText,
          unitPrice: product.salePrice + (customText && product.allowCustomization ? product.customizationPrice : 0),
          isWholesaleApplied: false,
        };
        updatedList = [...prev, newItem];
      }

      // Re-apply wholesale pricing
      return updatedList.map((item) => recalculateCartItem(item, updatedList));
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => {
      const updatedList = prev.filter((i) => i.id !== cartItemId);
      return updatedList.map((item) => recalculateCartItem(item, updatedList));
    });
  };

  const updateCartQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) => {
      const updatedList = prev.map((item) => 
        item.id === cartItemId ? { ...item, quantity: newQty } : item
      );
      return updatedList.map((item) => recalculateCartItem(item, updatedList));
    });
  };

  const clearCart = () => setCart([]);

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  }, [cart]);

  const cartSavings = useMemo(() => {
    return cart.reduce((savings, item) => {
      const regularPrice = item.product.salePrice + (item.customText && item.product.allowCustomization ? item.product.customizationPrice : 0);
      const diff = regularPrice - item.unitPrice;
      return diff > 0 ? savings + diff * item.quantity : savings;
    }, 0);
  }, [cart]);

  const cartItemsCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // WhatsApp Order Creation
  const createWhatsAppOrder = (orderData: Omit<WhatsAppOrder, 'id' | 'createdAt' | 'status'>): WhatsAppOrder => {
    const nextNum = 1050 + orders.length;
    const newOrder: WhatsAppOrder = {
      ...orderData,
      id: `BRK-${nextNum}`,
      status: 'PENDIENTE',
      createdAt: new Date().toISOString(),
    };

    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    storageService.saveOrders(updatedOrders);
    clearCart();

    // Trigger WhatsApp link redirect
    const waUrl = generateWhatsAppLink(newOrder, settings);
    window.open(waUrl, '_blank');

    return newOrder;
  };

  // WhatsApp Order Approval (1-Click with Stock Discount & Cash Movement)
  const approveWhatsAppOrder = (
    orderId: string, 
    paymentMethod: PaymentMethod, 
    amountPaid: number, 
    notes?: string
  ) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order || order.status === 'CONFIRMADO') return;

    // 1. Discount stock from exact variants
    const newKardexItems: KardexMovement[] = [];
    const updatedProducts = products.map((prod) => {
      const orderItemsForProd = order.items.filter((i) => i.productId === prod.id);
      if (orderItemsForProd.length === 0) return prod;

      const newVariants = prod.variants.map((v) => {
        const itemVariant = orderItemsForProd.find((i) => i.size === v.size);
        if (itemVariant) {
          const prev = v.stock;
          const next = Math.max(0, prev - itemVariant.quantity);
          newKardexItems.push({
            id: `KDX-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            date: new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().slice(0, 5),
            productId: prod.id,
            productName: prod.name,
            size: v.size,
            type: 'VENTA',
            quantity: -itemVariant.quantity,
            previousStock: prev,
            newStock: next,
            referenceId: order.id,
            notes: `Venta WhatsApp #${order.id} a ${order.customerName}`,
          });
          return { ...v, stock: next };
        }
        return v;
      });

      return { ...prod, variants: newVariants };
    });

    setProducts(updatedProducts);
    storageService.saveProducts(updatedProducts);

    // Save Kardex
    const updatedKardex = [...newKardexItems, ...kardex];
    setKardex(updatedKardex);
    storageService.saveKardex(updatedKardex);

    // 2. Generate Sale
    const pendingBalance = Math.max(0, order.totalAmount - amountPaid);
    const saleId = `VTA-${2000 + sales.length + 1}`;
    
    let cashAmount = 0;
    let qrAmount = 0;
    if (paymentMethod === 'Efectivo') cashAmount = amountPaid;
    else if (paymentMethod === 'QR') qrAmount = amountPaid;
    else if (paymentMethod === 'Mixto') {
      cashAmount = Math.round(amountPaid / 2);
      qrAmount = amountPaid - cashAmount;
    }

    const newSale: Sale = {
      id: saleId,
      orderCode: order.id,
      date: new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().slice(0, 5),
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      customerCity: order.customerCity,
      deliveryMethod: order.deliveryMethod,
      transportCompany: order.transportCompany,
      items: order.items,
      totalAmount: order.totalAmount,
      totalCost: order.totalCost,
      grossProfit: order.totalAmount - order.totalCost,
      paymentMethod,
      cashAmount,
      qrAmount,
      amountPaid,
      pendingBalance,
      status: pendingBalance === 0 ? 'PAGADO' : 'PENDIENTE_PAGO',
      sellerName: 'WhatsApp Online',
      notes: notes || order.notes,
    };

    const updatedSales = [newSale, ...sales];
    setSales(updatedSales);
    storageService.saveSales(updatedSales);

    // 3. Generate Cash Movement
    const newMovements: CashMovement[] = [];
    if (cashAmount > 0) {
      newMovements.push({
        id: `MOV-${Date.now()}-c`,
        date: newSale.date,
        type: 'INGRESO_VENTA',
        category: 'Venta',
        description: `Cobro Venta #${order.id} ${order.customerName} (Efectivo)`,
        amount: cashAmount,
        paymentChannel: 'Efectivo',
        createdAt: new Date().toISOString(),
        referenceId: saleId,
      });
    }
    if (qrAmount > 0) {
      newMovements.push({
        id: `MOV-${Date.now()}-q`,
        date: newSale.date,
        type: 'INGRESO_VENTA',
        category: 'Venta',
        description: `Cobro Venta #${order.id} ${order.customerName} (QR)`,
        amount: qrAmount,
        paymentChannel: 'QR/Banco',
        createdAt: new Date().toISOString(),
        referenceId: saleId,
      });
    }

    const updatedMovements = [...newMovements, ...cashMovements];
    setCashMovements(updatedMovements);
    storageService.saveCashMovements(updatedMovements);

    // 4. Update Cash Day
    const updatedCashDay: CashRegisterDay = {
      ...cashDay,
      totalCashSales: cashDay.totalCashSales + cashAmount,
      totalQrSales: cashDay.totalQrSales + qrAmount,
      expectedCashInDrawer: cashDay.expectedCashInDrawer + cashAmount,
    };
    setCashDay(updatedCashDay);
    storageService.saveCashDay(updatedCashDay);

    // 5. Update Order Status
    const updatedOrders = orders.map((o) => 
      o.id === orderId 
        ? { ...o, status: 'CONFIRMADO' as const, paymentMethod, amountPaid, pendingBalance } 
        : o
    );
    setOrders(updatedOrders);
    storageService.saveOrders(updatedOrders);

    // Confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: [settings.primaryColor || '#0b4f26', settings.accentColor || '#d97706', '#22c55e']
      });
    } catch (e) {
      console.log('Confetti triggered', e);
    }
  };

  const cancelWhatsAppOrder = (orderId: string) => {
    const updatedOrders = orders.map((o) => 
      o.id === orderId ? { ...o, status: 'CANCELADO' as const } : o
    );
    setOrders(updatedOrders);
    storageService.saveOrders(updatedOrders);
  };

  // Direct In-Store POS Sale
  const createDirectSale = (saleData: Omit<Sale, 'id' | 'date'>): Sale => {
    const saleId = `VTA-${2000 + sales.length + 1}`;
    const dateStr = new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().slice(0, 5);
    
    const newSale: Sale = {
      ...saleData,
      id: saleId,
      date: dateStr,
    };

    // Discount variant stock
    const newKardexItems: KardexMovement[] = [];
    const updatedProducts = products.map((prod) => {
      const itemsForProd = saleData.items.filter((i) => i.productId === prod.id);
      if (itemsForProd.length === 0) return prod;

      const newVariants = prod.variants.map((v) => {
        const itemVariant = itemsForProd.find((i) => i.size === v.size);
        if (itemVariant) {
          const prev = v.stock;
          const next = Math.max(0, prev - itemVariant.quantity);
          newKardexItems.push({
            id: `KDX-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            date: dateStr,
            productId: prod.id,
            productName: prod.name,
            size: v.size,
            type: 'VENTA',
            quantity: -itemVariant.quantity,
            previousStock: prev,
            newStock: next,
            referenceId: saleId,
            notes: `Venta Mostrador POS ${saleId}`,
          });
          return { ...v, stock: next };
        }
        return v;
      });

      return { ...prod, variants: newVariants };
    });

    setProducts(updatedProducts);
    storageService.saveProducts(updatedProducts);

    // Save Kardex
    const updatedKardex = [...newKardexItems, ...kardex];
    setKardex(updatedKardex);
    storageService.saveKardex(updatedKardex);

    // Add cash movements
    const newMovements: CashMovement[] = [];
    if (newSale.cashAmount > 0) {
      newMovements.push({
        id: `MOV-${Date.now()}-c`,
        date: dateStr,
        type: 'INGRESO_VENTA',
        category: 'Venta',
        description: `Venta POS #${saleId} ${newSale.customerName} (Efectivo)`,
        amount: newSale.cashAmount,
        paymentChannel: 'Efectivo',
        createdAt: new Date().toISOString(),
        referenceId: saleId,
      });
    }
    if (newSale.qrAmount > 0) {
      newMovements.push({
        id: `MOV-${Date.now()}-q`,
        date: dateStr,
        type: 'INGRESO_VENTA',
        category: 'Venta',
        description: `Venta POS #${saleId} ${newSale.customerName} (QR)`,
        amount: newSale.qrAmount,
        paymentChannel: 'QR/Banco',
        createdAt: new Date().toISOString(),
        referenceId: saleId,
      });
    }

    const updatedMovements = [...newMovements, ...cashMovements];
    setCashMovements(updatedMovements);
    storageService.saveCashMovements(updatedMovements);

    // Update cash register
    const updatedCashDay: CashRegisterDay = {
      ...cashDay,
      totalCashSales: cashDay.totalCashSales + newSale.cashAmount,
      totalQrSales: cashDay.totalQrSales + newSale.qrAmount,
      expectedCashInDrawer: cashDay.expectedCashInDrawer + newSale.cashAmount,
    };
    setCashDay(updatedCashDay);
    storageService.saveCashDay(updatedCashDay);

    const updatedSales = [newSale, ...sales];
    setSales(updatedSales);
    storageService.saveSales(updatedSales);

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: [settings.primaryColor || '#0b4f26', '#10b981']
      });
    } catch (e) {
      console.log(e);
    }

    return newSale;
  };

  // Collect Pending Balance (Fiados / Adelantos)
  const collectPendingBalance = (saleId: string, amount: number, paymentMethod: 'Efectivo' | 'QR') => {
    const sale = sales.find((s) => s.id === saleId);
    if (!sale || sale.pendingBalance <= 0) return;

    const actualCollected = Math.min(amount, sale.pendingBalance);
    const newPending = sale.pendingBalance - actualCollected;
    const dateStr = new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().slice(0, 5);

    const updatedSales = sales.map((s) => {
      if (s.id === saleId) {
        return {
          ...s,
          amountPaid: s.amountPaid + actualCollected,
          pendingBalance: newPending,
          status: (newPending === 0 ? 'PAGADO' : 'PENDIENTE_PAGO') as 'PAGADO' | 'PENDIENTE_PAGO',
          cashAmount: paymentMethod === 'Efectivo' ? s.cashAmount + actualCollected : s.cashAmount,
          qrAmount: paymentMethod === 'QR' ? s.qrAmount + actualCollected : s.qrAmount,
        };
      }
      return s;
    });

    setSales(updatedSales);
    storageService.saveSales(updatedSales);

    // Record cash movement
    const newMovement: CashMovement = {
      id: `MOV-${Date.now()}-cobro`,
      date: dateStr,
      type: 'COBRO_CREDITO',
      category: 'Cobro Saldo',
      description: `Cobro Saldo Pendiente Venta #${sale.id} (${sale.customerName})`,
      amount: actualCollected,
      paymentChannel: paymentMethod === 'Efectivo' ? 'Efectivo' : 'QR/Banco',
      createdAt: new Date().toISOString(),
      referenceId: saleId,
    };

    const updatedMovements = [newMovement, ...cashMovements];
    setCashMovements(updatedMovements);
    storageService.saveCashMovements(updatedMovements);

    // Update cash register
    const updatedCashDay: CashRegisterDay = {
      ...cashDay,
      totalCashSales: paymentMethod === 'Efectivo' ? cashDay.totalCashSales + actualCollected : cashDay.totalCashSales,
      totalQrSales: paymentMethod === 'QR' ? cashDay.totalQrSales + actualCollected : cashDay.totalQrSales,
      expectedCashInDrawer: paymentMethod === 'Efectivo' ? cashDay.expectedCashInDrawer + actualCollected : cashDay.expectedCashInDrawer,
    };
    setCashDay(updatedCashDay);
    storageService.saveCashDay(updatedCashDay);
  };

  // Size Exchange Assistant (1er Cambio de Talla Gratis)
  const executeSizeExchange = (exchange: {
    saleId: string;
    customerName: string;
    customerPhone?: string;
    productId: string;
    returnedSize: string;
    newSize: string;
    reason: string;
    notes?: string;
  }): boolean => {
    const prod = products.find((p) => p.id === exchange.productId);
    if (!prod) return false;

    const newSizeVariant = prod.variants.find((v) => v.size === exchange.newSize);
    if (!newSizeVariant || newSizeVariant.stock <= 0) {
      alert(`No hay stock disponible en la nueva talla ${exchange.newSize}`);
      return false;
    }

    const dateStr = new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().slice(0, 5);

    // Update stock: +1 to returned size, -1 from new size
    let prevReturnStock = 0;
    let nextReturnStock = 0;
    let prevNewStock = 0;
    let nextNewStock = 0;

    const updatedProducts = products.map((p) => {
      if (p.id !== exchange.productId) return p;

      const newVariants = p.variants.map((v) => {
        if (v.size === exchange.returnedSize) {
          prevReturnStock = v.stock;
          nextReturnStock = v.stock + 1;
          return { ...v, stock: nextReturnStock };
        }
        if (v.size === exchange.newSize) {
          prevNewStock = v.stock;
          nextNewStock = v.stock - 1;
          return { ...v, stock: nextNewStock };
        }
        return v;
      });

      return { ...p, variants: newVariants };
    });

    setProducts(updatedProducts);
    storageService.saveProducts(updatedProducts);

    // Record Kardex movements
    const kdxReturn: KardexMovement = {
      id: `KDX-${Date.now()}-ret`,
      date: dateStr,
      productId: prod.id,
      productName: prod.name,
      size: exchange.returnedSize,
      type: 'CAMBIO_DEVOLUCION',
      quantity: 1,
      previousStock: prevReturnStock,
      newStock: nextReturnStock,
      referenceId: exchange.saleId,
      notes: `Devolución de Talla ${exchange.returnedSize} por cliente ${exchange.customerName} (Cambio)`,
    };

    const kdxDelivery: KardexMovement = {
      id: `KDX-${Date.now()}-ent`,
      date: dateStr,
      productId: prod.id,
      productName: prod.name,
      size: exchange.newSize,
      type: 'CAMBIO_ENTREGA',
      quantity: -1,
      previousStock: prevNewStock,
      newStock: nextNewStock,
      referenceId: exchange.saleId,
      notes: `Entrega de Nueva Talla ${exchange.newSize} a cliente ${exchange.customerName}`,
    };

    const updatedKardex = [kdxDelivery, kdxReturn, ...kardex];
    setKardex(updatedKardex);
    storageService.saveKardex(updatedKardex);

    // Record Size Exchange
    const newExchangeRecord: SizeExchangeRecord = {
      id: `EXC-${Date.now()}`,
      saleId: exchange.saleId,
      customerName: exchange.customerName,
      customerPhone: exchange.customerPhone,
      date: dateStr,
      productId: prod.id,
      productName: prod.name,
      returnedSize: exchange.returnedSize,
      newSize: exchange.newSize,
      reason: exchange.reason,
      notes: exchange.notes,
    };

    const updatedExchanges = [newExchangeRecord, ...sizeExchanges];
    setSizeExchanges(updatedExchanges);
    storageService.saveSizeExchanges(updatedExchanges);

    return true;
  };

  // Replenish Stock (+50, +30)
  const replenishStock = (
    productId: string, 
    replenishments: { size: string; addQty: number }[], 
    newCostPrice?: number
  ) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;

    const dateStr = new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().slice(0, 5);
    const newKardexItems: KardexMovement[] = [];

    const updatedProducts = products.map((p) => {
      if (p.id !== productId) return p;

      const newVariants = p.variants.map((v) => {
        const item = replenishments.find((r) => r.size === v.size);
        if (item && item.addQty > 0) {
          const prev = v.stock;
          const next = prev + item.addQty;
          newKardexItems.push({
            id: `KDX-${Date.now()}-${v.size}`,
            date: dateStr,
            productId: p.id,
            productName: p.name,
            size: v.size,
            type: 'REPOSICION',
            quantity: item.addQty,
            previousStock: prev,
            newStock: next,
            notes: `Reposición de mercadería (+${item.addQty} u.)`,
          });
          return { ...v, stock: next };
        }
        return v;
      });

      return {
        ...p,
        costPrice: newCostPrice !== undefined && newCostPrice > 0 ? newCostPrice : p.costPrice,
        variants: newVariants,
      };
    });

    setProducts(updatedProducts);
    storageService.saveProducts(updatedProducts);

    const updatedKardex = [...newKardexItems, ...kardex];
    setKardex(updatedKardex);
    storageService.saveKardex(updatedKardex);
  };

  // Product CRUD
  const saveProduct = (product: Product) => {
    const exists = products.some((p) => p.id === product.id);
    let updatedProducts: Product[];
    if (exists) {
      updatedProducts = products.map((p) => (p.id === product.id ? product : p));
    } else {
      updatedProducts = [product, ...products];
    }
    setProducts(updatedProducts);
    storageService.saveProducts(updatedProducts);
  };

  const deleteProduct = (productId: string) => {
    const updatedProducts = products.filter((p) => p.id !== productId);
    setProducts(updatedProducts);
    storageService.saveProducts(updatedProducts);
  };

  // Cash Operations & Arqueo
  const addCashMovement = (movement: Omit<CashMovement, 'id' | 'date' | 'createdAt'>) => {
    const dateStr = new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().slice(0, 5);
    const newMov: CashMovement = {
      ...movement,
      id: `MOV-${Date.now()}`,
      date: dateStr,
      createdAt: new Date().toISOString(),
    };

    const updatedMovements = [newMov, ...cashMovements];
    setCashMovements(updatedMovements);
    storageService.saveCashMovements(updatedMovements);

    // Update Cash Day
    let newExpected = cashDay.expectedCashInDrawer;
    let newCashExp = cashDay.totalCashExpenses;
    let newQrExp = cashDay.totalQrExpenses;

    if (movement.paymentChannel === 'Efectivo') {
      newExpected -= movement.amount;
      newCashExp += movement.amount;
    } else {
      newQrExp += movement.amount;
    }

    const updatedCashDay: CashRegisterDay = {
      ...cashDay,
      totalCashExpenses: newCashExp,
      totalQrExpenses: newQrExp,
      expectedCashInDrawer: newExpected,
    };
    setCashDay(updatedCashDay);
    storageService.saveCashDay(updatedCashDay);
  };

  const closeCashDay = (actualCountedCash: number, closedBy: string, notes?: string) => {
    const diff = actualCountedCash - cashDay.expectedCashInDrawer;
    const closed: CashRegisterDay = {
      ...cashDay,
      actualCountedCash,
      difference: diff,
      status: 'CERRADA',
      closedAt: new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().slice(0, 5),
      closedBy,
      notes,
    };
    setCashDay(closed);
    storageService.saveCashDay(closed);
  };

  // Reset to seed data
  const resetToDemo = () => {
    storageService.resetToDemo();
    setSettings(storageService.getSettings());
    setProducts(storageService.getProducts());
    setOrders(storageService.getOrders());
    setSales(storageService.getSales());
    setCashMovements(storageService.getCashMovements());
    setCashDay(storageService.getCashDay());
    setKardex(storageService.getKardex());
    setSizeExchanges(storageService.getSizeExchanges());
    setCart([]);
  };

  const clearAll = () => {
    storageService.clearAll();
    setProducts([]);
    setOrders([]);
    setSales([]);
    setCashMovements([]);
    setKardex([]);
    setSizeExchanges([]);
    setCart([]);
  };

  const pendingOrdersCount = useMemo(() => {
    return orders.filter((o) => o.status === 'PENDIENTE').length;
  }, [orders]);

  return (
    <StoreContext.Provider
      value={{
        settings,
        updateSettings,
        products,
        saveProduct,
        deleteProduct,
        replenishStock,
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal,
        cartSavings,
        cartItemsCount,
        orders,
        pendingOrdersCount,
        createWhatsAppOrder,
        approveWhatsAppOrder,
        cancelWhatsAppOrder,
        sales,
        createDirectSale,
        collectPendingBalance,
        cashMovements,
        addCashMovement,
        cashDay,
        closeCashDay,
        kardex,
        sizeExchanges,
        executeSizeExchange,
        viewMode,
        setViewMode,
        activeAdminTab,
        setActiveAdminTab,
        resetToDemo,
        clearAll,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
