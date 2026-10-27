import React from 'react';
import { 
  SunMedium, 
  ShieldCheck, 
  Truck, 
  Phone, 
  MapPin, 
  CreditCard, 
  QrCode,
  Award,
  Zap,
  RotateCcw,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const Footer: React.FC = () => {
  const { settings, setViewMode } = useStore();
  const isBrasilTheme = (settings.designTheme || 'brasil_heavy_duty') === 'brasil_heavy_duty';
  const currency = isBrasilTheme ? 'Bs.' : (settings.currency || 'Bs.');

  return (
    <footer className={`pt-16 pb-12 transition-colors duration-500 no-print ${
      isBrasilTheme 
        ? 'bg-[#0a0d0c] text-stone-300 border-t-4 border-[#FFE600]' 
        : 'bg-stone-900 text-stone-300 border-t-4 border-amber-600'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Value Propositions Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b ${
          isBrasilTheme ? 'border-stone-800/80' : 'border-stone-800'
        }`}>
          
          <div className="flex items-start gap-4">
            <div className={`p-3.5 rounded-2xl shrink-0 transition-transform hover:scale-105 ${
              isBrasilTheme 
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                : 'bg-stone-800 text-amber-500'
            }`}>
              <SunMedium className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-white text-sm uppercase tracking-wider font-heading">
                Protección Solar UV50+
              </h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                Bloqueo permanente del 98% de radiación UVA/UVB homologada para jornadas extremas bajo sol.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className={`p-3.5 rounded-2xl shrink-0 transition-transform hover:scale-105 ${
              isBrasilTheme 
                ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' 
                : 'bg-stone-800 text-amber-500'
            }`}>
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-white text-sm uppercase tracking-wider font-heading">
                Garantía de Resistencia
              </h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                Costuras reforzadas triples, telas antirasgadura y cuero vacuno engrasado impermeable.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className={`p-3.5 rounded-2xl shrink-0 transition-transform hover:scale-105 ${
              isBrasilTheme 
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                : 'bg-stone-800 text-amber-500'
            }`}>
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-white text-sm uppercase tracking-wider font-heading">
                Despachos en 24 Horas
              </h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                Salidas diarias por flotas y encomiendas a Montero, Beni, Tarija, Cochabamba y todo el país.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className={`p-3.5 rounded-2xl shrink-0 transition-transform hover:scale-105 ${
              isBrasilTheme 
                ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' 
                : 'bg-stone-800 text-amber-500'
            }`}>
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-white text-sm uppercase tracking-wider font-heading">
                1er Cambio Gratis
              </h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                Si la talla no te calza perfecta, realizamos el cambio sin costo ni burocracia en 7 días.
              </p>
            </div>
          </div>

        </div>

        {/* Main Footer Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 py-12">
          
          {/* Brand & Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl font-black ${
                isBrasilTheme 
                  ? 'bg-gradient-to-br from-[#FFE600] to-amber-500 text-black shadow-md' 
                  : 'bg-emerald-700 text-white'
              }`}>
                🌾
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black text-white tracking-tight uppercase font-heading flex items-center">
                  BRK AGR<span className="text-emerald-400 font-extrabold">O🌱</span>
                </span>
                <span className={`text-[10px] font-black tracking-widest uppercase ${
                  isBrasilTheme ? 'text-yellow-400' : 'text-amber-500'
                }`}>
                  {isBrasilTheme ? 'WORKWEAR & PERFORMANCE' : 'INDUMENTARIA & CALZADO COUNTRY'}
                </span>
              </div>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed font-medium">
              Especialistas en indumentaria técnica, camisas de protección solar FPU 50+, botinas de cuero legítimo y jeans reforzados para el trabajo pesado en el campo, la ganadería y la industria.
            </p>

            <div className="flex items-center gap-2 pt-1">
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                isBrasilTheme 
                  ? 'bg-stone-900 text-yellow-400 border-yellow-400/40' 
                  : 'bg-stone-800 text-amber-400 border-amber-500/30'
              }`}>
                {isBrasilTheme ? '⚡ Línea Pesada Brasil Oficial' : '🌾 Línea Tradicional Bolivia'}
              </span>
            </div>
          </div>

          {/* Contact & Dispatch */}
          <div>
            <h4 className="text-white font-extrabold text-xs uppercase tracking-wider mb-4 font-heading flex items-center gap-2">
              <MapPin className={`w-4 h-4 ${isBrasilTheme ? 'text-yellow-400' : 'text-amber-500'}`} />
              <span>Puntos de Atención & Encomiendas</span>
            </h4>
            <ul className="space-y-3 text-xs text-stone-400">
              <li className="flex items-start gap-2.5">
                <span className="text-white font-bold shrink-0">📍 Showroom:</span>
                <span>{settings.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="text-white font-bold shrink-0">📱 WhatsApp:</span>
                <span className="text-emerald-400 font-black font-mono">+{settings.whatsappNumber}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="text-white font-bold shrink-0">🚚 Salidas:</span>
                <span>Lunes a Sábado a todas las provincias</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="text-white font-bold shrink-0">🛡️ Taller:</span>
                <span>Control de calidad y bordados computarizados</span>
              </li>
            </ul>
          </div>

          {/* Payment & Security */}
          <div>
            <h4 className="text-white font-extrabold text-xs uppercase tracking-wider mb-4 font-heading flex items-center gap-2">
              <CreditCard className={`w-4 h-4 ${isBrasilTheme ? 'text-yellow-400' : 'text-amber-500'}`} />
              <span>Medios de Pago Seguros</span>
            </h4>
            <p className="text-xs text-stone-400 mb-4 leading-relaxed">
              Aceptamos pagos por transferencia QR inmediata con confirmación en vivo, efectivo en tienda física y despacho contra entrega coordinada.
            </p>
            
            <div className="flex flex-wrap gap-2 text-[11px] font-bold">
              <span className="px-2.5 py-1 rounded-lg bg-stone-800/90 text-stone-300 border border-stone-700 flex items-center gap-1.5">
                <QrCode className="w-3.5 h-3.5 text-emerald-400" />
                <span>QR Simple</span>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-stone-800/90 text-stone-300 border border-stone-700">
                Banco Ganadero
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-stone-800/90 text-stone-300 border border-stone-700">
                Banco Unión
              </span>
            </div>

            {/* Quick Link to ERP Admin */}
            <div className="pt-5 mt-5 border-t border-stone-800/80">
              <button
                onClick={() => setViewMode('admin')}
                className={`text-xs font-black flex items-center gap-1.5 transition ${
                  isBrasilTheme ? 'text-yellow-400 hover:text-yellow-300' : 'text-amber-400 hover:text-amber-300'
                }`}
              >
                <span>Acceso al Panel ERP de Gestión ➔</span>
              </button>
            </div>

          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            © {new Date().getFullYear()} {settings.storeName}. Todos los derechos reservados.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Garantía de Fábrica</span>
            <span>•</span>
            <span>Términos de Encomienda</span>
            <span>•</span>
            <span>Guía de Tallas</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
