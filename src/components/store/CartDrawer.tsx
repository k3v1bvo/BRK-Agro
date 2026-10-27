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
  Minus
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

  const currency = settings.currency || 'Bs.';

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Header */}
          <div 
            className="p-5 text-white flex items-center justify-between shadow-md"
            style={{ backgroundColor: settings.primaryColor }}
          >
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-amber-300" />
              <div>
                <h3 className="font-extrabold text-base text-white">Tu Carrito de Compra</h3>
                <p className="text-xs text-stone-200">
                  {cart.length === 0 ? 'Vacío' : `${cart.length} prenda(s) seleccionadas`}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Wholesale Savings Banner */}
          {cartSavings > 0 && (
            <div className="bg-emerald-50 border-b border-emerald-200 p-3 px-5 flex items-center justify-between text-xs">
              <span className="font-bold text-emerald-800 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                ¡Descuento Mayorista Activado!
              </span>
              <span className="font-black text-emerald-900 bg-emerald-200/80 px-2 py-0.5 rounded">
                Ahorras {currency} {cartSavings.toLocaleString()}
              </span>
            </div>
          )}

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-400">
                <div className="w-20 h-20 rounded-full bg-stone-100 flex items-center justify-center mb-4 text-3xl">
                  🌾
                </div>
                <h4 className="font-bold text-stone-700 text-base mb-1">Tu carrito está vacío</h4>
                <p className="text-xs text-stone-500 max-w-xs mb-6">
                  Explora nuestras camisas UV50+, botinas de cuero legítimo y accesorios listos para el trabajo de campo.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white shadow"
                  style={{ backgroundColor: settings.primaryColor }}
                >
                  Ver Catálogo
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex gap-3.5 relative group hover:border-amber-400/60 transition"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-18 h-18 sm:w-20 sm:h-20 object-cover rounded-xl shrink-0 bg-stone-200"
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-extrabold text-stone-900 text-xs sm:text-sm leading-snug line-clamp-2">
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
                        <span className="px-2 py-0.5 rounded bg-stone-200 text-stone-800">
                          Talla: {item.selectedSize}
                        </span>
                        {item.isWholesaleApplied && (
                          <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px]">
                            Mayorista
                          </span>
                        )}
                      </div>

                      {item.customText && (
                        <div className="mt-1 text-[11px] text-amber-800 font-semibold italic">
                          ✍️ Bordado: "{item.customText}"
                        </div>
                      )}
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      {/* Quantity controls */}
                      <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden bg-white">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="p-1 px-2 text-stone-600 hover:bg-stone-100 transition"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-stone-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="p-1 px-2 text-stone-600 hover:bg-stone-100 transition"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Item Total */}
                      <div className="text-right">
                        <span className="text-xs text-stone-500 block">
                          {item.quantity}x {currency} {item.unitPrice}
                        </span>
                        <span className="font-black text-sm text-stone-900">
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
            <div className="p-5 border-t border-stone-200 bg-stone-50">
              
              <div className="space-y-1.5 mb-4 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal prendas:</span>
                  <span className="font-bold">
                    {currency} {(cartTotal + cartSavings).toLocaleString()}
                  </span>
                </div>
                {cartSavings > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Ahorro por mayor:</span>
                    <span>- {currency} {cartSavings.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-900 text-base font-black pt-2 border-t border-stone-200">
                  <span>Total estimado:</span>
                  <span className="text-xl">
                    {currency} {cartTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsCartOpen(false);
                  onOpenCheckout();
                }}
                className="w-full py-3.5 px-6 rounded-2xl font-black text-xs uppercase tracking-wider text-white shadow-xl flex items-center justify-center gap-2 hover:opacity-95 active:scale-95 transition"
                style={{ backgroundColor: settings.primaryColor }}
              >
                <span>Finalizar Pedido por WhatsApp</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="mt-3 flex items-center justify-center gap-3 text-[11px] text-stone-500">
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-stone-400" /> Envíos a todo el país
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-stone-400" /> 1er Cambio Gratis
                </span>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
