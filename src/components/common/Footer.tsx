import React from 'react';
import { 
  SunMedium, 
  ShieldCheck, 
  Truck, 
  Phone, 
  MapPin, 
  CreditCard, 
  QrCode,
  Award
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const Footer: React.FC = () => {
  const { settings, setViewMode } = useStore();

  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t-4 border-amber-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Value Propositions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-stone-800">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-stone-800 text-amber-500 shrink-0">
              <SunMedium className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">Protección Solar UV50+</h4>
              <p className="text-xs text-stone-400 mt-1">
                Bloquea el 98% de los rayos ultravioleta dañinos en largas jornadas de sol y campo.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-stone-800 text-amber-500 shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">Cuero Vacuno Genuino</h4>
              <p className="text-xs text-stone-400 mt-1">
                Botinas confeccionadas en cuero engrasado legítimo de máxima durabilidad y confort.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-stone-800 text-amber-500 shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">Envíos a Todo el País</h4>
              <p className="text-xs text-stone-400 mt-1">
                Despachos diarios por flotas y expresos a Montero, Beni, Cochabamba, Tarija y más.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-stone-800 text-amber-500 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">1er Cambio de Talla Gratis</h4>
              <p className="text-xs text-stone-400 mt-1">
                Si no te queda como esperabas, cambiamos tu prenda sin costo adicional.
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 py-12">
          
          {/* Brand & Description */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">🌾</span>
              <span className="text-xl font-black text-white tracking-wider uppercase">
                {settings.storeName}
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed mb-4">
              Especialistas en indumentaria técnica y calzado de alto rendimiento para el sector agropecuario, ganadero e industrial. Diseñado para resistir la rudeza del campo con el máximo estilo country.
            </p>
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded bg-stone-800 text-amber-400 text-xs font-semibold">
                Inspirado en la tecnología BRK Agro
              </span>
            </div>
          </div>

          {/* Contact & Location */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
              Atención y Despachos
            </h4>
            <ul className="space-y-3 text-xs text-stone-400">
              <li className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                <span>{settings.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>WhatsApp de Ventas: +{settings.whatsappNumber}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-sky-500 shrink-0" />
                <span>Despachos: Lunes a Sábado hasta las 18:00</span>
              </li>
            </ul>
          </div>

          {/* Payment & Security */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
              Métodos de Pago Aceptados
            </h4>
            <div className="space-y-2 text-xs text-stone-400">
              <div className="flex items-center gap-2 bg-stone-800/80 p-2.5 rounded-lg border border-stone-700">
                <QrCode className="w-5 h-5 text-emerald-400" />
                <span>Cobro por QR Simple (Todos los Bancos de Bolivia)</span>
              </div>
              <div className="flex items-center gap-2 bg-stone-800/80 p-2.5 rounded-lg border border-stone-700">
                <CreditCard className="w-5 h-5 text-sky-400" />
                <span>Transferencia Bancaria & Pago Contra-entrega</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-800 flex items-center justify-between">
              <button
                onClick={() => setViewMode('admin')}
                className="text-xs text-stone-400 hover:text-amber-400 underline transition"
              >
                Acceso Administrativo ERP
              </button>
              <span className="text-xs text-stone-500">v1.0.0 White-Label</span>
            </div>
          </div>

        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-stone-800 text-center text-xs text-stone-500">
          <p>© {new Date().getFullYear()} {settings.storeName}. Todos los derechos reservados. Indumentaria agropecuaria de alta tecnología.</p>
        </div>

      </div>
    </footer>
  );
};
