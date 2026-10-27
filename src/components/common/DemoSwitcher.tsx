import React from 'react';
import { Eye, ShieldAlert, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const DemoSwitcher: React.FC = () => {
  const { viewMode, setViewMode, pendingOrdersCount } = useStore();

  return (
    <div className="fixed bottom-4 left-4 z-50 no-print">
      <div className="flex items-center gap-2 bg-stone-900/95 backdrop-blur-md text-white px-3.5 py-2.5 rounded-full shadow-2xl border border-stone-700/80 hover:border-amber-500/80 transition-all duration-300">
        
        {/* Toggle Button */}
        <button
          onClick={() => setViewMode(viewMode === 'store' ? 'admin' : 'store')}
          className="flex items-center gap-2.5 text-xs font-bold tracking-wide group"
        >
          <div className="w-6 h-6 rounded-full bg-amber-500 text-stone-900 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <Eye className="w-3.5 h-3.5" />
          </div>

          <span className="text-stone-300">
            Vista: <span className="text-white font-extrabold uppercase">{viewMode === 'store' ? '🛍️ Tienda Pública' : '⚙️ Panel Admin ERP'}</span>
          </span>

          <span className="bg-stone-800 hover:bg-stone-700 text-amber-400 px-2 py-0.5 rounded-full text-[11px] font-semibold border border-stone-700 transition">
            Cambiar ⇋
          </span>
        </button>

        {/* Pending Orders Pill if in store mode */}
        {pendingOrdersCount > 0 && viewMode === 'store' && (
          <button 
            onClick={() => setViewMode('admin')}
            className="flex items-center gap-1 bg-red-600 hover:bg-red-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full animate-bounce shadow"
            title="Tienes pedidos de WhatsApp pendientes por aprobar"
          >
            <ShieldAlert className="w-3 h-3" />
            <span>{pendingOrdersCount} Pedidos WhatsApp</span>
          </button>
        )}

        <div className="hidden sm:flex items-center text-stone-500 text-[10px] pl-1 border-l border-stone-700">
          <Sparkles className="w-3 h-3 text-amber-400 mr-1" /> Demo Activa
        </div>

      </div>
    </div>
  );
};
