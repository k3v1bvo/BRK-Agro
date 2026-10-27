import React, { useState } from 'react';
import { 
  X, 
  Send, 
  Truck, 
  MapPin, 
  Phone, 
  User, 
  ShieldCheck, 
  CheckCircle2,
  Building2,
  Zap,
  ShoppingBag
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { DeliveryMethod } from '../../types';

interface WhatsAppCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WhatsAppCheckoutModal: React.FC<WhatsAppCheckoutModalProps> = ({ 
  isOpen, 
  onClose 
}) => {
  const { settings, cart, cartTotal, createWhatsAppOrder } = useStore();
  const isBrasilTheme = (settings.designTheme || 'brasil_heavy_duty') === 'brasil_heavy_duty';
  const currency = isBrasilTheme ? 'Bs.' : (settings.currency || 'Bs.');

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerCity, setCustomerCity] = useState('Santa Cruz');
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('Encomienda Provincia');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [transportCompany, setTransportCompany] = useState('Flota Trans Copacabana');
  const [notes, setNotes] = useState('');
  const [submittedOrderCode, setSubmittedOrderCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      alert('Por favor ingresa tu Nombre y Teléfono para poder coordinar el despacho.');
      return;
    }

    // Build order items
    const orderItems = cart.map((item) => ({
      productId: item.product.id,
      productName: item.product.name,
      size: item.selectedSize,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      costPrice: item.product.costPrice,
      customText: item.customText,
      subtotal: item.unitPrice * item.quantity,
    }));

    const totalCost = cart.reduce(
      (sum, item) => sum + item.product.costPrice * item.quantity, 
      0
    );

    const newOrder = createWhatsAppOrder({
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerCity: customerCity.trim(),
      deliveryMethod,
      deliveryAddress: deliveryAddress.trim(),
      transportCompany: deliveryMethod === 'Encomienda Provincia' ? transportCompany.trim() : undefined,
      items: orderItems,
      totalAmount: cartTotal,
      totalCost,
      notes: notes.trim() || undefined,
    });

    setSubmittedOrderCode(newOrder.id);
  };

  const handleFinish = () => {
    setSubmittedOrderCode(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className={`rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border transition-colors duration-300 ${
        isBrasilTheme 
          ? 'bg-[#0e1110] text-stone-100 border-stone-800' 
          : 'bg-white text-stone-900 border-stone-200'
      }`}>
        
        {/* Header */}
        <div className={`p-5 flex items-center justify-between border-b ${
          isBrasilTheme 
            ? 'bg-[#121614] border-stone-800 text-white' 
            : 'text-white border-transparent'
        }`}
        style={!isBrasilTheme ? { backgroundColor: settings.primaryColor } : undefined}
        >
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl ${isBrasilTheme ? 'bg-yellow-400/20 text-yellow-400' : 'bg-white/20 text-emerald-300'}`}>
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base leading-none font-heading flex items-center gap-1.5">
                <span>Despacho y Pedido por WhatsApp</span>
                {isBrasilTheme && <span className="text-[10px] text-yellow-400 font-mono">BRK</span>}
              </h3>
              <p className={`text-xs mt-1 font-medium ${isBrasilTheme ? 'text-stone-400' : 'text-stone-200'}`}>
                Atención directa con nuestro asesor comercial de campo
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-stone-800/80 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submittedOrderCode ? (
          // Success State
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-inner border border-emerald-500/30">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h3 className="text-xl font-black text-white font-heading">
              ¡Pedido Registrado con Éxito!
            </h3>

            <div className={`p-3.5 rounded-2xl inline-block border ${
              isBrasilTheme ? 'bg-stone-900 border-stone-800 text-white' : 'bg-stone-100 border-stone-300 text-stone-900'
            }`}>
              <span className="text-xs text-stone-400 block uppercase font-bold tracking-wider">Código de Pedido:</span>
              <span className={`text-xl font-black font-mono ${isBrasilTheme ? 'text-yellow-400' : 'text-emerald-800'}`}>
                #{submittedOrderCode}
              </span>
            </div>

            <p className="text-xs text-stone-400 max-w-sm mx-auto leading-relaxed">
              Se ha abierto una conversación en WhatsApp con el detalle completo de tus prendas. Tu pedido ya figura en nuestra bandeja de despacho del ERP.
            </p>

            <div className="pt-4">
              <button
                onClick={handleFinish}
                className={`w-full py-3.5 rounded-xl font-black text-xs uppercase tracking-wider shadow-lg transition active:scale-95 ${
                  isBrasilTheme 
                    ? 'bg-[#FFE600] text-black hover:bg-yellow-400' 
                    : 'text-white hover:opacity-95'
                }`}
                style={!isBrasilTheme ? { backgroundColor: settings.primaryColor } : undefined}
              >
                Volver a la Tienda
              </button>
            </div>
          </div>
        ) : (
          // Form State
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            
            {/* Customer Name */}
            <div>
              <label className="block text-xs font-bold text-stone-300 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-stone-500" />
                Nombre Completo o Empresa / Hacienda *
              </label>
              <input
                type="text"
                required
                placeholder="Ej: Ing. Carlos Méndez / Cabaña Santa Bárbara"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className={`w-full text-xs p-2.5 rounded-xl border focus:outline-none transition ${
                  isBrasilTheme 
                    ? 'bg-stone-900 border-stone-700 text-white placeholder-stone-500 focus:border-yellow-400' 
                    : 'bg-white border-stone-300 text-stone-900 focus:ring-2 focus:ring-emerald-700'
                }`}
              />
            </div>

            {/* Customer Phone & City */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-300 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-stone-500" />
                  Celular WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Ej: 77392810"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className={`w-full text-xs p-2.5 rounded-xl border focus:outline-none transition ${
                    isBrasilTheme 
                      ? 'bg-stone-900 border-stone-700 text-white placeholder-stone-500 focus:border-yellow-400' 
                      : 'bg-white border-stone-300 text-stone-900 focus:ring-2 focus:ring-emerald-700'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-300 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-stone-500" />
                  Ciudad / Provincia *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Montero, Santa Cruz, Beni, Tarija"
                  value={customerCity}
                  onChange={(e) => setCustomerCity(e.target.value)}
                  className={`w-full text-xs p-2.5 rounded-xl border focus:outline-none transition ${
                    isBrasilTheme 
                      ? 'bg-stone-900 border-stone-700 text-white placeholder-stone-500 focus:border-yellow-400' 
                      : 'bg-white border-stone-300 text-stone-900 focus:ring-2 focus:ring-emerald-700'
                  }`}
                />
              </div>
            </div>

            {/* Delivery Method */}
            <div>
              <label className="block text-xs font-bold text-stone-300 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-stone-500" />
                Modalidad de Entrega *
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Encomienda Provincia', 'Delivery', 'Recojo en Tienda'] as DeliveryMethod[]).map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setDeliveryMethod(method)}
                    className={`py-2 px-2 rounded-xl text-[11px] font-bold border text-center transition ${
                      deliveryMethod === method
                        ? isBrasilTheme
                          ? 'bg-[#FFE600] text-black border-[#FFE600] shadow-md font-black'
                          : 'bg-stone-900 text-amber-400 border-stone-900 shadow ring-2 ring-amber-400/40'
                        : isBrasilTheme
                        ? 'bg-stone-900 text-stone-400 border-stone-800 hover:bg-stone-800'
                        : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            {/* Address or Transport Details */}
            {deliveryMethod === 'Encomienda Provincia' && (
              <div>
                <label className="block text-xs font-bold text-stone-300 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-stone-500" />
                  Empresa de Transporte / Flota de Preferencia:
                </label>
                <input
                  type="text"
                  placeholder="Ej: Flota Trans Copacabana / Expreso San Miguel / Flota Bolívar"
                  value={transportCompany}
                  onChange={(e) => setTransportCompany(e.target.value)}
                  className={`w-full text-xs p-2.5 rounded-xl border focus:outline-none transition ${
                    isBrasilTheme 
                      ? 'bg-stone-900 border-stone-700 text-white placeholder-stone-500 focus:border-yellow-400' 
                      : 'bg-white border-stone-300 text-stone-900 focus:ring-2 focus:ring-emerald-700'
                  }`}
                />
              </div>
            )}

            {deliveryMethod === 'Delivery' && (
              <div>
                <label className="block text-xs font-bold text-stone-300 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-stone-500" />
                  Dirección de Entrega en Ciudad:
                </label>
                <input
                  type="text"
                  placeholder="Ej: Av. Cristo Redentor 4to Anillo, Condominio Los Tajibos"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className={`w-full text-xs p-2.5 rounded-xl border focus:outline-none transition ${
                    isBrasilTheme 
                      ? 'bg-stone-900 border-stone-700 text-white placeholder-stone-500 focus:border-yellow-400' 
                      : 'bg-white border-stone-300 text-stone-900 focus:ring-2 focus:ring-emerald-700'
                  }`}
                />
              </div>
            )}

            {/* Order Total Review Bar */}
            <div className={`p-4 rounded-2xl flex items-center justify-between border ${
              isBrasilTheme ? 'bg-[#141916] border-stone-800' : 'bg-stone-50 border-stone-200'
            }`}>
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-stone-300">
                  {cart.length} prenda(s) en pedido
                </span>
              </div>
              <span className={`text-base font-black font-heading ${
                isBrasilTheme ? 'text-yellow-400' : 'text-stone-900'
              }`}>
                Total: {currency} {cartTotal.toLocaleString()}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="w-1/3 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-stone-400 hover:text-white bg-stone-800/80 transition"
              >
                Volver
              </button>

              <button
                type="submit"
                className={`w-2/3 py-3.5 rounded-xl font-black text-xs uppercase tracking-wider shadow-xl flex items-center justify-center gap-2 active:scale-95 transition ${
                  isBrasilTheme 
                    ? 'bg-[#FFE600] text-black hover:bg-yellow-400 shadow-yellow-400/20' 
                    : 'text-white hover:opacity-95'
                }`}
                style={!isBrasilTheme ? { backgroundColor: settings.primaryColor } : undefined}
              >
                <Send className="w-4 h-4" />
                <span>Confirmar por WhatsApp</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
