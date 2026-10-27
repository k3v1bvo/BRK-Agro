import React, { useState } from 'react';
import { 
  X, 
  ShoppingBag, 
  SunMedium, 
  ShieldCheck, 
  Truck, 
  Check, 
  AlertTriangle,
  Ruler,
  Edit3
} from 'lucide-react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onOpenSizeGuide: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ 
  product, 
  onClose,
  onOpenSizeGuide 
}) => {
  const { settings, addToCart } = useStore();
  const currency = settings.currency || 'Bs.';

  if (!product) return null;

  const availableVariant = product.variants.find((v) => v.stock > 0) || product.variants[0];
  const [selectedSize, setSelectedSize] = useState<string>(availableVariant ? availableVariant.size : '');
  const [quantity, setQuantity] = useState<number>(1);
  const [isCustomizing, setIsCustomizing] = useState<boolean>(false);
  const [customText, setCustomText] = useState<string>('');
  const [isAdded, setIsAdded] = useState<boolean>(false);

  const currentVariant = product.variants.find((v) => v.size === selectedSize);
  const currentStock = currentVariant ? currentVariant.stock : 0;
  const isOutOfStock = currentStock <= 0;

  // Wholesale calculation
  const isWholesaleApplicable = quantity >= (product.wholesaleMinQty || 3);
  const unitPrice = isWholesaleApplicable ? product.wholesalePrice : product.salePrice;
  const customizationFee = isCustomizing && product.allowCustomization ? product.customizationPrice : 0;
  const totalItemPrice = (unitPrice + customizationFee) * quantity;

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    addToCart(
      product,
      selectedSize,
      quantity,
      isCustomizing && customText.trim() ? customText.trim() : undefined
    );

    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-stone-900/60 hover:bg-stone-900 text-white transition backdrop-blur-md shadow"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Left: Product Image */}
          <div className="relative bg-stone-100 min-h-[320px] md:min-h-full">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.badges.map((b, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full text-xs font-black bg-stone-900/85 text-amber-300 border border-amber-400/30 shadow backdrop-blur-md uppercase"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Details & Purchase Config */}
          <div className="p-6 md:p-8 flex flex-col justify-between">
            <div>
              {/* Category & Gender */}
              <div className="flex items-center gap-2 text-xs font-bold text-stone-600 uppercase tracking-wider mb-2">
                <span>{product.category}</span>
                <span>•</span>
                <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                  {product.gender}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-xl md:text-2xl font-black text-stone-900 leading-tight">
                {product.name}
              </h2>

              {/* Price display */}
              <div className="mt-3 flex items-baseline gap-3">
                <span className="text-2xl md:text-3xl font-black text-stone-900">
                  {currency} {unitPrice}
                </span>
                {isWholesaleApplicable ? (
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    ¡Precio Mayorista Aplicado!
                  </span>
                ) : product.wholesalePrice > 0 ? (
                  <span className="text-xs font-semibold text-stone-500">
                    Mayorista: {currency} {product.wholesalePrice} (desde {product.wholesaleMinQty} u.)
                  </span>
                ) : null}
              </div>

              {/* Description */}
              <p className="mt-3 text-xs md:text-sm text-stone-600 leading-relaxed">
                {product.description}
              </p>

              {/* Size Selection */}
              <div className="mt-5 pt-4 border-t border-stone-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-extrabold text-stone-900 uppercase tracking-wide">
                    Selecciona tu Talla:
                  </span>
                  <button
                    onClick={onOpenSizeGuide}
                    className="flex items-center gap-1 text-xs text-amber-700 hover:text-amber-800 font-bold underline"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    ¿Cuál es mi talla?
                  </button>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {product.variants.map((v) => {
                    const isSelected = selectedSize === v.size;
                    const isZero = v.stock === 0;
                    return (
                      <button
                        key={v.size}
                        disabled={isZero}
                        onClick={() => setSelectedSize(v.size)}
                        className={`py-2 px-1 text-xs font-bold rounded-xl border text-center transition ${
                          isZero
                            ? 'bg-stone-100 text-stone-400 line-through cursor-not-allowed opacity-50'
                            : isSelected
                            ? 'bg-stone-900 text-amber-400 border-stone-900 shadow-md ring-2 ring-amber-400/40'
                            : 'bg-white text-stone-700 border-stone-300 hover:border-stone-500'
                        }`}
                      >
                        <div>{v.size}</div>
                        <div className="text-[9px] font-normal opacity-80">
                          {isZero ? 'Agotado' : `${v.stock} disp.`}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Embroidery & Customization */}
              {product.allowCustomization && (
                <div className="mt-4 p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-stone-800">
                    <input
                      type="checkbox"
                      checked={isCustomizing}
                      onChange={(e) => setIsCustomizing(e.target.checked)}
                      className="rounded text-emerald-700 focus:ring-emerald-700 w-4 h-4"
                    />
                    <span className="flex items-center gap-1">
                      <Edit3 className="w-3.5 h-3.5 text-amber-600" />
                      Bordado Personalizado de Nombre / Marca Ganadera (+{currency} {product.customizationPrice})
                    </span>
                  </label>

                  {isCustomizing && (
                    <div className="mt-2.5">
                      <input
                        type="text"
                        placeholder="Ej: Ing. Jorge Aguilera • Cabaña San Juan"
                        value={customText}
                        onChange={(e) => setCustomText(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Quantity selector */}
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs font-extrabold text-stone-900 uppercase tracking-wide">
                  Cantidad:
                </span>
                <div className="flex items-center border border-stone-300 rounded-xl overflow-hidden bg-stone-50">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 text-stone-700 hover:bg-stone-200 font-bold text-sm"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 font-bold text-sm text-stone-900 bg-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(currentStock || 1, quantity + 1))}
                    className="px-3 py-1.5 text-stone-700 hover:bg-stone-200 font-bold text-sm"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-6 pt-4 border-t border-stone-200">
              <div className="flex items-center justify-between mb-3 text-sm">
                <span className="text-stone-500 font-semibold">Subtotal:</span>
                <span className="text-xl font-black text-stone-900">
                  {currency} {totalItemPrice.toLocaleString()}
                </span>
              </div>

              <button
                disabled={isOutOfStock}
                onClick={handleAddToCart}
                className={`w-full py-3 px-6 rounded-xl font-bold text-xs uppercase tracking-wider text-white shadow-lg flex items-center justify-center gap-2 transition active:scale-95 ${
                  isOutOfStock
                    ? 'bg-stone-300 text-stone-500 cursor-not-allowed shadow-none'
                    : isAdded
                    ? 'bg-emerald-600'
                    : 'hover:opacity-95'
                }`}
                style={{
                  backgroundColor: !isOutOfStock && !isAdded ? settings.primaryColor : undefined,
                }}
              >
                {isOutOfStock ? (
                  <span>Talla Agotada</span>
                ) : isAdded ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>¡Agregado al Carrito!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    <span>Agregar al Carrito • {currency} {totalItemPrice}</span>
                  </>
                )}
              </button>

              <div className="mt-3 flex items-center justify-center gap-4 text-[11px] text-stone-500 font-medium">
                <span className="flex items-center gap-1">
                  <SunMedium className="w-3.5 h-3.5 text-amber-500" /> UV50+ Certificado
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> 1er Cambio Gratis
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
