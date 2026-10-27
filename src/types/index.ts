export type Currency = 'Bs.' | '$' | 'R$';

export interface StoreSettings {
  storeName: string;
  slogan: string;
  announcementBar: string;
  currency: Currency;
  primaryColor: string;
  accentColor: string;
  whatsappNumber: string;
  imgbbApiKey?: string;
  logoUrl?: string;
  address: string;
  bankAccountDetails: string;
  qrImageUrl?: string;
}

export interface ProductVariant {
  size: string; // e.g. 'P/S', 'M', 'G/L', 'GG/XL', 'XGG' or numeric '38', '39', '40', etc.
  stock: number;
  sku?: string;
}

export type ProductCategory = 
  | 'Camisas UV50+' 
  | 'Botinas de Trabajo' 
  | 'Jeans' 
  | 'Gorras y Accesorios' 
  | 'Mujer' 
  | 'Infantil';

export type ProductGender = 'Hombre' | 'Mujer' | 'Unisex' | 'Infantil';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  gender: ProductGender;
  costPrice: number;
  salePrice: number;
  wholesalePrice: number;
  wholesaleMinQty: number; // e.g. 3
  allowCustomization: boolean; // personalizable con nombre/logo
  customizationPrice: number; // e.g. 25 Bs.
  description: string;
  image: string;
  images?: string[];
  badges: string[];
  variants: ProductVariant[];
  createdAt: string;
}

export interface CartItem {
  id: string; // unique cart item id (product.id + size + customText)
  product: Product;
  selectedSize: string;
  quantity: number;
  customText?: string;
  unitPrice: number;
  isWholesaleApplied: boolean;
}

export type DeliveryMethod = 'Delivery' | 'Encomienda Provincia' | 'Recojo en Tienda';

export interface OrderItem {
  productId: string;
  productName: string;
  size: string;
  quantity: number;
  unitPrice: number;
  costPrice: number;
  customText?: string;
  subtotal: number;
}

export type OrderStatus = 'PENDIENTE' | 'CONFIRMADO' | 'CANCELADO';
export type PaymentMethod = 'Efectivo' | 'QR' | 'Mixto' | 'Crédito/Fiado';

export interface WhatsAppOrder {
  id: string; // e.g. 'BRK-1048'
  customerName: string;
  customerPhone: string;
  customerCity: string;
  deliveryMethod: DeliveryMethod;
  deliveryAddress: string;
  transportCompany?: string; // e.g. 'Flota Trans Copacabana'
  items: OrderItem[];
  totalAmount: number;
  totalCost: number;
  status: OrderStatus;
  paymentMethod?: PaymentMethod;
  amountPaid?: number;
  pendingBalance?: number;
  createdAt: string;
  notes?: string;
}

export interface Sale {
  id: string; // e.g. 'VTA-2041'
  orderCode?: string; // e.g. 'BRK-1048'
  date: string;
  customerName: string;
  customerPhone: string;
  customerCity: string;
  deliveryMethod: DeliveryMethod | string;
  transportCompany?: string;
  items: OrderItem[];
  totalAmount: number;
  totalCost: number;
  grossProfit: number;
  paymentMethod: PaymentMethod;
  cashAmount: number;
  qrAmount: number;
  amountPaid: number;
  pendingBalance: number;
  status: 'PAGADO' | 'PENDIENTE_PAGO';
  sellerName?: string;
  notes?: string;
}

export type CashMovementType = 
  | 'APERTURA' 
  | 'INGRESO_VENTA' 
  | 'PAGO_PERSONAL' 
  | 'GASTO_OPERATIVO' 
  | 'RETIRO_SOCIO'
  | 'COBRO_CREDITO';

export type ExpenseCategory = 
  | 'Sueldo' 
  | 'Adelanto' 
  | 'Comisión' 
  | 'Jornal' 
  | 'Encomienda' 
  | 'Publicidad' 
  | 'Alquiler' 
  | 'Empaque' 
  | 'Venta' 
  | 'Apertura' 
  | 'Cobro Saldo'
  | 'Otro';

export interface CashMovement {
  id: string;
  date: string;
  type: CashMovementType;
  category: ExpenseCategory;
  description: string;
  recipientOrStaff?: string;
  amount: number;
  paymentChannel: 'Efectivo' | 'QR/Banco';
  createdAt: string;
  referenceId?: string; // Sale ID or Order ID
}

export interface CashRegisterDay {
  date: string;
  initialCash: number;
  totalCashSales: number;
  totalQrSales: number;
  totalCashExpenses: number;
  totalQrExpenses: number;
  expectedCashInDrawer: number;
  actualCountedCash?: number;
  difference?: number; // actualCountedCash - expectedCashInDrawer
  status: 'ABIERTA' | 'CERRADA';
  closedAt?: string;
  closedBy?: string;
  notes?: string;
}

export interface SizeExchangeRecord {
  id: string;
  saleId: string;
  customerName: string;
  customerPhone?: string;
  date: string;
  productId: string;
  productName: string;
  returnedSize: string;
  newSize: string;
  reason: string;
  notes?: string;
}

export interface KardexMovement {
  id: string;
  date: string;
  productId: string;
  productName: string;
  size: string;
  type: 'VENTA' | 'REPOSICION' | 'CAMBIO_DEVOLUCION' | 'CAMBIO_ENTREGA' | 'AJUSTE';
  quantity: number; // + or -
  previousStock: number;
  newStock: number;
  referenceId?: string;
  notes?: string;
}
