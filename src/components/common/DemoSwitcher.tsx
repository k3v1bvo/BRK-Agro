import React from 'react';
import { Eye, ShieldAlert, Sparkles, Palette, Zap, ArrowLeftRight } from 'lucide-react';
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
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-[#0c100e]/95 backdrop-blur-2xl text-white p-2.5 sm:px-5 sm:py-3 rounded-3xl shadow-2xl border-2 border-stone-700/80 hover:border-yellow-400 hover:glow-yellow transition-all duration-300">
        
        {/* Toggle Theme / Style */}
        <button
          onClick={toggleTheme}
          className="flex items-center gap-3 px-3.5 py-2 rounded-2xl bg-stone-900/90 hover:bg-stone-800 text-xs font-bold transition text-left active:scale-95 group border border-stone-800 btn-tactile hover-lift"
          title="Alternar entre el estilo oficial BRK Brasil Heavy-Duty y BRK Bolivia Country"
        >
          <div className="w-8 h-8 rounded-xl bg-yellow-400/20 text-yellow-400 flex items-center justify-center shrink-0 group-hover:rotate-12 transition-transform shadow-sm">
            <Palette className="w-4.5 h-4.5 stroke-[2.2]" />
          </div>
          <div>
            <div className="text-[10px] text-stone-400 uppercase font-black tracking-wider">
              Diseño Visual:
            </div>
            <div className="text-xs sm:text-sm font-black flex items-center gap-1.5">
              <span className={currentTheme === 'brasil_heavy_duty' ? 'text-yellow-400 font-heading' : 'text-emerald-400 font-heading'}>
                {currentTheme === 'brasil_heavy_duty' ? '⚡ BRK Brasil (Dark)' : '🌾 BRK Bolivia (Country)'}
              </span>
              <span className="text-[10px] bg-stone-800 px-1.5 py-0.5 rounded-md text-stone-300 group-hover:text-yellow-400 font-bold border border-stone-700">
                Cambiar ⇋
              </span>
            </div>
          </div>
        </button>

        {/* Separator */}
        <div className="hidden sm:block w-px h-8 bg-stone-800" />

        {/* Toggle Store <-> Admin */}
        <button
          onClick={() => setViewMode(viewMode === 'store' ? 'admin' : 'store')}
          className="flex items-center gap-3 px-3.5 py-2 rounded-2xl bg-stone-900/90 hover:bg-stone-800 text-xs font-bold tracking-wide group transition active:scale-95 border border-stone-800 btn-tactile hover-lift"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 text-black flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform font-black shadow-sm">
            <Eye className="w-4.5 h-4.5 stroke-[2.2]" />
          </div>

          <div>
            <div className="text-[10px] text-stone-400 uppercase font-black tracking-wider">
              Modo Activo:
            </div>
            <div className="text-xs sm:text-sm text-white font-extrabold uppercase flex items-center gap-1">
              <span>{viewMode === 'store' ? '🛍️ Tienda Pública' : '⚙️ ERP Admin'}</span>
            </div>
          </div>
        </button>

        {/* Pending Orders Pill if in store mode */}
        {pendingOrdersCount > 0 && viewMode === 'store' && (
          <button 
            onClick={() => setViewMode('admin')}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white text-xs font-black px-3.5 py-2 rounded-2xl animate-bounce shadow-lg btn-tactile hover-lift"
            title="Tienes pedidos de WhatsApp pendientes por aprobar"
          >
            <ShieldAlert className="w-4.5 h-4.5 stroke-[2.2]" />
            <span>{pendingOrdersCount} Pedidos WhatsApp</span>
          </button>
        )}

      </div>
    </div>
  );
};
