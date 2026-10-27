import React from 'react';
import { 
  LayoutDashboard, 
  Inbox, 
  Package, 
  Wallet, 
  Printer, 
  Settings, 
  Eye, 
  Calendar,
  Zap,
  Sparkles
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { 
    settings, 
    viewMode, 
    setViewMode, 
    activeAdminTab, 
    setActiveAdminTab, 
    pendingOrdersCount 
  } = useStore();

  const isBrasilTheme = (settings.designTheme || 'brasil_heavy_duty') === 'brasil_heavy_duty';

  const tabs = [
    { id: 'dashboard', label: 'Dashboard & Ganancias', icon: LayoutDashboard },
    { 
      id: 'orders', 
      label: 'Bandeja WhatsApp & POS', 
      icon: Inbox, 
      badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined 
    },
    { id: 'inventory', label: 'Inventario Matricial', icon: Package },
    { id: 'cash', label: 'Caja Chica & Arqueo', icon: Wallet },
    { id: 'print', label: 'Centro de Impresiones', icon: Printer },
    { id: 'settings', label: 'Marca & Sistema', icon: Settings },
  ];

  const currentDate = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${
      isBrasilTheme ? 'bg-[#0a0d0c] text-stone-100' : 'bg-stone-100 text-stone-900'
    }`}>
      
      {/* Top Admin Bar */}
      <header className={`sticky top-0 z-40 no-print transition-colors ${
        isBrasilTheme 
          ? 'bg-[#080a09] text-white shadow-xl border-b border-stone-800 border-t-2 border-t-[#FFE600]' 
          : 'bg-stone-900 text-white shadow-md border-b border-stone-800'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Brand Logo & Name */}
            <div className="flex items-center gap-3">
              <div 
                className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-lg shadow-md transition-transform ${
                  isBrasilTheme 
                    ? 'bg-[#FFE600] text-black shadow-[0_0_15px_rgba(255,230,0,0.35)]' 
                    : 'text-white'
                }`}
                style={{ backgroundColor: !isBrasilTheme ? settings.primaryColor : undefined }}
              >
                {isBrasilTheme ? '⚡' : '🌾'}
              </div>
              <div className="flex flex-col">
                <span className="font-black text-sm tracking-wide uppercase text-white flex items-center gap-2 font-heading">
                  {settings.storeName}
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black border uppercase tracking-wider ${
                    isBrasilTheme 
                      ? 'bg-yellow-400/20 text-[#FFE600] border-yellow-400/40' 
                      : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                  }`}>
                    {isBrasilTheme ? 'HEAVY-DUTY ERP' : 'ERP AGRO'}
                  </span>
                </span>
                <span className={`text-[11px] hidden sm:block ${
                  isBrasilTheme ? 'text-stone-400' : 'text-stone-400'
                }`}>
                  {isBrasilTheme ? 'Gestão Industrial & Vendas de Alta Carga' : 'Sistema de Gestión & Ventas de Campo'}
                </span>
              </div>
            </div>

            {/* Date & Quick Action */}
            <div className="flex items-center gap-4">
              <div className={`hidden md:flex items-center gap-2 text-xs px-3 py-1.5 rounded-xl border ${
                isBrasilTheme 
                  ? 'text-stone-300 bg-stone-900/90 border-stone-800' 
                  : 'text-stone-400 bg-stone-800/80 border-stone-700'
              }`}>
                <Calendar className={`w-4.5 h-4.5 ${isBrasilTheme ? 'text-[#FFE600]' : 'text-amber-400'} stroke-[2]`} />
                <span className="capitalize font-bold">{currentDate}</span>
              </div>

              {/* Button to toggle to Public Store */}
              <button
                onClick={() => setViewMode('store')}
                className={`group flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black shadow-md transition-all active:scale-95 btn-tactile hover-lift ${
                  isBrasilTheme 
                    ? 'bg-[#FFE600] hover:bg-[#ffe81a] text-black shadow-[0_0_20px_rgba(255,230,0,0.3)]' 
                    : 'bg-amber-500 hover:bg-amber-400 text-stone-950'
                }`}
              >
                <div className="w-6 h-6 rounded-md bg-black/15 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Eye className="w-4.5 h-4.5 stroke-[2.2]" />
                </div>
                <span>Ver Tienda Pública</span>
              </button>
            </div>

          </div>
        </div>

        {/* Sub-Navigation Tabs (Prominent High-Visibility Icons) */}
        <div className={`border-t overflow-x-auto scrollbar-none ${
          isBrasilTheme ? 'bg-[#050706] border-stone-800' : 'bg-stone-950 border-stone-800'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-1 sm:space-x-2 py-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeAdminTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveAdminTab(tab.id)}
                  className={`group flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition whitespace-nowrap shrink-0 relative btn-tactile hover-lift ${
                    isActive
                      ? isBrasilTheme
                        ? 'bg-[#181f1c] text-[#FFE600] shadow-sm border border-[#FFE600]/40 shadow-[0_0_15px_rgba(255,230,0,0.15)]'
                        : 'bg-stone-800 text-amber-400 shadow-sm border border-stone-700'
                      : isBrasilTheme
                      ? 'text-stone-400 hover:text-stone-100 hover:bg-stone-900'
                      : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                    isActive
                      ? isBrasilTheme ? 'bg-[#FFE600]/25 border border-[#FFE600]/50' : 'bg-amber-400/25 border border-amber-400/50'
                      : 'bg-stone-800/80 border border-stone-700/60 group-hover:scale-105 group-hover:bg-stone-700/80'
                  }`}>
                    <Icon className={`w-5 h-5 stroke-[2.2] ${
                      isActive 
                        ? isBrasilTheme ? 'text-[#FFE600]' : 'text-amber-400' 
                        : 'text-stone-300 group-hover:text-white'
                    }`} />
                  </div>
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && (
                    <span className="ml-1 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse shadow">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main ERP Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>

    </div>
  );
};
