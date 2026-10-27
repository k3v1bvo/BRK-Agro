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
  Building2
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
  const currency = settings.currency || 'Bs.';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200">
        
        {/* Header */}
        <div 
          className="p-5 text-white flex items-center justify-between"
          style={{ backgroundColor: settings.primaryColor }}
        >
          <div className="flex items-center gap-2.5">
            <Send className="w-5 h-5 text-emerald-300" />
            <div>
              <h3 className="font-extrabold text-base text-white">Despacho y Pedido por WhatsApp</h3>
              <p className="text-xs text-stone-200">Atención directa con nuestro asesor de ventas</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submittedOrderCode ? (
          // Success State
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h3 className="text-xl font-black text-stone-900">
              ¡Pedido Registrado con Éxito!
            </h3>

            <div className="p-3 bg-stone-100 rounded-xl inline-block border border-stone-300">
              <span className="text-xs text-stone-500 block uppercase font-bold">Código de Pedido:</span>
              <span className="text-xl font-black text-emerald-800">#{submittedOrderCode}</span>
            </div>

            <p className="text-xs text-stone-600 max-w-sm mx-auto leading-relaxed">
              Se ha abierto una conversación en WhatsApp con el detalle completo de tus prendas. Tu pedido ya figura en nuestra bandeja de despacho del ERP.
            </p>

            <div className="pt-4">
              <button
                onClick={handleFinish}
                className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white shadow"
                style={{ backgroundColor: settings.primaryColor }}
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
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-stone-400" />
                Nombre Completo o Empresa / Hacienda *
              </label>
              <input
                type="text"
                required
                placeholder="Ej: Ing. Carlos Méndez / Cabaña Santa Bárbara"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            {/* Customer Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-stone-400" />
                  Celular WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Ej: 77392810"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              {/* City / Province */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-stone-400" />
                  Ciudad / Provincia *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Montero, Santa Cruz, Beni, Tarija"
                  value={customerCity}
                  onChange={(e) => setCustomerCity(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>
            </div>

            {/* Delivery Method */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-stone-400" />
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
                        ? 'bg-stone-900 text-amber-400 border-stone-900 shadow ring-2 ring-amber-400/40'
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
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-stone-400" />
                  Empresa de Transporte / Flota de tu preferencia
                </label>
                <input
                  type="text"
                  placeholder="Ej: Flota Trans Copacabana, Expreso Tarija, 23 de Marzo"
                  value={transportCompany}
                  onChange={(e) => setTransportCompany(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1">
                {deliveryMethod === 'Recojo en Tienda' 
                  ? 'Observación / Quién recoge:' 
                  : 'Dirección o Punto de Encomienda (Terminal/Agencia):'}
              </label>
              <input
                type="text"
                placeholder={
                  deliveryMethod === 'Recojo en Tienda'
                    ? 'Ej: Pasa a recoger Rodrigo por la tarde'
                    : 'Ej: Terminal Bimodal boletería #12 o Barrio Equipetrol Calle 4'
                }
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1">
                Nota adicional / Facturación (Opcional):
              </label>
              <textarea
                rows={2}
                placeholder="Ej: Factura a nombre de Cabaña Santa Bárbara NIT 102938472"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            {/* Summary & Guarantee */}
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between text-xs">
              <span className="font-bold text-stone-700">Total a Pagar en WhatsApp:</span>
              <span className="text-base font-black text-stone-900">
                {currency} {cartTotal.toLocaleString()}
              </span>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-2xl font-black text-xs uppercase tracking-wider text-white shadow-xl flex items-center justify-center gap-2 hover:opacity-95 active:scale-95 transition"
                style={{ backgroundColor: settings.primaryColor }}
              >
                <Send className="w-4 h-4 text-emerald-300" />
                <span>Confirmar y Enviar Pedido a WhatsApp</span>
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 text-[11px] text-stone-500 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Garantía de horma y 1er cambio de talla gratuito</span>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
