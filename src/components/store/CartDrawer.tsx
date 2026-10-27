import React from 'react';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  Plus, 
  Minus,
  CheckCircle2,
  Zap
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface CartDrawerProps {
  onOpenCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onOpenCheckout }) => {
  const { 
    settings, 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    removeFromCart, 
    updateCartQuantity, 
    cartTotal, 
    cartSavings 
  } = useStore();

  const isBrasilTheme = (settings.designTheme || 'brasil_heavy_duty') === 'brasil_heavy_duty';
  const currency = isBrasilTheme ? 'Bs.' : (settings.currency || 'Bs.');

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div 
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className={`w-screen max-w-md shadow-2xl flex flex-col transition-colors duration-300 ${
          isBrasilTheme 
            ? 'bg-[#0e1110] text-stone-100 border-l border-stone-800' 
            : 'bg-white text-stone-900 border-l border-stone-200'
        }`}>
          
          {/* Header */}
          <div className={`p-5 flex items-center justify-between shadow-md border-b ${
            isBrasilTheme 
              ? 'bg-[#121614] border-stone-800 text-white' 
              : 'text-white border-transparent'
          }`}
          style={!isBrasilTheme ? { backgroundColor: settings.primaryColor } : undefined}
          >
            <div className="flex items-center gap-2.5">
              <div className={`p-2 rounded-xl ${isBrasilTheme ? 'bg-yellow-400/20 text-yellow-400' : 'bg-white/20 text-amber-300'}`}>
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base leading-none font-heading flex items-center gap-1.5">
                  <span>Tu Carrito de Compra</span>
                  {isBrasilTheme && <span className="text-[10px] text-yellow-400 font-mono">BRK</span>}
                </h3>
                <p className={`text-xs mt-1 font-medium ${isBrasilTheme ? 'text-stone-400' : 'text-stone-200'}`}>
                  {cart.length === 0 ? 'Sin prendas aún' : `${cart.length} prenda(s) seleccionadas`}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full text-stone-400 hover:text-white hover:bg-stone-800/80 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Wholesale Savings Banner */}
          {cartSavings > 0 && (
            <div className={`p-3 px-5 flex items-center justify-between text-xs font-bold border-b ${
              isBrasilTheme 
                ? 'bg-emerald-950/60 border-emerald-500/30 text-emerald-300' 
                : 'bg-emerald-50 border-emerald-200 text-emerald-800'
            }`}>
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                ¡Descuento Mayorista Activado!
              </span>
              <span className={`px-2 py-0.5 rounded text-[11px] font-black ${
                isBrasilTheme ? 'bg-emerald-500/30 text-emerald-300' : 'bg-emerald-200 text-emerald-900'
              }`}>
                Ahorras {currency} {cartSavings.toLocaleString()}
              </span>
            </div>
          )}

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-400">
                <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-4 text-3xl shadow-lg border ${
                  isBrasilTheme ? 'bg-stone-900 border-stone-800' : 'bg-stone-100 border-stone-200'
                }`}>
                  🌾
                </div>
                <h4 className="font-bold text-white text-base mb-1 font-heading">Tu carrito está vacío</h4>
                <p className="text-xs text-stone-400 max-w-xs mb-6 leading-relaxed">
                  Explora nuestras camisas UV50+, botinas de cuero legítimo y accesorios diseñados para resistir la faena diaria.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className={`px-6 py-3 rounded-xl font-black text-xs uppercase tracking-wider shadow-lg transition active:scale-95 ${
                    isBrasilTheme 
                      ? 'bg-[#FFE600] text-black hover:bg-yellow-400' 
                      : 'text-white hover:opacity-95'
                  }`}
                  style={!isBrasilTheme ? { backgroundColor: settings.primaryColor } : undefined}
                >
                  Ver Catálogo de Campo
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-2xl flex gap-3.5 relative group transition ${
                    isBrasilTheme 
                      ? 'bg-[#141916] border border-stone-800 hover:border-yellow-400/60' 
                      : 'bg-stone-50 border border-stone-200 hover:border-amber-400/60'
                  }`}
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-18 h-18 sm:w-20 sm:h-20 object-cover rounded-xl shrink-0 bg-stone-900 border border-stone-800"
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-extrabold text-white text-xs sm:text-sm leading-snug line-clamp-2">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-stone-400 hover:text-red-500 p-1 transition"
                          title="Eliminar prenda"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] font-bold">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                          isBrasilTheme ? 'bg-stone-800 text-yellow-400' : 'bg-stone-200 text-stone-800'
                        }`}>
                          Talla: {item.selectedSize}
                        </span>
                        {item.isWholesaleApplied && (
                          <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] border border-emerald-500/30">
                            Mayorista
                          </span>
                        )}
                      </div>

                      {item.customText && (
                        <div className="mt-1 text-[11px] text-amber-400 font-semibold italic">
                          ✍️ Bordado: "{item.customText}"
                        </div>
                      )}
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      {/* Quantity controls */}
                      <div className={`flex items-center border rounded-lg overflow-hidden ${
                        isBrasilTheme 
                          ? 'border-stone-700 bg-stone-900 text-white' 
                          : 'border-stone-300 bg-white text-stone-900'
                      }`}>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="p-1 px-2 hover:bg-stone-800 transition"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-black">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="p-1 px-2 hover:bg-stone-800 transition"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Item Total */}
                      <div className="text-right">
                        <span className="text-[10px] text-stone-400 block font-bold">
                          {item.quantity}x {currency} {item.unitPrice}
                        </span>
                        <span className={`font-black text-sm font-heading ${
                          isBrasilTheme ? 'text-yellow-400' : 'text-stone-900'
                        }`}>
                          {currency} {(item.unitPrice * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Call-to-action */}
          {cart.length > 0 && (
            <div className={`p-5 border-t ${
              isBrasilTheme 
                ? 'bg-[#121614] border-stone-800' 
                : 'bg-stone-50 border-stone-200'
            }`}>
              
              <div className="space-y-1.5 mb-4 text-xs font-bold">
                <div className="flex justify-between text-stone-400">
                  <span>Subtotal prendas:</span>
                  <span className="text-white font-extrabold">
                    {currency} {(cartTotal + cartSavings).toLocaleString()}
                  </span>
                </div>
                {cartSavings > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Ahorro por mayor:</span>
                    <span>- {currency} {cartSavings.toLocaleString()}</span>
                  </div>
                )}
                <div className={`flex justify-between text-base font-black pt-2 border-t ${
                  isBrasilTheme ? 'border-stone-800 text-white' : 'border-stone-200 text-stone-900'
                }`}>
                  <span>Total estimado:</span>
                  <span className={`text-xl font-heading ${
                    isBrasilTheme ? 'text-yellow-400' : 'text-stone-900'
                  }`}>
                    {currency} {cartTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsCartOpen(false);
                  onOpenCheckout();
                }}
                className={`w-full py-4 px-6 rounded-2xl font-black text-xs uppercase tracking-wider shadow-2xl flex items-center justify-center gap-2 active:scale-95 transition-all ${
                  isBrasilTheme 
                    ? 'bg-[#FFE600] text-black hover:bg-yellow-400 shadow-yellow-400/20' 
                    : 'text-white hover:opacity-95 shadow-md'
                }`}
                style={!isBrasilTheme ? { backgroundColor: settings.primaryColor } : undefined}
              >
                <span>Finalizar Pedido por WhatsApp</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="mt-3 flex items-center justify-center gap-3 text-[11px] text-stone-400 font-medium">
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-stone-500" /> Envíos directos a todo el país
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-stone-500" /> 1er Cambio Gratis
                </span>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
