import React, { useState } from 'react';
import { MessageSquare, X, Send, ShieldCheck, Zap } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const WhatsAppFloatingWidget: React.FC = () => {
  const { settings, viewMode } = useStore();
  const [isOpen, setIsOpen] = useState(false);

  // Only show in public storefront view
  if (viewMode !== 'store') return null;

  const cleanPhone = (settings.whatsappNumber || '59178541236').replace(/\D/g, '');
  const isBrasilTheme = (settings.designTheme || 'brasil_heavy_duty') === 'brasil_heavy_duty';

  return (
    <div className="fixed bottom-6 right-6 z-40 no-print">
      
      {/* Expanded Quick Message Bubble */}
      {isOpen && (
        <div className={`mb-3 w-80 rounded-3xl shadow-2xl overflow-hidden animate-modal-pop transition-all duration-300 ${
          isBrasilTheme 
            ? 'bg-[#0e1110] text-stone-100 border-2 border-stone-800 shadow-[0_0_50px_rgba(0,0,0,0.85)]' 
            : 'bg-white text-stone-900 border border-stone-200'
        }`}>
          
          {/* Header */}
          <div 
            className={`p-4 flex items-center justify-between border-b ${
              isBrasilTheme ? 'bg-[#080a09] border-stone-800 text-white' : 'text-white'
            }`}
            style={{ backgroundColor: !isBrasilTheme ? settings.primaryColor : undefined }}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                  alt="Asesor BRK"
                  className={`w-10 h-10 rounded-full object-cover border-2 ${
                    isBrasilTheme ? 'border-[#FFE600]' : 'border-white/60'
                  }`}
                />
                <span className="w-3 h-3 bg-emerald-400 border-2 border-stone-900 rounded-full absolute bottom-0 right-0 animate-pulse" />
              </div>
              <div>
                <h4 className="font-black text-xs text-white flex items-center gap-1.5 font-heading">
                  Rodrigo V.
                  {isBrasilTheme && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-[#FFE600] text-black">
                      ⚡ BRK
                    </span>
                  )}
                </h4>
                <p className={`text-[10px] font-bold ${isBrasilTheme ? 'text-[#FFE600]' : 'text-amber-300'}`}>
                  Asesor de Campo • En Línea
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className={`p-1.5 rounded-full transition ${
                isBrasilTheme 
                  ? 'text-stone-400 hover:text-black hover:bg-[#FFE600]' 
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 space-y-3 text-xs">
            <div className={`p-3 rounded-2xl rounded-tl-none border leading-relaxed font-medium ${
              isBrasilTheme 
                ? 'bg-[#181d1b] border-stone-800 text-stone-200' 
                : 'bg-stone-100 border-stone-200 text-stone-700'
            }`}>
              🤠 ¡Hola! ¿Tienes dudas sobre tu talla en camisas UV50+ o botinas de cuero? ¿O necesitas una cotización por mayor para tu cabaña? Escríbeme y te respondo en minutos.
            </div>

            <div className={`flex items-center gap-1.5 text-[11px] font-bold ${
              isBrasilTheme ? 'text-emerald-400' : 'text-emerald-800'
            }`}>
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>1er Cambio de Talla Gratis Garantizado</span>
            </div>

            <a
              href={`https://wa.me/${cleanPhone}?text=Hola%20Rodrigo,%20estoy%20en%20la%20tienda%20online%20de%20BRK%20Agro%20y%20tengo%20una%20consulta`}
              target="_blank"
              rel="noreferrer"
              className={`w-full py-3 px-4 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition active:scale-95 ${
                isBrasilTheme 
                  ? 'bg-[#FFE600] hover:bg-[#ffe81a] text-black shadow-[0_0_20px_rgba(255,230,0,0.35)]' 
                  : 'bg-emerald-700 hover:bg-emerald-600 text-white'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Chatear por WhatsApp</span>
            </a>
          </div>

        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-95 shadow-2xl relative group ${
          isBrasilTheme 
            ? 'bg-stone-900 border-2 border-[#FFE600] text-[#FFE600] shadow-[0_0_25px_rgba(255,230,0,0.4)]' 
            : 'bg-emerald-600 hover:bg-emerald-500 text-white border-2 border-white/80'
        }`}
        title="Hablar con Asesor Técnico WhatsApp"
      >
        <span className="w-3.5 h-3.5 bg-yellow-400 border-2 border-stone-900 rounded-full absolute top-0.5 right-0.5 animate-ping" />
        <span className="w-3.5 h-3.5 bg-yellow-400 border-2 border-stone-900 rounded-full absolute top-0.5 right-0.5" />
        <MessageSquare className={`w-6 h-6 ${isBrasilTheme ? 'fill-[#FFE600]' : 'fill-white'}`} />
      </button>

    </div>
  );
};
