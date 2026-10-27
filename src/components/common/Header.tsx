import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Ruler, 
  PhoneCall, 
  ShieldCheck, 
  SunMedium, 
  Menu, 
  X,
  Truck,
  Sparkles,
  ArrowRight,
  ChevronDown
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface HeaderProps {
  onSearchChange: (search: string) => void;
  searchTerm: string;
  onOpenSizeGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onSearchChange, 
  searchTerm, 
  onOpenSizeGuide 
}) => {
  const { settings, cartItemsCount, setIsCartOpen, setViewMode } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cleanPhone = (settings.whatsappNumber || '59178541236').replace(/\D/g, '');

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-sm border-b border-stone-200">
      {/* Top Luxury Announcement Bar */}
      <div 
        className="text-white text-xs py-2 px-4 transition-colors"
        style={{ backgroundColor: settings.primaryColor }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-none">
            <span className="font-extrabold flex items-center gap-2 text-amber-300">
              <Truck className="w-4.5 h-4.5 stroke-[2.2]" />
              DESPACHOS DIARIOS:
            </span>
            <span className="text-stone-100 font-medium text-[11px] sm:text-xs">
              {settings.announcementBar}
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-5 text-[11px] font-bold text-stone-200">
            <span className="flex items-center gap-1.5 text-amber-300">
              <SunMedium className="w-4.5 h-4.5 stroke-[2.2]" /> FPU UV50+ Permanente
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-emerald-300">
              <ShieldCheck className="w-4.5 h-4.5 stroke-[2.2]" /> 1er Cambio de Talla Gratuito
            </span>
            <span>•</span>
            <span className="text-amber-400 font-black">
              📦 Mayorista desde 3 prendas
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Brand Logo & Western Identity */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-stone-700 hover:text-stone-900 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <a href="#" className="flex items-center gap-3 group">
              <div 
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-white font-extrabold text-2xl shadow-md transition-transform group-hover:scale-105 border border-white/20"
                style={{ backgroundColor: settings.primaryColor }}
              >
                <span className="text-2xl filter drop-shadow">🌾</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-2xl font-black tracking-tight text-stone-900 font-heading uppercase leading-none">
                  {settings.storeName}
                </span>
                <span className="text-[10px] sm:text-[11px] font-bold tracking-wider text-amber-800 uppercase mt-1 flex items-center gap-1">
                  <span>Equipamiento de Campo & Faena</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block" />
                </span>
              </div>
            </a>
          </div>

          {/* Search Bar with Quick Filter Pills */}
          <div className="flex-1 max-w-lg mx-2 sm:mx-6 hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar camisas UV50+, botinas de cuero legítimo, jeans 14oz..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-stone-100/90 border border-stone-300 rounded-full py-2.5 pl-11 pr-24 text-xs font-semibold text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition"
              />
              <Search className="w-5 h-5 text-stone-400 absolute left-3.5 top-2.5 stroke-[2]" />
              {searchTerm && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-2.5 text-xs text-stone-400 hover:text-stone-600 font-bold"
                >
                  Limpiar
                </button>
              )}
            </div>
          </div>

          {/* Action Buttons (Prominent Icons) */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Size Calculator Modal Trigger */}
            <button
              onClick={onOpenSizeGuide}
              className="group flex items-center gap-2 px-3 py-2 text-xs font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-xl btn-tactile hover-lift transition"
              title="Calculadora y Guía de Tallas Horma BRK"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Ruler className="w-5 h-5 text-amber-600 stroke-[2.2]" />
              </div>
              <span className="hidden sm:inline">Guía de Tallas</span>
            </button>

            {/* Direct WhatsApp Callout */}
            <a
              href={`https://wa.me/${cleanPhone}?text=Hola,%20quisiera%20solicitar%20el%20catálogo%20y%20precios%20mayoristas%20de%20indumentaria%20agropecuaria`}
              target="_blank"
              rel="noreferrer"
              className="hidden xl:flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-xl btn-tactile hover-lift transition shadow-sm group"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <PhoneCall className="w-5 h-5 text-emerald-700 stroke-[2.2]" />
              </div>
              <span>Asesor de Campo</span>
            </a>

            {/* Shopping Cart Button with Glow */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 sm:px-4 sm:py-2 rounded-xl text-white font-extrabold flex items-center gap-2.5 shadow-md btn-tactile hover-lift transition-all hover:opacity-95 group"
              style={{ backgroundColor: settings.primaryColor }}
            >
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                <ShoppingBag className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="hidden sm:inline text-xs uppercase tracking-wide">Mi Carrito</span>
              {cartItemsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-stone-950 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-md animate-bounce">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* Admin ERP Switcher Shortcut */}
            <button
              onClick={() => setViewMode('admin')}
              className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-stone-800 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-sm btn-tactile hover-lift transition group"
              title="Panel Administrativo de Ventas e Inventario"
            >
              <div className="w-8 h-8 rounded-lg bg-black/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <span className="text-base">⚙️</span>
              </div>
              <span className="hidden sm:inline">ERP</span>
            </button>

          </div>

        </div>

        {/* Mobile Search Bar */}
        <div className="pb-3 md:hidden">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar camisas UV50+, botinas, jeans..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-stone-100 border border-stone-300 rounded-xl py-2 pl-10 pr-3 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white font-medium"
            />
            <Search className="w-5 h-5 text-stone-400 absolute left-3 top-2.5 stroke-[2]" />
          </div>
        </div>

        {/* Mobile Menu Dropdown with Large 24px Icons */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-4 pt-1 border-t border-stone-200 animate-modal-pop">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onSearchChange('camisas');
                }}
                className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 border border-stone-200 hover:bg-stone-100 text-left transition"
              >
                <div className="w-11 h-11 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center shrink-0">
                  <SunMedium className="w-6 h-6 text-emerald-700 stroke-[2.2]" />
                </div>
                <div>
                  <div className="text-sm font-bold text-stone-900">Camisas UV50+</div>
                  <div className="text-[11px] text-stone-500">Protección Solar Homologada</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onSearchChange('botina');
                }}
                className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 border border-stone-200 hover:bg-stone-100 text-left transition"
              >
                <div className="w-11 h-11 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6 text-amber-700 stroke-[2.2]" />
                </div>
                <div>
                  <div className="text-sm font-bold text-stone-900">Botinas de Cuero</div>
                  <div className="text-[11px] text-stone-500">Cuero Flor 100% Legítimo</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSizeGuide();
                }}
                className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 border border-stone-200 hover:bg-stone-100 text-left transition"
              >
                <div className="w-11 h-11 rounded-xl bg-yellow-100 border border-yellow-300 flex items-center justify-center shrink-0">
                  <Ruler className="w-6 h-6 text-amber-700 stroke-[2.2]" />
                </div>
                <div>
                  <div className="text-sm font-bold text-stone-900">Guía de Tallas</div>
                  <div className="text-[11px] text-stone-500">Calculadora de Horma BRK</div>
                </div>
              </button>

              <a
                href={`https://wa.me/${cleanPhone}?text=Hola,%20quisiera%20solicitar%20el%20catálogo`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-300 hover:bg-emerald-100 text-left transition"
              >
                <div className="w-11 h-11 rounded-xl bg-emerald-200 border border-emerald-400 flex items-center justify-center shrink-0">
                  <PhoneCall className="w-6 h-6 text-emerald-800 stroke-[2.2]" />
                </div>
                <div>
                  <div className="text-sm font-bold text-emerald-900">Asesor WhatsApp</div>
                  <div className="text-[11px] text-emerald-700">Cotizaciones & Pedidos Mayoristas</div>
                </div>
              </a>
            </div>
          </div>
        )}

      </div>
    </header>
  );
};
