import React from 'react';
import { 
  LayoutDashboard, 
  Inbox, 
  Package, 
  Wallet, 
  Printer, 
  Settings, 
  Eye, 
  ShieldAlert,
  Calendar,
  Clock
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
    <div className="min-h-screen bg-stone-100 flex flex-col">
      
      {/* Top Admin Bar */}
      <header className="bg-stone-900 text-white shadow-md border-b border-stone-800 sticky top-0 z-40 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Brand Logo & Name */}
            <div className="flex items-center gap-3">
              <div 
                className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-extrabold text-lg shadow"
                style={{ backgroundColor: settings.primaryColor }}
              >
                🌾
              </div>
              <div className="flex flex-col">
                <span className="font-black text-sm tracking-wide uppercase text-white flex items-center gap-2">
                  {settings.storeName}
                  <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-400 font-extrabold border border-amber-500/30">
                    ERP AGRO
                  </span>
                </span>
                <span className="text-[11px] text-stone-400 hidden sm:block">
                  Sistema de Gestión & Ventas de Campo
                </span>
              </div>
            </div>

            {/* Date & Quick Action */}
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-xs text-stone-400 bg-stone-800/80 px-3 py-1.5 rounded-lg border border-stone-700">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span className="capitalize">{currentDate}</span>
              </div>

              {/* Button to toggle to Public Store */}
              <button
                onClick={() => setViewMode('store')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 shadow transition-transform active:scale-95"
              >
                <Eye className="w-4 h-4" />
                <span>Ver Tienda Pública</span>
              </button>
            </div>

          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="bg-stone-950 border-t border-stone-800 overflow-x-auto scrollbar-none">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-1 sm:space-x-2 py-1.5">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeAdminTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveAdminTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap shrink-0 relative ${
                    isActive
                      ? 'bg-stone-800 text-amber-400 shadow-sm border border-stone-700'
                      : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-stone-400'}`} />
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && (
                    <span className="ml-1 bg-red-600 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full animate-pulse shadow">
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
