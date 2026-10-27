import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { DemoSwitcher } from './components/common/DemoSwitcher';
import { StoreFront } from './components/store/StoreFront';
import { StoreFrontBrasilHeavyDuty } from './components/store/StoreFrontBrasilHeavyDuty';
import { CartDrawer } from './components/store/CartDrawer';
import { WhatsAppCheckoutModal } from './components/store/WhatsAppCheckoutModal';
import { AdminLayout } from './components/admin/AdminLayout';
import { DashboardTab } from './components/admin/DashboardTab';
import { OrdersAndPOSTab } from './components/admin/OrdersAndPOSTab';
import { InventoryTab } from './components/admin/InventoryTab';
import { CashRegisterTab } from './components/admin/CashRegisterTab';
import { PrintCenterTab } from './components/admin/PrintCenterTab';
import { BrandSettingsTab } from './components/admin/BrandSettingsTab';

import { WhatsAppFloatingWidget } from './components/common/WhatsAppFloatingWidget';

const MainApp: React.FC = () => {
  const { viewMode, activeAdminTab, settings } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const isBrasilTheme = (settings.designTheme || 'brasil_heavy_duty') === 'brasil_heavy_duty';

  return (
    <div className={`min-h-screen flex flex-col font-sans antialiased ${
      isBrasilTheme 
        ? 'bg-[#0e1110] text-stone-100 selection:bg-yellow-400 selection:text-black' 
        : 'text-stone-900 bg-stone-100 selection:bg-amber-500 selection:text-stone-950'
    }`}>
      
      {viewMode === 'store' ? (
        // Public Storefront View
        <>
          {isBrasilTheme ? (
            // Diseñó 1: BRK Agro Brasil (Dark Charcoal Concrete, Yellow & Green, Reels UGC)
            <StoreFrontBrasilHeavyDuty
              onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
              isSizeGuideOpen={isSizeGuideOpen}
              setIsSizeGuideOpen={setIsSizeGuideOpen}
            />
          ) : (
            // Diseñó 2: BRK Agro Bolivia (Country Leather, Classic Lookbook)
            <>
              <Header
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
              />

              <main className="flex-1">
                <StoreFront
                  searchTerm={searchTerm}
                  isSizeGuideOpen={isSizeGuideOpen}
                  setIsSizeGuideOpen={setIsSizeGuideOpen}
                />
              </main>
            </>
          )}

          <CartDrawer onOpenCheckout={() => setIsCheckoutOpen(true)} />
          
          <WhatsAppCheckoutModal
            isOpen={isCheckoutOpen}
            onClose={() => setIsCheckoutOpen(false)}
          />

          <Footer />

          {/* Floating WhatsApp support widget */}
          <WhatsAppFloatingWidget />
        </>
      ) : (
        // Admin ERP Panel View
        <AdminLayout>
          {activeAdminTab === 'dashboard' && <DashboardTab />}
          {activeAdminTab === 'orders' && <OrdersAndPOSTab />}
          {activeAdminTab === 'inventory' && <InventoryTab />}
          {activeAdminTab === 'cash' && <CashRegisterTab />}
          {activeAdminTab === 'print' && <PrintCenterTab />}
          {activeAdminTab === 'settings' && <BrandSettingsTab />}
        </AdminLayout>
      )}

      {/* Floating Demo Switcher (Accessible in both views) */}
      <DemoSwitcher />

    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainApp />
    </StoreProvider>
  );
}
