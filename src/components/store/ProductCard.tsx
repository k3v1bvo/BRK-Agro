import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { ShoppingBag, AlertTriangle, Check, Edit3, Eye, Sparkles } from 'lucide-react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelectProduct }) => {
  const { settings, addToCart } = useStore();
  const currency = settings.currency || 'Bs.';

  // Default to first available size with stock > 0, or first variant
  const availableVariant = product.variants.find((v) => v.stock > 0) || product.variants[0];
  const [selectedSize, setSelectedSize] = useState<string>(availableVariant ? availableVariant.size : '');
  const [isCustomizing, setIsCustomizing] = useState<boolean>(false);
  const [customText, setCustomText] = useState<string>('');
  const [addedEffect, setAddedEffect] = useState<boolean>(false);

  const currentVariant = product.variants.find((v) => v.size === selectedSize);
  const currentStock = currentVariant ? currentVariant.stock : 0;
  const isOutOfStock = currentStock <= 0;
  const isLowStock = currentStock > 0 && currentStock <= 3;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;

    addToCart(
      product, 
      selectedSize, 
      1, 
      isCustomizing && customText.trim() ? customText.trim() : undefined
    );

    try {
      confetti({
        particleCount: 35,
        spread: 55,
        origin: { y: 0.8 },
        colors: ['#D97706', '#0B4F26', '#F59E0B']
      });
    } catch {}

    setAddedEffect(true);
    setTimeout(() => setAddedEffect(false), 1500);
  };

  return (
    <div 
      onClick={() => onSelectProduct(product)}
      className="group bg-white rounded-3xl overflow-hidden border border-stone-200/90 shadow-sm hover:shadow-2xl hover:border-amber-400/80 hover-lift transition-all duration-300 flex flex-col cursor-pointer relative"
    >
      {/* Image Container with Badges */}
      <div className="relative aspect-[4/3] sm:aspect-square overflow-hidden bg-stone-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.badges.map((badge, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 rounded-full text-[10px] font-black shadow-md uppercase tracking-wider backdrop-blur-md bg-stone-950/85 text-amber-300 border border-amber-400/40"
            >
              {badge}
            </span>
          ))}
        </div>

        {/* Quick View Button on Hover */}
        <div className="absolute inset-0 bg-stone-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="px-4 py-2 rounded-xl bg-stone-900/90 text-white text-xs font-bold shadow-lg backdrop-blur-sm flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            <span>Ver Detalle y Horma</span>
          </span>
        </div>

        {/* Wholesale Ribbon */}
        {product.wholesalePrice > 0 && (
          <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-emerald-950/90 backdrop-blur-md text-emerald-300 text-[11px] font-bold px-3 py-1.5 rounded-xl flex items-center justify-between border border-emerald-500/40 shadow-lg">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Mayorista ({product.wholesaleMinQty}+ u.):</span>
            </span>
            <span className="text-amber-400 font-black text-xs">{currency} {product.wholesalePrice}</span>
          </div>
        )}
      </div>

      {/* Product Information */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Gender */}
          <div className="flex items-center justify-between text-[11px] font-extrabold text-stone-500 uppercase tracking-wider mb-1.5">
            <span>{product.category}</span>
            <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded font-black">
              {product.gender}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-extrabold text-stone-900 text-sm sm:text-base leading-snug group-hover:text-amber-700 transition-colors line-clamp-2 font-heading">
            {product.name}
          </h3>

          {/* Pricing */}
          <div className="mt-3 flex items-baseline gap-2.5">
            <span className="text-2xl font-black text-stone-900 font-heading">
              {currency} {product.salePrice}
            </span>
            {product.wholesalePrice > 0 && (
              <span className="text-xs text-stone-400 line-through font-semibold">
                {currency} {Math.round(product.salePrice * 1.15)}
              </span>
            )}
          </div>

          {/* Live Size Selector */}
          <div className="mt-4 pt-3 border-t border-stone-100" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-extrabold text-stone-800">Talla:</span>
              {isLowStock && (
                <span className="text-[11px] font-black text-amber-600 flex items-center gap-1 animate-pulse">
                  <AlertTriangle className="w-3 h-3" />
                  ¡Solo quedan {currentStock} en {selectedSize}!
                </span>
              )}
              {isOutOfStock && (
                <span className="text-[11px] font-black text-red-600">
                  Agotado
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5">
              {product.variants.map((variant) => {
                const isSelected = selectedSize === variant.size;
                const isStockZero = variant.stock === 0;
                const isLow = variant.stock > 0 && variant.stock <= 3;

                return (
                  <button
                    key={variant.size}
                    type="button"
                    disabled={isStockZero}
                    onClick={() => setSelectedSize(variant.size)}
                    className={`px-2.5 py-1 text-xs font-bold rounded-xl border transition-all relative ${
                      isStockZero
                        ? 'bg-stone-100 text-stone-400 border-stone-200 line-through cursor-not-allowed opacity-60'
                        : isSelected
                        ? 'bg-stone-950 text-amber-400 border-stone-950 shadow-md ring-2 ring-amber-400/50'
                        : isLow
                        ? 'bg-amber-50 text-stone-900 border-amber-300 hover:bg-amber-100'
                        : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    {variant.size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Embroidery Option */}
          {product.allowCustomization && (
            <div className="mt-3 pt-3 border-t border-stone-100" onClick={(e) => e.stopPropagation()}>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-stone-800 hover:text-stone-950">
                <input
                  type="checkbox"
                  checked={isCustomizing}
                  onChange={(e) => setIsCustomizing(e.target.checked)}
                  className="rounded text-emerald-700 focus:ring-emerald-700 w-3.5 h-3.5"
                />
                <span className="flex items-center gap-1">
                  <Edit3 className="w-3.5 h-3.5 text-amber-600" />
                  Personalizar Bordado (+{currency} {product.customizationPrice})
                </span>
              </label>

              {isCustomizing && (
                <div className="mt-2">
                  <input
                    type="text"
                    placeholder="Ej: Ing. Jorge Aguilera / Cabaña El Refugio"
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    className="w-full text-xs p-2 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Add to Cart Button */}
        <div className="mt-5 pt-3 border-t border-stone-100">
          <button
            type="button"
            disabled={isOutOfStock}
            onClick={handleAddToCart}
            className={`w-full py-3 px-4 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md btn-tactile transition-all duration-200 ${
              isOutOfStock
                ? 'bg-stone-200 text-stone-400 cursor-not-allowed shadow-none'
                : addedEffect
                ? 'bg-emerald-600 text-white'
                : 'text-white hover:opacity-95'
            }`}
            style={{
              backgroundColor: !isOutOfStock && !addedEffect ? settings.primaryColor : undefined,
            }}
          >
            {isOutOfStock ? (
              <span>Talla Agotada</span>
            ) : addedEffect ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>¡Agregado al Carrito!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>Agregar al Carrito</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
