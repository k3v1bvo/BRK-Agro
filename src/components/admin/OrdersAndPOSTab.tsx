import React, { useState } from 'react';
import { 
  Inbox, 
  Store, 
  RefreshCw, 
  CreditCard, 
  CheckCircle2, 
  XCircle, 
  Phone, 
  Truck, 
  Calendar, 
  User, 
  DollarSign,
  AlertCircle,
  Plus,
  Minus,
  Sparkles,
  Printer
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { WhatsAppOrder, PaymentMethod, Product, Sale } from '../../types';

export const OrdersAndPOSTab: React.FC = () => {
  const { 
    settings, 
    orders, 
    approveWhatsAppOrder, 
    cancelWhatsAppOrder, 
    products, 
    sales, 
    createDirectSale, 
    collectPendingBalance,
    executeSizeExchange,
    sizeExchanges,
    setActiveAdminTab
  } = useStore();

  const currency = settings.currency || 'Bs.';
  const [subTab, setSubTab] = useState<'orders' | 'pos' | 'receivables' | 'exchanges'>('orders');

  // Order Approval Modal State
  const [approvingOrder, setApprovingOrder] = useState<WhatsAppOrder | null>(null);
  const [approvalPaymentMethod, setApprovalPaymentMethod] = useState<PaymentMethod>('Efectivo');
  const [approvalAmountPaid, setApprovalAmountPaid] = useState<number>(0);
  const [approvalNotes, setApprovalNotes] = useState<string>('');

  // POS State
  const [posSelectedProductId, setPosSelectedProductId] = useState<string>(products[0]?.id || '');
  const [posSelectedSize, setPosSelectedSize] = useState<string>('');
  const [posQuantity, setPosQuantity] = useState<number>(1);
  const [posCart, setPosCart] = useState<{
    product: Product;
    size: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }[]>([]);
  const [posCustomerName, setPosCustomerName] = useState<string>('Cliente Mostrador');
  const [posCustomerPhone, setPosCustomerPhone] = useState<string>('');
  const [posCustomerCity, setPosCustomerCity] = useState<string>('Santa Cruz (Tienda Física)');
  const [posPaymentMethod, setPosPaymentMethod] = useState<PaymentMethod>('Efectivo');
  const [posAmountPaid, setPosAmountPaid] = useState<number>(0);

  // Receivables (Cobro de Saldo) State
  const [collectingSale, setCollectingSale] = useState<Sale | null>(null);
  const [collectAmount, setCollectAmount] = useState<number>(0);
  const [collectMethod, setCollectMethod] = useState<'Efectivo' | 'QR'>('Efectivo');

  // Size Exchange State
  const [exchangeSaleId, setExchangeSaleId] = useState<string>('');
  const [exchangeProductId, setExchangeProductId] = useState<string>('');
  const [exchangeReturnedSize, setExchangeReturnedSize] = useState<string>('');
  const [exchangeNewSize, setExchangeNewSize] = useState<string>('');
  const [exchangeReason, setExchangeReason] = useState<string>('Talla muy ajustada');
  const [exchangeCustomerName, setExchangeCustomerName] = useState<string>('');
  const [exchangeSuccess, setExchangeSuccess] = useState<boolean>(false);

  // Setup initial POS selected size when product changes
  const selectedPosProduct = products.find((p) => p.id === posSelectedProductId);
  React.useEffect(() => {
    if (selectedPosProduct && selectedPosProduct.variants.length > 0) {
      const avail = selectedPosProduct.variants.find((v) => v.stock > 0) || selectedPosProduct.variants[0];
      setPosSelectedSize(avail.size);
    }
  }, [posSelectedProductId]);

  // Open approval modal
  const handleOpenApproveModal = (order: WhatsAppOrder) => {
    setApprovingOrder(order);
    setApprovalAmountPaid(order.totalAmount);
    setApprovalPaymentMethod('Efectivo');
    setApprovalNotes('');
  };

  const handleConfirmApproval = () => {
    if (!approvingOrder) return;
    approveWhatsAppOrder(
      approvingOrder.id,
      approvalPaymentMethod,
      approvalAmountPaid,
      approvalNotes
    );
    setApprovingOrder(null);
  };

  // POS Add item
  const handlePosAddToCart = () => {
    if (!selectedPosProduct || !posSelectedSize) return;
    const variant = selectedPosProduct.variants.find((v) => v.size === posSelectedSize);
    if (!variant || variant.stock <= 0) {
      alert('Talla seleccionada sin stock disponible');
      return;
    }

    const unitPrice = selectedPosProduct.salePrice;
    const existingIdx = posCart.findIndex(
      (i) => i.product.id === selectedPosProduct.id && i.size === posSelectedSize
    );

    if (existingIdx >= 0) {
      const updated = [...posCart];
      updated[existingIdx].quantity += posQuantity;
      updated[existingIdx].subtotal = updated[existingIdx].quantity * unitPrice;
      setPosCart(updated);
    } else {
      setPosCart([
        ...posCart,
        {
          product: selectedPosProduct,
          size: posSelectedSize,
          quantity: posQuantity,
          unitPrice,
          subtotal: unitPrice * posQuantity,
        },
      ]);
    }
  };

  const posTotal = posCart.reduce((sum, item) => sum + item.subtotal, 0);

  const handleFinishPosSale = () => {
    if (posCart.length === 0) return;
    const totalCost = posCart.reduce((sum, i) => sum + i.product.costPrice * i.quantity, 0);
    const amountPaid = posAmountPaid > 0 ? posAmountPaid : posTotal;
    const pendingBalance = Math.max(0, posTotal - amountPaid);

    let cashAmount = 0;
    let qrAmount = 0;
    if (posPaymentMethod === 'Efectivo') cashAmount = amountPaid;
    else if (posPaymentMethod === 'QR') qrAmount = amountPaid;
    else if (posPaymentMethod === 'Mixto') {
      cashAmount = Math.round(amountPaid / 2);
      qrAmount = amountPaid - cashAmount;
    }

    createDirectSale({
      customerName: posCustomerName.trim() || 'Cliente Mostrador',
      customerPhone: posCustomerPhone.trim(),
      customerCity: posCustomerCity.trim(),
      deliveryMethod: 'Recojo en Tienda',
      items: posCart.map((i) => ({
        productId: i.product.id,
        productName: i.product.name,
        size: i.size,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        costPrice: i.product.costPrice,
        subtotal: i.subtotal,
      })),
      totalAmount: posTotal,
      totalCost,
      grossProfit: posTotal - totalCost,
      paymentMethod: posPaymentMethod,
      cashAmount,
      qrAmount,
      amountPaid,
      pendingBalance,
      status: pendingBalance === 0 ? 'PAGADO' : 'PENDIENTE_PAGO',
      sellerName: 'Rodrigo (Ventas)',
    });

    // Reset POS
    setPosCart([]);
    setPosCustomerName('Cliente Mostrador');
    setPosCustomerPhone('');
    setPosAmountPaid(0);
  };

  // Size exchange submit
  const handleExecuteExchange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!exchangeProductId || !exchangeReturnedSize || !exchangeNewSize) {
      alert('Por favor selecciona el producto, talla devuelta y talla nueva.');
      return;
    }

    const success = executeSizeExchange({
      saleId: exchangeSaleId || 'VTA-DIRECTO',
      customerName: exchangeCustomerName || 'Cliente Cambio',
      productId: exchangeProductId,
      returnedSize: exchangeReturnedSize,
      newSize: exchangeNewSize,
      reason: exchangeReason,
    });

    if (success) {
      setExchangeSuccess(true);
      setTimeout(() => setExchangeSuccess(false), 2500);
      setExchangeSaleId('');
      setExchangeCustomerName('');
    }
  };

  // Sales with pending balance
  const creditSales = sales.filter((s) => s.pendingBalance > 0);

  return (
    <div className="space-y-6">
      
      {/* Sub Tabs navigation */}
      <div className="bg-white p-2 rounded-2xl shadow-sm border border-stone-200 flex flex-wrap gap-2">
        <button
          onClick={() => setSubTab('orders')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            subTab === 'orders'
              ? 'bg-stone-900 text-amber-400 shadow-sm'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Inbox className="w-4 h-4" />
          <span>Bandeja Pedidos WhatsApp</span>
          {orders.filter((o) => o.status === 'PENDIENTE').length > 0 && (
            <span className="bg-red-600 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">
              {orders.filter((o) => o.status === 'PENDIENTE').length}
            </span>
          )}
        </button>

        <button
          onClick={() => setSubTab('pos')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            subTab === 'pos'
              ? 'bg-stone-900 text-amber-400 shadow-sm'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>POS Venta Mostrador</span>
        </button>

        <button
          onClick={() => setSubTab('receivables')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            subTab === 'receivables'
              ? 'bg-stone-900 text-amber-400 shadow-sm'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Cuentas por Cobrar (Fiados)</span>
          {creditSales.length > 0 && (
            <span className="bg-amber-500 text-stone-900 text-[10px] font-black px-1.5 py-0.2 rounded-full">
              {creditSales.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setSubTab('exchanges')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            subTab === 'exchanges'
              ? 'bg-stone-900 text-amber-400 shadow-sm'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <RefreshCw className="w-4 h-4" />
          <span>🔄 Cambio de Talla Express</span>
        </button>
      </div>

      {/* SUB-TAB 1: WHATSAPP ORDERS INBOX */}
      {subTab === 'orders' && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-center justify-between text-xs text-amber-900">
            <div className="flex items-center gap-2 font-bold">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>
                Haz clic en <strong>"✅ Confirmar Venta y Descontar Stock"</strong> para probar la automatización frente al cliente.
              </span>
            </div>
            <span className="font-extrabold text-[11px] bg-amber-200/80 px-2.5 py-1 rounded-lg">
              {orders.filter((o) => o.status === 'PENDIENTE').length} Pendientes
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {orders.map((order) => {
              const isPending = order.status === 'PENDIENTE';
              return (
                <div
                  key={order.id}
                  className={`bg-white rounded-2xl p-5 shadow-sm border transition flex flex-col justify-between ${
                    isPending
                      ? 'border-amber-300 ring-2 ring-amber-400/20'
                      : 'border-stone-200 opacity-80'
                  }`}
                >
                  <div>
                    {/* Order Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-black text-stone-900 font-mono">
                          #{order.id}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                          isPending ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <span className="text-[11px] text-stone-400">
                        {order.createdAt.split('T')[0]}
                      </span>
                    </div>

                    {/* Customer Info */}
                    <div className="mt-3 space-y-1 text-xs">
                      <div className="font-black text-stone-900 text-sm">
                        {order.customerName}
                      </div>
                      <div className="text-stone-600 flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                        <span>+{order.customerPhone}</span>
                      </div>
                      <div className="text-stone-600 flex items-center gap-2">
                        <Truck className="w-3.5 h-3.5 text-stone-400" />
                        <span>{order.customerCity} • {order.deliveryMethod}</span>
                      </div>
                      {order.transportCompany && (
                        <div className="text-amber-800 font-bold text-[11px]">
                          Transporte: {order.transportCompany}
                        </div>
                      )}
                      {order.deliveryAddress && (
                        <div className="text-stone-500 text-[11px]">
                          Punto: {order.deliveryAddress}
                        </div>
                      )}
                    </div>

                    {/* Items List */}
                    <div className="mt-4 pt-3 border-t border-stone-100 space-y-2">
                      <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                        Prendas Solicitadas:
                      </div>
                      {order.items.map((it, idx) => (
                        <div
                          key={idx}
                          className="p-2 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between text-xs"
                        >
                          <div>
                            <span className="font-extrabold text-stone-900">{it.quantity}x</span>{' '}
                            <span className="font-semibold text-stone-700">{it.productName}</span>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="px-1.5 py-0.2 rounded bg-stone-200 text-stone-800 font-black text-[10px]">
                                Talla {it.size}
                              </span>
                              {it.customText && (
                                <span className="text-amber-700 text-[10px] font-bold">
                                  ✍️ "{it.customText}"
                                </span>
                              )}
                            </div>
                          </div>
                          <span className="font-black text-stone-900">
                            {currency} {it.subtotal.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Total & Actions */}
                  <div className="mt-5 pt-3 border-t border-stone-100">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-stone-500 uppercase">
                        Total Pedido:
                      </span>
                      <span className="text-xl font-black text-stone-900">
                        {currency} {order.totalAmount.toLocaleString()}
                      </span>
                    </div>

                    {isPending ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenApproveModal(order)}
                          className="flex-1 py-2.5 px-4 rounded-xl font-black text-xs uppercase tracking-wider text-white shadow-md flex items-center justify-center gap-2 transition active:scale-95 hover:opacity-95"
                          style={{ backgroundColor: settings.primaryColor }}
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                          <span>✅ Confirmar Venta y Descontar Stock</span>
                        </button>
                        <button
                          onClick={() => cancelWhatsAppOrder(order.id)}
                          className="p-2.5 rounded-xl border border-stone-200 text-stone-400 hover:text-red-600 hover:bg-stone-50 transition"
                          title="Cancelar Pedido"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          Venta Confirmada ({order.paymentMethod})
                        </span>
                        <span className="text-[11px] font-normal">Stock descontado</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: DIRECT POS MOSTRADOR */}
      {subTab === 'pos' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left 2 Cols: Product & Variant Picker */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-stone-200 space-y-5">
            <h3 className="text-base font-extrabold text-stone-900">
              Seleccionar Prenda para Venta Directa
            </h3>

            {/* Product Selector */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1.5">
                Producto del Catálogo:
              </label>
              <select
                value={posSelectedProductId}
                onChange={(e) => setPosSelectedProductId(e.target.value)}
                className="w-full text-xs font-bold p-3 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — {currency} {p.salePrice}
                  </option>
                ))}
              </select>
            </div>

            {selectedPosProduct && (
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 flex gap-4">
                <img
                  src={selectedPosProduct.image}
                  alt={selectedPosProduct.name}
                  className="w-20 h-20 object-cover rounded-xl bg-stone-200"
                />
                <div className="flex-1 space-y-1">
                  <h4 className="font-extrabold text-stone-900 text-sm">
                    {selectedPosProduct.name}
                  </h4>
                  <div className="text-xs text-stone-500">
                    Costo: {currency} {selectedPosProduct.costPrice} • Precio Venta: {currency} {selectedPosProduct.salePrice}
                  </div>
                  <div className="text-xs text-amber-700 font-bold">
                    Mayorista desde {selectedPosProduct.wholesaleMinQty} u: {currency} {selectedPosProduct.wholesalePrice}
                  </div>
                </div>
              </div>
            )}

            {/* Variant Size Picker */}
            {selectedPosProduct && (
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1.5">
                  Talla Exacta a Vender:
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {selectedPosProduct.variants.map((v) => {
                    const isSelected = posSelectedSize === v.size;
                    const isZero = v.stock === 0;
                    return (
                      <button
                        key={v.size}
                        type="button"
                        disabled={isZero}
                        onClick={() => setPosSelectedSize(v.size)}
                        className={`py-2 px-1 text-xs font-bold rounded-xl border text-center transition ${
                          isZero
                            ? 'bg-stone-100 text-stone-400 line-through opacity-50 cursor-not-allowed'
                            : isSelected
                            ? 'bg-stone-900 text-amber-400 border-stone-900 shadow ring-2 ring-amber-400/40'
                            : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
                        }`}
                      >
                        <div>{v.size}</div>
                        <div className="text-[10px] font-normal opacity-80">
                          {isZero ? 'Agotado' : `${v.stock} disp.`}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity and Add to POS */}
            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center border border-stone-300 rounded-xl overflow-hidden bg-white">
                <button
                  onClick={() => setPosQuantity(Math.max(1, posQuantity - 1))}
                  className="px-3 py-2 text-stone-700 hover:bg-stone-100 font-bold text-sm"
                >
                  -
                </button>
                <span className="px-4 py-2 text-xs font-black text-stone-900">
                  {posQuantity}
                </span>
                <button
                  onClick={() => setPosQuantity(posQuantity + 1)}
                  className="px-3 py-2 text-stone-700 hover:bg-stone-100 font-bold text-sm"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={handlePosAddToCart}
                className="flex-1 py-3 px-6 rounded-xl font-black text-xs uppercase tracking-wider text-white shadow transition hover:opacity-95"
                style={{ backgroundColor: settings.primaryColor }}
              >
                + Agregar a la Venta
              </button>
            </div>

          </div>

          {/* Right Col: Ticket & Checkout */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 flex flex-col justify-between space-y-4">
            <div>
              <h3 className="text-base font-extrabold text-stone-900 pb-3 border-b border-stone-100">
                Ticket Mostrador
              </h3>

              {/* Items */}
              <div className="mt-3 space-y-2 max-h-52 overflow-y-auto pr-1">
                {posCart.length === 0 ? (
                  <p className="text-xs text-stone-400 py-8 text-center">
                    Agrega prendas para cobrar en mostrador.
                  </p>
                ) : (
                  posCart.map((it, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-extrabold text-stone-900">
                          {it.quantity}x {it.product.name}
                        </div>
                        <span className="text-[10px] bg-stone-200 px-1.5 py-0.2 rounded font-bold">
                          Talla: {it.size}
                        </span>
                      </div>
                      <span className="font-black text-stone-900">
                        {currency} {it.subtotal.toLocaleString()}
                      </span>
                    </div>
                  ))
                )}
              </div>

              {/* Customer fields */}
              <div className="mt-4 pt-4 border-t border-stone-100 space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-stone-500 uppercase">
                    Nombre Cliente:
                  </label>
                  <input
                    type="text"
                    value={posCustomerName}
                    onChange={(e) => setPosCustomerName(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-stone-300"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-500 uppercase">
                      Teléfono:
                    </label>
                    <input
                      type="text"
                      placeholder="77000000"
                      value={posCustomerPhone}
                      onChange={(e) => setPosCustomerPhone(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg border border-stone-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-stone-500 uppercase">
                      Método Pago:
                    </label>
                    <select
                      value={posPaymentMethod}
                      onChange={(e) => setPosPaymentMethod(e.target.value as PaymentMethod)}
                      className="w-full text-xs p-2 rounded-lg border border-stone-300 font-bold"
                    >
                      <option value="Efectivo">Efectivo</option>
                      <option value="QR">QR Simple</option>
                      <option value="Mixto">Mixto</option>
                      <option value="Crédito/Fiado">Crédito / Fiado</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Total and Print */}
            <div className="pt-3 border-t border-stone-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-stone-500 uppercase">Total a Cobrar:</span>
                <span className="text-2xl font-black text-stone-900">
                  {currency} {posTotal.toLocaleString()}
                </span>
              </div>

              <button
                disabled={posCart.length === 0}
                onClick={handleFinishPosSale}
                className="w-full py-3.5 rounded-xl font-black text-xs uppercase tracking-wider text-white shadow-lg transition disabled:bg-stone-300"
                style={{ backgroundColor: posCart.length > 0 ? settings.primaryColor : undefined }}
              >
                Cobrar Venta e Imprimir Nota
              </button>
            </div>

          </div>

        </div>
      )}

      {/* SUB-TAB 3: RECEIVABLES (CUENTAS POR COBRAR / FIADOS) */}
      {subTab === 'receivables' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-stone-900">
                Control de Cuentas por Cobrar & Saldos Pendientes
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Clientes con pagos parciales, adelantos de encomiendas o mercadería fiada
              </p>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs font-bold text-amber-900">
              Total por Cobrar:{' '}
              <span className="text-sm font-black text-amber-800">
                {currency}{' '}
                {creditSales.reduce((sum, s) => sum + s.pendingBalance, 0).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-500 font-extrabold uppercase border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Código / Fecha</th>
                  <th className="py-3 px-4">Cliente & Destino</th>
                  <th className="py-3 px-4">Prendas</th>
                  <th className="py-3 px-4 text-right">Venta Total</th>
                  <th className="py-3 px-4 text-right">Adelanto Pagado</th>
                  <th className="py-3 px-4 text-right text-red-600">Saldo Pendiente</th>
                  <th className="py-3 px-4 text-center">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium">
                {creditSales.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-stone-400">
                      🎉 No tienes saldos pendientes por cobrar en este momento.
                    </td>
                  </tr>
                ) : (
                  creditSales.map((sale) => (
                    <tr key={sale.id} className="hover:bg-stone-50">
                      <td className="py-3.5 px-4 font-mono font-bold text-stone-800">
                        #{sale.id}
                        <div className="text-[10px] text-stone-400 font-sans">{sale.date}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-extrabold text-stone-900">{sale.customerName}</div>
                        <div className="text-[11px] text-stone-500">{sale.customerCity}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        {sale.items.map((i, idx) => (
                          <div key={idx} className="text-[11px]">
                            {i.quantity}x {i.productName} ({i.size})
                          </div>
                        ))}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-stone-900">
                        {currency} {sale.totalAmount.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-right text-emerald-700 font-bold">
                        {currency} {sale.amountPaid.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-right text-red-600 font-black text-sm">
                        {currency} {sale.pendingBalance.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => {
                            setCollectingSale(sale);
                            setCollectAmount(sale.pendingBalance);
                          }}
                          className="px-3 py-1.5 rounded-xl font-bold text-xs bg-emerald-700 hover:bg-emerald-800 text-white shadow"
                        >
                          💰 Registrar Cobro
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: ASISTENTE DE CAMBIO DE TALLA EXPRESS */}
      {subTab === 'exchanges' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Exchange Form */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 space-y-5">
            <div>
              <h3 className="text-base font-extrabold text-stone-900">
                🔄 Asistente de Cambio de Talla (1er Cambio Gratis)
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Devuelve al inventario la talla no ajustada (+1) y descuenta del stock la nueva talla (-1) con registro automático en Kardex.
              </p>
            </div>

            {exchangeSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>¡Cambio de talla procesado con éxito! Stock y Kardex actualizados.</span>
              </div>
            )}

            <form onSubmit={handleExecuteExchange} className="space-y-4">
              
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Nombre del Cliente:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Ing. René Banegas"
                  value={exchangeCustomerName}
                  onChange={(e) => setExchangeCustomerName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Código de Venta Original (Opcional):
                </label>
                <input
                  type="text"
                  placeholder="Ej: VTA-1043 o BRK-1048"
                  value={exchangeSaleId}
                  onChange={(e) => setExchangeSaleId(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Producto a Cambiar:
                </label>
                <select
                  required
                  value={exchangeProductId}
                  onChange={(e) => setExchangeProductId(e.target.value)}
                  className="w-full text-xs font-bold p-2.5 rounded-xl border border-stone-300 bg-stone-50"
                >
                  <option value="">Selecciona la prenda...</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              {exchangeProductId && (
                <div className="grid grid-cols-2 gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <div>
                    <label className="block text-[11px] font-black text-rose-700 uppercase mb-1">
                      ↩️ Talla que Devuelve (+1):
                    </label>
                    <select
                      value={exchangeReturnedSize}
                      onChange={(e) => setExchangeReturnedSize(e.target.value)}
                      className="w-full text-xs font-bold p-2 rounded-lg border border-stone-300"
                    >
                      <option value="">Elegir devuelta...</option>
                      {products.find((p) => p.id === exchangeProductId)?.variants.map((v) => (
                        <option key={v.size} value={v.size}>{v.size} (Act: {v.stock})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-black text-emerald-800 uppercase mb-1">
                      ↪️ Nueva Talla a Entregar (-1):
                    </label>
                    <select
                      value={exchangeNewSize}
                      onChange={(e) => setExchangeNewSize(e.target.value)}
                      className="w-full text-xs font-bold p-2 rounded-lg border border-stone-300"
                    >
                      <option value="">Elegir nueva...</option>
                      {products.find((p) => p.id === exchangeProductId)?.variants.map((v) => (
                        <option key={v.size} value={v.size}>{v.size} (Disp: {v.stock})</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Motivo del Cambio:
                </label>
                <input
                  type="text"
                  placeholder="Ej: Cliente solicitó horma más holgada para jornada de campo"
                  value={exchangeReason}
                  onChange={(e) => setExchangeReason(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-black text-xs uppercase tracking-wider text-white shadow transition hover:opacity-95"
                style={{ backgroundColor: settings.primaryColor }}
              >
                🔄 Procesar Cambio y Actualizar Kardex
              </button>

            </form>
          </div>

          {/* Past Exchanges Log */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 space-y-4">
            <h3 className="text-base font-extrabold text-stone-900 pb-3 border-b border-stone-100">
              Historial de Cambios de Talla Realizados ({sizeExchanges.length})
            </h3>

            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
              {sizeExchanges.length === 0 ? (
                <p className="text-xs text-stone-400 py-12 text-center">
                  Aún no se han registrado cambios de talla.
                </p>
              ) : (
                sizeExchanges.map((exc) => (
                  <div
                    key={exc.id}
                    className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-1"
                  >
                    <div className="flex justify-between font-bold text-stone-800">
                      <span>{exc.customerName}</span>
                      <span className="text-[11px] text-stone-400 font-normal">{exc.date}</span>
                    </div>
                    <div className="text-stone-700 font-semibold">{exc.productName}</div>
                    <div className="flex items-center gap-2 font-bold text-[11px] pt-1">
                      <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                        Devolvió: {exc.returnedSize}
                      </span>
                      <span>➔</span>
                      <span className="text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                        Entregó: {exc.newSize}
                      </span>
                    </div>
                    <div className="text-[11px] text-stone-500 italic mt-1">
                      Motivo: "{exc.reason}"
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      )}

      {/* MODAL 1: ORDER APPROVAL WITH STOCK DEDUCTION */}
      {approvingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-stone-100">
              <h3 className="font-extrabold text-stone-900 text-base">
                Confirmar Venta Pedido #{approvingOrder.id}
              </h3>
              <button
                onClick={() => setApprovingOrder(null)}
                className="text-stone-400 hover:text-stone-700"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 font-medium">
              Al confirmar: se descontará el stock de las tallas exactas de cada prenda y se sumará el dinero a la Caja Chica.
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">
                  Método de Pago Utilizado:
                </label>
                <select
                  value={approvalPaymentMethod}
                  onChange={(e) => setApprovalPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full font-bold p-2.5 rounded-xl border border-stone-300"
                >
                  <option value="Efectivo">Efectivo Físico en Cajón</option>
                  <option value="QR">QR Simple / Transferencia Banco</option>
                  <option value="Mixto">Mixto (50% Efectivo / 50% QR)</option>
                  <option value="Crédito/Fiado">Crédito / Con Saldo Pendiente</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">
                  Monto Recibido ({currency}):
                </label>
                <input
                  type="number"
                  value={approvalAmountPaid}
                  onChange={(e) => setApprovalAmountPaid(Number(e.target.value))}
                  className="w-full font-black text-sm p-2.5 rounded-xl border border-stone-300"
                />
                {approvalAmountPaid < approvingOrder.totalAmount && (
                  <span className="text-[11px] text-amber-700 font-bold block mt-1">
                    ⚠️ Quedará un saldo pendiente de {currency} {approvingOrder.totalAmount - approvalAmountPaid} en Cuentas por Cobrar.
                  </span>
                )}
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">
                  Nota / Guía de Flota (Opcional):
                </label>
                <input
                  type="text"
                  placeholder="Ej: Guía #9482 Trans Copacabana"
                  value={approvalNotes}
                  onChange={(e) => setApprovalNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300"
                />
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                onClick={() => setApprovingOrder(null)}
                className="flex-1 py-2.5 rounded-xl font-bold text-xs border border-stone-200 text-stone-600 hover:bg-stone-50"
              >
                Volver
              </button>
              <button
                onClick={handleConfirmApproval}
                className="flex-1 py-2.5 rounded-xl font-black text-xs uppercase text-white shadow"
                style={{ backgroundColor: settings.primaryColor }}
              >
                Confirmar y Descontar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: COLLECT PENDING BALANCE */}
      {collectingSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <h3 className="font-extrabold text-stone-900 text-base">
              Cobrar Saldo de Venta #{collectingSale.id}
            </h3>
            <p className="text-xs text-stone-600">
              Cliente: <strong>{collectingSale.customerName}</strong>
              <br />
              Saldo Pendiente Actual: <strong className="text-red-600">{currency} {collectingSale.pendingBalance}</strong>
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">
                  Monto a Cobrar ({currency}):
                </label>
                <input
                  type="number"
                  max={collectingSale.pendingBalance}
                  value={collectAmount}
                  onChange={(e) => setCollectAmount(Number(e.target.value))}
                  className="w-full font-black text-sm p-2.5 rounded-xl border border-stone-300"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">
                  Medio de Cobro:
                </label>
                <select
                  value={collectMethod}
                  onChange={(e) => setCollectMethod(e.target.value as 'Efectivo' | 'QR')}
                  className="w-full font-bold p-2.5 rounded-xl border border-stone-300"
                >
                  <option value="Efectivo">Efectivo Físico</option>
                  <option value="QR">QR Simple / Banco</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setCollectingSale(null)}
                className="flex-1 py-2 rounded-xl text-xs font-bold text-stone-600 border border-stone-200"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  collectPendingBalance(collectingSale.id, collectAmount, collectMethod);
                  setCollectingSale(null);
                }}
                className="flex-1 py-2 rounded-xl text-xs font-black uppercase text-white shadow bg-emerald-700"
              >
                Guardar Cobro
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
