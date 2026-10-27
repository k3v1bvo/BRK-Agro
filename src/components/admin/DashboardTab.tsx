import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Wallet, 
  UserCheck, 
  Package, 
  Calendar, 
  MapPin, 
  Filter, 
  ArrowUpRight, 
  Sparkles,
  Receipt,
  Truck,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Sale } from '../../types';

export const DashboardTab: React.FC = () => {
  const { settings, sales, cashMovements } = useStore();
  const currency = settings.currency || 'Bs.';

  // Date filters
  const [dateFilter, setDateFilter] = useState<'hoy' | 'ayer' | 'semana' | 'mes' | 'todo'>('hoy');
  const [cityFilter, setCityFilter] = useState<string>('todas');
  const [paymentFilter, setPaymentFilter] = useState<string>('todos');

  // Filter sales
  const filteredSales = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    return sales.filter((sale) => {
      const saleDate = sale.date.split(' ')[0];

      // Date match
      let matchDate = true;
      if (dateFilter === 'hoy') {
        matchDate = saleDate === todayStr;
      } else if (dateFilter === 'ayer') {
        matchDate = saleDate === yesterday;
      } else if (dateFilter === 'semana') {
        const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
        matchDate = saleDate >= sevenDaysAgo;
      } else if (dateFilter === 'mes') {
        const monthPrefix = todayStr.slice(0, 7);
        matchDate = saleDate.startsWith(monthPrefix);
      }

      // City match
      const matchCity = cityFilter === 'todas' || sale.customerCity.toLowerCase().includes(cityFilter.toLowerCase());

      // Payment match
      const matchPayment = paymentFilter === 'todos' || sale.paymentMethod === paymentFilter;

      return matchDate && matchCity && matchPayment;
    });
  }, [sales, dateFilter, cityFilter, paymentFilter]);

  // Financial calculations
  const totalGrossSales = useMemo(() => {
    return filteredSales.reduce((sum, s) => sum + s.totalAmount, 0);
  }, [filteredSales]);

  const totalCashSales = useMemo(() => {
    return filteredSales.reduce((sum, s) => sum + s.cashAmount, 0);
  }, [filteredSales]);

  const totalQrSales = useMemo(() => {
    return filteredSales.reduce((sum, s) => sum + s.qrAmount, 0);
  }, [filteredSales]);

  const totalCMV = useMemo(() => {
    return filteredSales.reduce((sum, s) => sum + s.totalCost, 0);
  }, [filteredSales]);

  const grossProfit = totalGrossSales - totalCMV;

  // Filter cash expenses (Staff payments + Operational expenses)
  const totalExpenses = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    return cashMovements
      .filter((m) => {
        const movDate = m.date.split(' ')[0];
        const isExpense = m.type === 'PAGO_PERSONAL' || m.type === 'GASTO_OPERATIVO' || m.type === 'RETIRO_SOCIO';
        if (!isExpense) return false;

        if (dateFilter === 'hoy') return movDate === todayStr;
        if (dateFilter === 'ayer') {
          const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
          return movDate === yesterday;
        }
        return true;
      })
      .reduce((sum, m) => sum + m.amount, 0);
  }, [cashMovements, dateFilter]);

  const staffExpenses = useMemo(() => {
    return cashMovements
      .filter((m) => m.type === 'PAGO_PERSONAL')
      .reduce((sum, m) => sum + m.amount, 0);
  }, [cashMovements]);

  const operationalExpenses = useMemo(() => {
    return cashMovements
      .filter((m) => m.type === 'GASTO_OPERATIVO')
      .reduce((sum, m) => sum + m.amount, 0);
  }, [cashMovements]);

  // Clean owner profit
  const netProfit = grossProfit - totalExpenses;
  const netMargin = totalGrossSales > 0 ? ((netProfit / totalGrossSales) * 100).toFixed(1) : '0';

  // Unique cities list for filter
  const uniqueCities = useMemo(() => {
    const set = new Set(sales.map((s) => s.customerCity));
    return Array.from(set);
  }, [sales]);

  return (
    <div className="space-y-6">
      
      {/* Top Filter Bar with Executive Styling */}
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-stone-200/90 flex flex-wrap items-center justify-between gap-4">
        
        {/* Date Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-black text-stone-500 mr-2 flex items-center gap-1 uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5 text-stone-400" /> Período:
          </span>
          {(['hoy', 'ayer', 'semana', 'mes', 'todo'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setDateFilter(filter)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black capitalize transition ${
                dateFilter === filter
                  ? 'bg-stone-900 text-amber-400 shadow-md'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {filter === 'hoy' ? 'Hoy' : filter === 'ayer' ? 'Ayer' : filter === 'semana' ? 'Esta Semana' : filter === 'mes' ? 'Este Mes' : 'Histórico Todo'}
            </button>
          ))}
        </div>

        {/* City & Payment Dropdowns */}
        <div className="flex items-center gap-2.5 text-xs">
          <div className="flex items-center gap-1.5 bg-stone-100 px-3 py-2 rounded-xl border border-stone-200">
            <MapPin className="w-3.5 h-3.5 text-stone-400" />
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="bg-transparent font-bold text-stone-800 focus:outline-none"
            >
              <option value="todas">Todas las Ciudades</option>
              {uniqueCities.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-stone-100 px-3 py-2 rounded-xl border border-stone-200">
            <Filter className="w-3.5 h-3.5 text-stone-400" />
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="bg-transparent font-bold text-stone-800 focus:outline-none"
            >
              <option value="todos">Todos los Pagos</option>
              <option value="Efectivo">Efectivo</option>
              <option value="QR">QR / Banco</option>
              <option value="Mixto">Mixto</option>
              <option value="Crédito/Fiado">Crédito / Fiado</option>
            </select>
          </div>
        </div>

      </div>

      {/* 5 Financial Cards with High-End Visual Hierarchy */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Card 1: Ventas Brutas */}
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-stone-200/90 flex flex-col justify-between card-luxury">
          <div>
            <div className="flex items-center justify-between text-xs font-black text-stone-500 uppercase tracking-wider">
              <span>Ventas Brutas</span>
              <span className="p-2 bg-blue-50 text-blue-700 rounded-xl">
                <Receipt className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-stone-900 mt-3 font-heading">
              {currency} {totalGrossSales.toLocaleString()}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] text-stone-500 flex justify-between font-bold">
            <span>💵 Efectivo: {currency} {totalCashSales}</span>
            <span>📱 QR: {currency} {totalQrSales}</span>
          </div>
        </div>

        {/* Card 2: Costo de Mercadería (CMV) */}
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-stone-200/90 flex flex-col justify-between card-luxury">
          <div>
            <div className="flex items-center justify-between text-xs font-black text-stone-500 uppercase tracking-wider">
              <span>Costo Mercadería</span>
              <span className="p-2 bg-rose-50 text-rose-700 rounded-xl">
                <Package className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-stone-900 mt-3 font-heading">
              {currency} {totalCMV.toLocaleString()}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] text-stone-500 font-bold">
            Costo directo de fábrica y taller
          </div>
        </div>

        {/* Card 3: Ganancia Bruta */}
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-stone-200/90 flex flex-col justify-between card-luxury">
          <div>
            <div className="flex items-center justify-between text-xs font-black text-stone-500 uppercase tracking-wider">
              <span>Ganancia Bruta</span>
              <span className="p-2 bg-amber-50 text-amber-700 rounded-xl">
                <ArrowUpRight className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-stone-900 mt-3 font-heading">
              {currency} {grossProfit.toLocaleString()}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] text-stone-500 font-bold">
            Margen: {totalGrossSales > 0 ? ((grossProfit / totalGrossSales) * 100).toFixed(0) : 0}% sobre ventas
          </div>
        </div>

        {/* Card 4: Gastos Operativos & Personal */}
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-stone-200/90 flex flex-col justify-between card-luxury">
          <div>
            <div className="flex items-center justify-between text-xs font-black text-stone-500 uppercase tracking-wider">
              <span>Gastos & Personal</span>
              <span className="p-2 bg-purple-50 text-purple-700 rounded-xl">
                <UserCheck className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-stone-900 mt-3 font-heading">
              {currency} {totalExpenses.toLocaleString()}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] text-stone-500 flex justify-between font-bold">
            <span>Staff: {currency} {staffExpenses}</span>
            <span>Flotas/Ads: {currency} {operationalExpenses}</span>
          </div>
        </div>

        {/* Card 5: UTILIDAD NETA REAL (Luxury Dark Cockpit Glow) */}
        <div className="bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950 text-white p-5 rounded-3xl shadow-xl border-2 border-amber-500 flex flex-col justify-between relative overflow-hidden card-luxury">
          <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 opacity-15">
            <Sparkles className="w-28 h-28 text-amber-400" />
          </div>

          <div>
            <div className="flex items-center justify-between text-xs font-black text-amber-400 uppercase tracking-wider">
              <span>💰 Utilidad Neta Real</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black border border-emerald-400/30">
                Ganancia Limpia
              </span>
            </div>
            <div className="text-3xl sm:text-4xl font-black text-white mt-3 font-heading tracking-tight">
              {currency} {netProfit.toLocaleString()}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-800 text-[11px] text-stone-300 font-bold flex justify-between">
            <span>Bolsillo del Dueño</span>
            <span className="text-amber-400 font-black">{netMargin}% rentabilidad</span>
          </div>
        </div>

      </div>

      {/* Visual Profit Anatomy Bar */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-200">
        <h4 className="text-xs font-black text-stone-700 uppercase tracking-wider mb-3">
          Composición Financiera de Ingresos
        </h4>

        {totalGrossSales > 0 ? (
          <div>
            <div className="h-4 rounded-full overflow-hidden flex bg-stone-100 p-0.5 border border-stone-200">
              <div 
                className="bg-rose-500 h-full rounded-l-full transition-all duration-500" 
                style={{ width: `${(totalCMV / totalGrossSales) * 100}%` }}
                title={`Costo Mercadería: ${currency} ${totalCMV}`}
              />
              <div 
                className="bg-purple-500 h-full transition-all duration-500" 
                style={{ width: `${(totalExpenses / totalGrossSales) * 100}%` }}
                title={`Gastos & Personal: ${currency} ${totalExpenses}`}
              />
              <div 
                className="bg-emerald-600 h-full rounded-r-full transition-all duration-500" 
                style={{ width: `${Math.max(0, (netProfit / totalGrossSales) * 100)}%` }}
                title={`Utilidad Neta: ${currency} ${netProfit}`}
              />
            </div>

            <div className="mt-3.5 flex flex-wrap items-center justify-between text-xs font-bold">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                <span className="text-stone-600">Costo Prendas: {currency} {totalCMV} ({((totalCMV / totalGrossSales) * 100).toFixed(0)}%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-purple-500 inline-block" />
                <span className="text-stone-600">Gastos/Personal: {currency} {totalExpenses} ({((totalExpenses / totalGrossSales) * 100).toFixed(0)}%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block" />
                <span className="text-emerald-800 font-black">Ganancia Limpia: {currency} {netProfit} ({((netProfit / totalGrossSales) * 100).toFixed(0)}%)</span>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-xs text-stone-500">No hay ventas registradas en el período seleccionado.</p>
        )}
      </div>

      {/* Sales Detail Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="p-6 border-b border-stone-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-stone-900 font-heading">
              Auditoría de Ventas Realizadas ({filteredSales.length})
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Auditoría prenda por prenda, tallas despachadas, destino y margen de ganancia individual
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-500 font-black uppercase tracking-wider border-b border-stone-200">
              <tr>
                <th className="py-3 px-4">Código / Hora</th>
                <th className="py-3 px-4">Cliente & Destino</th>
                <th className="py-3 px-4">Prendas y Tallas Exactas</th>
                <th className="py-3 px-4">Pago</th>
                <th className="py-3 px-4 text-right">Venta Total</th>
                <th className="py-3 px-4 text-right">Costo (CMV)</th>
                <th className="py-3 px-4 text-right">Ganancia Neta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium">
              {filteredSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-stone-50 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-stone-800">
                    <div>#{sale.id}</div>
                    <div className="text-[11px] text-stone-400 font-sans">{sale.date}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-extrabold text-stone-900">{sale.customerName}</div>
                    <div className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                      <Truck className="w-3 h-3 text-stone-400" />
                      <span>{sale.customerCity}</span>
                      {sale.transportCompany && (
                        <span className="text-amber-800 font-bold">({sale.transportCompany})</span>
                      )}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="space-y-1">
                      {sale.items.map((it, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-[11px]">
                          <span className="font-black text-stone-900">{it.quantity}x</span>
                          <span className="text-stone-700">{it.productName}</span>
                          <span className="px-1.5 py-0.2 rounded bg-stone-200 text-stone-800 font-bold text-[10px]">
                            Talla {it.size}
                          </span>
                          {it.customText && (
                            <span className="text-[10px] text-amber-700 font-semibold">
                              [Bordado]
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      sale.paymentMethod === 'Efectivo'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : sale.paymentMethod === 'QR'
                        ? 'bg-blue-50 text-blue-800 border border-blue-200'
                        : sale.paymentMethod === 'Mixto'
                        ? 'bg-purple-50 text-purple-800 border border-purple-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}>
                      {sale.paymentMethod}
                    </span>
                    {sale.pendingBalance > 0 && (
                      <div className="text-[10px] text-red-600 font-extrabold mt-0.5">
                        Saldo Pend.: {currency} {sale.pendingBalance}
                      </div>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-right font-black text-stone-900 text-sm font-heading">
                    {currency} {sale.totalAmount.toLocaleString()}
                  </td>

                  <td className="py-3.5 px-4 text-right text-stone-500 font-semibold">
                    {currency} {sale.totalCost.toLocaleString()}
                  </td>

                  <td className="py-3.5 px-4 text-right font-black text-emerald-700 text-sm font-heading">
                    +{currency} {sale.grossProfit.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
