import React, { useState, useMemo } from 'react';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight, 
  Lock, 
  Unlock, 
  Plus, 
  UserCheck, 
  Truck, 
  Printer, 
  CheckCircle2, 
  AlertTriangle,
  QrCode,
  DollarSign
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { CashMovementType, ExpenseCategory } from '../../types';

export const CashRegisterTab: React.FC = () => {
  const { settings, cashMovements, addCashMovement, cashDay, closeCashDay, setActiveAdminTab } = useStore();
  const currency = settings.currency || 'Bs.';

  // Movement Modal State
  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);
  const [movementType, setMovementType] = useState<CashMovementType>('PAGO_PERSONAL');
  const [movementCategory, setMovementCategory] = useState<ExpenseCategory>('Adelanto');
  const [movementDesc, setMovementDesc] = useState('');
  const [movementRecipient, setMovementRecipient] = useState('Rodrigo (Ventas)');
  const [movementAmount, setMovementAmount] = useState<number>(100);
  const [movementChannel, setMovementChannel] = useState<'Efectivo' | 'QR/Banco'>('Efectivo');

  // Arqueo Modal State
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const [countedCash, setCountedCash] = useState<number>(cashDay.expectedCashInDrawer);
  const [closedBy, setClosedBy] = useState('Gerente / Dueño');
  const [closeNotes, setCloseNotes] = useState('Arqueo conforme al cierre del día');

  // Filter movements
  const [channelFilter, setChannelFilter] = useState<'todos' | 'Efectivo' | 'QR/Banco'>('todos');

  const filteredMovements = useMemo(() => {
    return cashMovements.filter((m) => {
      if (channelFilter === 'todos') return true;
      return m.paymentChannel === channelFilter;
    });
  }, [cashMovements, channelFilter]);

  // Live Cash In Drawer Calculation
  const liveCashInDrawer = useMemo(() => {
    return cashMovements.reduce((acc, m) => {
      if (m.paymentChannel !== 'Efectivo') return acc;
      if (m.type === 'APERTURA' || m.type === 'INGRESO_VENTA' || m.type === 'COBRO_CREDITO') {
        return acc + m.amount;
      } else {
        return acc - m.amount;
      }
    }, 0);
  }, [cashMovements]);

  // Live Bank/QR Inflow Calculation
  const liveBankInflow = useMemo(() => {
    return cashMovements.reduce((acc, m) => {
      if (m.paymentChannel !== 'QR/Banco') return acc;
      if (m.type === 'INGRESO_VENTA' || m.type === 'COBRO_CREDITO') {
        return acc + m.amount;
      } else {
        return acc - m.amount;
      }
    }, 0);
  }, [cashMovements]);

  // Handle submit movement
  const handleSaveMovement = (e: React.FormEvent) => {
    e.preventDefault();
    if (movementAmount <= 0) return;

    addCashMovement({
      type: movementType,
      category: movementCategory,
      description: movementDesc.trim() || `${movementCategory} - ${movementRecipient}`,
      recipientOrStaff: movementType === 'PAGO_PERSONAL' ? movementRecipient : undefined,
      amount: movementAmount,
      paymentChannel: movementChannel,
    });

    setIsMovementModalOpen(false);
    setMovementDesc('');
    setMovementAmount(100);
  };

  // Handle submit Arqueo
  const handleSaveCloseDay = (e: React.FormEvent) => {
    e.preventDefault();
    closeCashDay(countedCash, closedBy, closeNotes);
    setIsCloseModalOpen(false);
  };

  const cashDiff = countedCash - liveCashInDrawer;

  return (
    <div className="space-y-6">
      
      {/* 3 Live Monitor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Card 1: Efectivo Físico en Cajón */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border-2 border-emerald-500 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-black text-emerald-800 uppercase tracking-wider">
              <span>💵 Efectivo Físico en Cajón</span>
              <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
                <Wallet className="w-5 h-5" />
              </span>
            </div>
            <div className="text-3xl font-black text-stone-900 mt-3">
              {currency} {liveCashInDrawer.toLocaleString()}
            </div>
            <p className="text-[11px] text-stone-500 mt-1">
              Dinero disponible en billetes y monedas en el mostrador
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-stone-600">
            <span>Apertura: {currency} {cashDay.initialCash}</span>
            <span className="text-emerald-700">En Caja Hoy</span>
          </div>
        </div>

        {/* Card 2: QR / Cuenta Bancaria */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border-2 border-sky-500 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-black text-sky-800 uppercase tracking-wider">
              <span>📱 Dinero en QR / Banco</span>
              <span className="p-1.5 bg-sky-50 text-sky-600 rounded-lg">
                <QrCode className="w-5 h-5" />
              </span>
            </div>
            <div className="text-3xl font-black text-stone-900 mt-3">
              {currency} {liveBankInflow.toLocaleString()}
            </div>
            <p className="text-[11px] text-stone-500 mt-1">
              Transferencias QR Banco Ganadero / BNB / Mercantil
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-stone-600">
            <span>Cobros Digitales</span>
            <span className="text-sky-700">Verificado en App</span>
          </div>
        </div>

        {/* Card 3: Arqueo Status & Actions */}
        <div className="bg-stone-900 text-white p-6 rounded-2xl shadow-md border border-stone-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-black text-amber-400 uppercase tracking-wider">
              <span>Estado Arqueo Diario</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                cashDay.status === 'ABIERTA' ? 'bg-emerald-500 text-stone-950' : 'bg-stone-700 text-stone-300'
              }`}>
                {cashDay.status === 'ABIERTA' ? 'Caja Abierta' : 'Cerrada'}
              </span>
            </div>

            <div className="mt-3">
              {cashDay.status === 'ABIERTA' ? (
                <div className="text-xs text-stone-300 space-y-1">
                  <div>Caja operativa lista para registrar cobros y pagos de personal.</div>
                  <div className="font-bold text-amber-400">Total Esperado al Cierre: {currency} {liveCashInDrawer}</div>
                </div>
              ) : (
                <div className="text-xs text-stone-300 space-y-1">
                  <div className="font-bold text-emerald-400">Arqueo completado a las {cashDay.closedAt}</div>
                  <div>Contado: {currency} {cashDay.actualCountedCash} | Dif: {cashDay.difference}</div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-800 flex gap-2">
            <button
              onClick={() => setIsCloseModalOpen(true)}
              className="flex-1 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 flex items-center justify-center gap-1.5 transition"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{cashDay.status === 'ABIERTA' ? 'Arqueo & Cierre' : 'Ver Acta Cierre'}</span>
            </button>
            <button
              onClick={() => setActiveAdminTab('print')}
              className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300"
              title="Imprimir Acta"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Action Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-200 flex flex-wrap items-center justify-between gap-4">
        
        {/* Channel Filters */}
        <div className="flex items-center gap-2 text-xs">
          <span className="font-bold text-stone-500">Filtrar Canal:</span>
          {(['todos', 'Efectivo', 'QR/Banco'] as const).map((ch) => (
            <button
              key={ch}
              onClick={() => setChannelFilter(ch)}
              className={`px-3 py-1.5 rounded-xl font-bold transition ${
                channelFilter === ch
                  ? 'bg-stone-900 text-amber-400'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {ch === 'todos' ? 'Todos los Canales' : ch}
            </button>
          ))}
        </div>

        {/* Expense Button */}
        <div className="flex gap-2">
          <button
            onClick={() => {
              setMovementType('PAGO_PERSONAL');
              setMovementCategory('Adelanto');
              setIsMovementModalOpen(true);
            }}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow flex items-center gap-1.5 transition"
          >
            <UserCheck className="w-4 h-4" />
            <span>- Pago a Personal</span>
          </button>

          <button
            onClick={() => {
              setMovementType('GASTO_OPERATIVO');
              setMovementCategory('Encomienda');
              setIsMovementModalOpen(true);
            }}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-stone-800 hover:bg-stone-900 text-white shadow flex items-center gap-1.5 transition"
          >
            <Truck className="w-4 h-4" />
            <span>- Gasto Operativo / Flotas</span>
          </button>
        </div>

      </div>

      {/* Movements History Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="p-5 border-b border-stone-200 flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-stone-900">
              Libro Diario de Caja Chica ({filteredMovements.length})
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Entradas por ventas, cobros de fiados, pagos de personal y despachos de flota
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-500 font-extrabold uppercase border-b border-stone-200">
              <tr>
                <th className="py-3 px-4">Hora / Ref</th>
                <th className="py-3 px-4">Tipo Movimiento</th>
                <th className="py-3 px-4">Descripción & Destinatario</th>
                <th className="py-3 px-4">Canal</th>
                <th className="py-3 px-4 text-right">Monto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium">
              {filteredMovements.map((m) => {
                const isInflow = m.type === 'APERTURA' || m.type === 'INGRESO_VENTA' || m.type === 'COBRO_CREDITO';

                return (
                  <tr key={m.id} className="hover:bg-stone-50">
                    <td className="py-3 px-4 font-mono font-bold text-stone-700">
                      {m.date.split(' ')[1] || m.date}
                    </td>

                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                        isInflow
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {m.category}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-bold text-stone-900">
                      {m.description}
                      {m.recipientOrStaff && (
                        <span className="text-amber-800 text-[11px] ml-1">
                          (Personal: {m.recipientOrStaff})
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        m.paymentChannel === 'Efectivo'
                          ? 'bg-stone-200 text-stone-800'
                          : 'bg-sky-100 text-sky-800'
                      }`}>
                        {m.paymentChannel}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right font-black text-sm">
                      <span className={isInflow ? 'text-emerald-700' : 'text-rose-600'}>
                        {isInflow ? '+' : '-'} {currency} {m.amount.toLocaleString()}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: REGISTRAR SALIDA / PAGO */}
      {isMovementModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <h3 className="font-extrabold text-stone-900 text-base">
              {movementType === 'PAGO_PERSONAL' ? '👤 Registrar Pago a Personal' : '📦 Registrar Gasto Operativo'}
            </h3>

            <form onSubmit={handleSaveMovement} className="space-y-4 text-xs">
              
              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">
                  Categoría del Gasto:
                </label>
                <select
                  value={movementCategory}
                  onChange={(e) => setMovementCategory(e.target.value as ExpenseCategory)}
                  className="w-full font-bold p-2.5 rounded-xl border border-stone-300"
                >
                  {movementType === 'PAGO_PERSONAL' ? (
                    <>
                      <option value="Adelanto">Adelanto de Sueldo</option>
                      <option value="Sueldo">Sueldo / Quincena</option>
                      <option value="Comisión">Comisión de Ventas</option>
                      <option value="Jornal">Jornal Diario de Apoyo</option>
                    </>
                  ) : (
                    <>
                      <option value="Encomienda">Envío Encomienda Flota</option>
                      <option value="Publicidad">Publicidad Facebook / Ads</option>
                      <option value="Empaque">Bolsas / Empaque Reforzado</option>
                      <option value="Alquiler">Alquiler de Local / Stand</option>
                      <option value="Otro">Otro Gasto Menor</option>
                    </>
                  )}
                </select>
              </div>

              {movementType === 'PAGO_PERSONAL' && (
                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">
                    Nombre del Empleado:
                  </label>
                  <input
                    type="text"
                    required
                    value={movementRecipient}
                    onChange={(e) => setMovementRecipient(e.target.value)}
                    placeholder="Ej: Rodrigo (Ventas) / Doña María"
                    className="w-full p-2.5 rounded-xl border border-stone-300 font-bold"
                  />
                </div>
              )}

              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">
                  Detalle / Motivo:
                </label>
                <input
                  type="text"
                  value={movementDesc}
                  onChange={(e) => setMovementDesc(e.target.value)}
                  placeholder="Ej: Envío Flota Trans Copacabana a Montero"
                  className="w-full p-2.5 rounded-xl border border-stone-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">
                    Monto ({currency}):
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={movementAmount}
                    onChange={(e) => setMovementAmount(Number(e.target.value))}
                    className="w-full font-black text-sm p-2.5 rounded-xl border border-stone-300 text-rose-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">
                    Canal de Pago:
                  </label>
                  <select
                    value={movementChannel}
                    onChange={(e) => setMovementChannel(e.target.value as 'Efectivo' | 'QR/Banco')}
                    className="w-full font-bold p-2.5 rounded-xl border border-stone-300"
                  >
                    <option value="Efectivo">Efectivo (Cajón)</option>
                    <option value="QR/Banco">QR / Banco</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsMovementModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl font-bold border border-stone-200 text-stone-600"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl font-black text-xs uppercase text-white bg-rose-600 shadow hover:bg-rose-700"
                >
                  Registrar Salida
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CIERRE Y ARQUEO DIARIO */}
      {isCloseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <h3 className="font-extrabold text-stone-900 text-base">
              🔒 Cierre y Arqueo de Caja Chica
            </h3>

            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Efectivo Esperado según Sistema:</span>
                <span className="font-black text-stone-900 text-sm">
                  {currency} {liveCashInDrawer.toLocaleString()}
                </span>
              </div>
            </div>

            <form onSubmit={handleSaveCloseDay} className="space-y-4 text-xs">
              
              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">
                  Efectivo Real Contado en Billetes/Monedas ({currency}) *
                </label>
                <input
                  type="number"
                  required
                  value={countedCash}
                  onChange={(e) => setCountedCash(Number(e.target.value))}
                  className="w-full font-black text-xl p-3 rounded-xl border border-stone-300 text-stone-900"
                />
              </div>

              {/* Difference diagnosis */}
              <div className={`p-3 rounded-xl text-xs font-bold border flex items-center justify-between ${
                cashDiff === 0
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : cashDiff > 0
                  ? 'bg-blue-50 text-blue-800 border-blue-200'
                  : 'bg-rose-50 text-rose-800 border-rose-200'
              }`}>
                <span>Resultado del Arqueo:</span>
                <span>
                  {cashDiff === 0
                    ? '✅ Cuadra Exacto (Sin diferencias)'
                    : cashDiff > 0
                    ? `💰 Sobrante: +${currency} ${cashDiff}`
                    : `⚠️ Faltante: -${currency} ${Math.abs(cashDiff)}`}
                </span>
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">
                  Responsable del Cierre:
                </label>
                <input
                  type="text"
                  value={closedBy}
                  onChange={(e) => setClosedBy(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">
                  Observaciones:
                </label>
                <textarea
                  rows={2}
                  value={closeNotes}
                  onChange={(e) => setCloseNotes(e.target.value)}
                  className="w-full p-2 rounded-lg border border-stone-300"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCloseModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl font-bold border border-stone-200 text-stone-600"
                >
                  Volver
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl font-black text-xs uppercase text-white bg-stone-900 shadow hover:bg-stone-800"
                >
                  Finalizar Arqueo
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
