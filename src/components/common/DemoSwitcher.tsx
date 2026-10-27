import React from 'react';
import { Eye, ShieldAlert, Sparkles, Palette } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const DemoSwitcher: React.FC = () => {
  const { viewMode, setViewMode, settings, updateSettings, pendingOrdersCount } = useStore();

  const currentTheme = settings.designTheme || 'brasil_heavy_duty';

  const toggleTheme = () => {
    const nextTheme = currentTheme === 'brasil_heavy_duty' ? 'bolivia_country' : 'brasil_heavy_duty';
    updateSettings({ designTheme: nextTheme });
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 no-print">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-stone-950/95 backdrop-blur-md text-white p-2 sm:px-4 sm:py-2.5 rounded-2xl sm:rounded-full shadow-2xl border border-stone-700/80 hover:border-yellow-400/80 transition-all duration-300">
        
        {/* Toggle Theme / Style */}
        <button
          onClick={toggleTheme}
          className="flex items-center gap-2 px-2 py-1 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs font-bold transition text-left"
          title="Alternar entre el estilo oficial BRK Brasil Heavy-Duty y BRK Bolivia Country"
        >
          <Palette className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
          <span>
            Diseño: <strong className={currentTheme === 'brasil_heavy_duty' ? 'text-yellow-400' : 'text-emerald-400'}>
              {currentTheme === 'brasil_heavy_duty' ? '⚡ BRK Brasil (Dark Industrial)' : '🌾 BRK Bolivia (Country Cuero)'}
            </strong>
          </span>
          <span className="text-[10px] bg-stone-900 px-1.5 py-0.2 rounded border border-stone-600 text-stone-300 ml-1">
            Cambiar ⇋
          </span>
        </button>

        {/* Separator */}
        <div className="hidden sm:block w-px h-5 bg-stone-700" />

        {/* Toggle Store <-> Admin */}
        <button
          onClick={() => setViewMode(viewMode === 'store' ? 'admin' : 'store')}
          className="flex items-center gap-2 text-xs font-bold tracking-wide group"
        >
          <div className="w-6 h-6 rounded-full bg-yellow-400 text-black flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform font-black">
            <Eye className="w-3.5 h-3.5" />
          </div>

          <span className="text-stone-300">
            Vista: <span className="text-white font-extrabold uppercase">{viewMode === 'store' ? '🛍️ Tienda' : '⚙️ ERP Admin'}</span>
          </span>
        </button>

        {/* Pending Orders Pill if in store mode */}
        {pendingOrdersCount > 0 && viewMode === 'store' && (
          <button 
            onClick={() => setViewMode('admin')}
            className="flex items-center gap-1 bg-red-600 hover:bg-red-500 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full animate-bounce shadow"
            title="Tienes pedidos de WhatsApp pendientes por aprobar"
          >
            <ShieldAlert className="w-3 h-3" />
            <span>{pendingOrdersCount} Pedidos WhatsApp</span>
          </button>
        )}

      </div>
    </div>
  );
};
