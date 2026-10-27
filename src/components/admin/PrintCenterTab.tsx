import React, { useState } from 'react';
import { 
  Printer, 
  Receipt, 
  Package, 
  FileText, 
  Truck, 
  Phone, 
  MapPin, 
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Sale } from '../../types';

export const PrintCenterTab: React.FC = () => {
  const { settings, sales, cashDay, cashMovements } = useStore();
  const currency = settings.currency || 'Bs.';

  const [documentType, setDocumentType] = useState<'receipt' | 'shipping_label' | 'cash_report'>('receipt');
  const [selectedSaleId, setSelectedSaleId] = useState<string>(sales[0]?.id || '');

  const selectedSale = sales.find((s) => s.id === selectedSaleId) || sales[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Top Document Selector (Hidden in Print) */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-200 flex flex-wrap items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDocumentType('receipt')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              documentType === 'receipt'
                ? 'bg-stone-900 text-amber-400 shadow-sm'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>Nota de Venta / Recibo</span>
          </button>

          <button
            onClick={() => setDocumentType('shipping_label')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              documentType === 'shipping_label'
                ? 'bg-stone-900 text-amber-400 shadow-sm'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>📦 Rótulo Encomienda Flota</span>
          </button>

          <button
            onClick={() => setDocumentType('cash_report')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              documentType === 'cash_report'
                ? 'bg-stone-900 text-amber-400 shadow-sm'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Acta de Cierre de Caja</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          {(documentType === 'receipt' || documentType === 'shipping_label') && (
            <select
              value={selectedSaleId}
              onChange={(e) => setSelectedSaleId(e.target.value)}
              className="text-xs font-bold p-2 rounded-xl border border-stone-300 bg-stone-50"
            >
              {sales.map((s) => (
                <option key={s.id} value={s.id}>
                  #{s.id} - {s.customerName} ({currency} {s.totalAmount})
                </option>
              ))}
            </select>
          )}

          <button
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider text-white shadow flex items-center gap-2 bg-stone-900 hover:bg-stone-800 transition"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            <span>Imprimir Documento / PDF</span>
          </button>
        </div>
      </div>

      {/* DOCUMENT PREVIEW CONTAINER */}
      <div className="bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-stone-200 max-w-3xl mx-auto print:p-0 print:border-none print:shadow-none">
        
        {/* 1. NOTA DE VENTA / RECIBO */}
        {documentType === 'receipt' && selectedSale && (
          <div className="space-y-6 text-stone-900">
            {/* Header */}
            <div className="flex items-start justify-between pb-6 border-b-2 border-stone-900">
              <div className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-extrabold text-2xl"
                  style={{ backgroundColor: settings.primaryColor }}
                >
                  🌾
                </div>
                <div>
                  <h1 className="text-xl font-black tracking-tight uppercase">
                    {settings.storeName}
                  </h1>
                  <p className="text-xs text-stone-500 font-semibold">{settings.slogan}</p>
                  <p className="text-[11px] text-stone-400 mt-0.5">{settings.address}</p>
                  <p className="text-[11px] text-stone-400">WhatsApp: +{settings.whatsappNumber}</p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs uppercase font-extrabold text-stone-400 block">
                  Nota de Entrega / Recibo
                </span>
                <span className="text-2xl font-black font-mono">#{selectedSale.id}</span>
                <div className="text-xs text-stone-500 mt-1">{selectedSale.date}</div>
              </div>
            </div>

            {/* Customer Details */}
            <div className="grid grid-cols-2 gap-4 text-xs p-4 bg-stone-50 rounded-xl border border-stone-200 print:bg-transparent">
              <div>
                <span className="text-stone-400 uppercase font-bold block text-[10px]">Cliente:</span>
                <span className="font-extrabold text-sm">{selectedSale.customerName}</span>
                <div className="text-stone-500 mt-0.5">Celular: +{selectedSale.customerPhone || 'N/A'}</div>
              </div>
              <div>
                <span className="text-stone-400 uppercase font-bold block text-[10px]">Destino / Entrega:</span>
                <span className="font-extrabold text-sm">{selectedSale.customerCity}</span>
                <div className="text-stone-500 mt-0.5">
                  Modalidad: {selectedSale.deliveryMethod}
                  {selectedSale.transportCompany && ` • ${selectedSale.transportCompany}`}
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="pt-2">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b-2 border-stone-900 text-stone-900 font-black uppercase">
                    <th className="py-2">Cant.</th>
                    <th className="py-2">Descripción de Prenda</th>
                    <th className="py-2 text-center">Talla</th>
                    <th className="py-2 text-right">P. Unit.</th>
                    <th className="py-2 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 font-medium">
                  {selectedSale.items.map((it, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5 font-bold">{it.quantity}</td>
                      <td className="py-2.5 font-extrabold">
                        {it.productName}
                        {it.customText && (
                          <div className="text-[11px] text-amber-800 font-normal italic">
                            ✍️ Bordado: "{it.customText}"
                          </div>
                        )}
                      </td>
                      <td className="py-2.5 text-center font-bold">{it.size}</td>
                      <td className="py-2.5 text-right">{currency} {it.unitPrice}</td>
                      <td className="py-2.5 text-right font-black">{currency} {it.subtotal.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="pt-4 border-t-2 border-stone-900 flex justify-end">
              <div className="w-64 space-y-1.5 text-xs">
                <div className="flex justify-between font-bold text-stone-600">
                  <span>Total Venta:</span>
                  <span className="text-base text-stone-900 font-black">
                    {currency} {selectedSale.totalAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Medio de Pago:</span>
                  <span className="font-bold">{selectedSale.paymentMethod}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Monto Pagado:</span>
                  <span className="font-bold text-emerald-700">{currency} {selectedSale.amountPaid.toLocaleString()}</span>
                </div>
                {selectedSale.pendingBalance > 0 && (
                  <div className="flex justify-between text-red-600 font-black pt-1 border-t border-stone-200">
                    <span>Saldo por Cobrar:</span>
                    <span>{currency} {selectedSale.pendingBalance.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Guarantee Policy Footer */}
            <div className="pt-6 border-t border-stone-200 text-center space-y-1 text-[11px] text-stone-500">
              <p className="font-bold text-stone-800">
                🛡️ POLÍTICA DE GARANTÍA BRK AGRO BOLIVIA
              </p>
              <p>
                Tu compra incluye <strong>1er Cambio de Talla Gratuito</strong> dentro de los 7 días posteriores a la recepción. La prenda debe conservar sus etiquetas originales y estar sin uso de campo.
              </p>
              <p className="text-[10px] text-stone-400 pt-2">
                ¡Gracias por confiar en el mejor equipamiento para el campo boliviano!
              </p>
            </div>
          </div>
        )}

        {/* 2. RÓTULO / ETIQUETA DE ENCOMIENDA A PROVINCIA (BIG BOLD FORMAT) */}
        {documentType === 'shipping_label' && selectedSale && (
          <div className="border-4 border-stone-950 p-8 rounded-2xl space-y-6 text-stone-950">
            {/* Header */}
            <div className="flex items-center justify-between border-b-4 border-stone-950 pb-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl">📦</span>
                <div>
                  <h1 className="text-2xl font-black uppercase tracking-tight">
                    RÓTULO DE ENCOMIENDA
                  </h1>
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-600">
                    Despacho Interdepartamental / Provincial
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-stone-500 uppercase">Guía de Despacho</div>
                <div className="text-2xl font-black font-mono">#{selectedSale.id}</div>
              </div>
            </div>

            {/* Giant Destination Banner */}
            <div className="bg-stone-950 text-white p-6 rounded-xl text-center">
              <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400 block mb-1">
                CIUDAD / PROVINCIA DE DESTINO:
              </span>
              <span className="text-4xl md:text-5xl font-black tracking-tight uppercase">
                {selectedSale.customerCity}
              </span>
            </div>

            {/* Transport & Recipient Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              
              {/* Recipient */}
              <div className="p-5 border-2 border-stone-950 rounded-xl space-y-2">
                <span className="text-xs font-black uppercase text-stone-500 tracking-wider block">
                  👤 DESTINATARIO:
                </span>
                <div className="text-2xl font-black text-stone-950 leading-tight">
                  {selectedSale.customerName}
                </div>
                <div className="text-lg font-black text-emerald-800 flex items-center gap-2 pt-1">
                  <Phone className="w-5 h-5 text-emerald-700" />
                  <span>+{selectedSale.customerPhone || 'Consultar WhatsApp'}</span>
                </div>
                {selectedSale.transportCompany && (
                  <div className="text-xs font-bold text-stone-600 pt-2 border-t border-stone-200">
                    Transporte / Flota:{' '}
                    <strong className="text-stone-900">{selectedSale.transportCompany}</strong>
                  </div>
                )}
              </div>

              {/* Sender */}
              <div className="p-5 border-2 border-stone-950 rounded-xl space-y-2">
                <span className="text-xs font-black uppercase text-stone-500 tracking-wider block">
                  🌾 REMITENTE:
                </span>
                <div className="text-xl font-black text-stone-950">
                  {settings.storeName}
                </div>
                <div className="text-xs font-bold text-stone-600">
                  {settings.address}
                </div>
                <div className="text-xs font-bold text-stone-800">
                  Celular Ventas / Soporte: +{settings.whatsappNumber}
                </div>
              </div>

            </div>

            {/* Parcel Contents */}
            <div className="p-4 bg-stone-100 rounded-xl border border-stone-300">
              <span className="text-xs font-black uppercase text-stone-600 block mb-1">
                Contenido del Paquete:
              </span>
              <div className="text-xs font-bold text-stone-900 space-y-0.5">
                {selectedSale.items.map((it, idx) => (
                  <div key={idx}>
                    • {it.quantity}x {it.productName} [Talla: {it.size}]
                  </div>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div className="text-center text-xs font-extrabold uppercase tracking-wide text-stone-500">
              ⚡ MANÉJESE CON CUIDADO • INDUMENTARIA AGROPECUARIA
            </div>
          </div>
        )}

        {/* 3. ACTA DE CIERRE DE CAJA DIARIO */}
        {documentType === 'cash_report' && (
          <div className="space-y-6 text-stone-900">
            {/* Header */}
            <div className="text-center pb-6 border-b-2 border-stone-900">
              <h1 className="text-2xl font-black uppercase tracking-tight">
                {settings.storeName}
              </h1>
              <h2 className="text-base font-extrabold uppercase text-stone-600 mt-0.5">
                Acta de Arqueo y Balance Financiero Diario
              </h2>
              <p className="text-xs text-stone-400 mt-1">
                Fecha del Arqueo: {cashDay.date} • Estado: {cashDay.status}
              </p>
            </div>

            {/* Financial Overview Table */}
            <div className="space-y-3 text-xs">
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                <div className="flex justify-between font-bold">
                  <span>Apertura de Caja Inicial (Efectivo):</span>
                  <span>{currency} {cashDay.initialCash.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-emerald-800">
                  <span>(+) Total Ventas en Efectivo:</span>
                  <span>+{currency} {cashDay.totalCashSales.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-sky-800">
                  <span>(+) Total Ventas por QR / Banco:</span>
                  <span>+{currency} {cashDay.totalQrSales.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-rose-700">
                  <span>(-) Salidas y Gastos en Efectivo:</span>
                  <span>-{currency} {cashDay.totalCashExpenses.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-rose-700">
                  <span>(-) Gastos pagados por QR / Banco:</span>
                  <span>-{currency} {cashDay.totalQrExpenses.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-base font-black pt-2 border-t-2 border-stone-900">
                  <span>Efectivo Esperado en Cajón:</span>
                  <span>{currency} {cashDay.expectedCashInDrawer.toLocaleString()}</span>
                </div>
                {cashDay.actualCountedCash !== undefined && (
                  <div className="flex justify-between text-base font-black text-emerald-800">
                    <span>Efectivo Físico Contado Real:</span>
                    <span>{currency} {cashDay.actualCountedCash.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Signature Area */}
            <div className="pt-16 grid grid-cols-2 gap-12 text-center text-xs">
              <div className="border-t border-stone-400 pt-2">
                <div className="font-extrabold text-stone-900">Responsable de Caja</div>
                <div className="text-[11px] text-stone-500">Rodrigo (Vendedor Mostrador)</div>
              </div>
              <div className="border-t border-stone-400 pt-2">
                <div className="font-extrabold text-stone-900">Gerencia / Auditoría</div>
                <div className="text-[11px] text-stone-500">Firma y Sello de Conformidad</div>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
