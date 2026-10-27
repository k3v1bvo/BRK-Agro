import React, { useState } from 'react';
import { MessageSquare, X, Send, Sparkles, ShieldCheck } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const WhatsAppFloatingWidget: React.FC = () => {
  const { settings, viewMode } = useStore();
  const [isOpen, setIsOpen] = useState(false);

  // Only show in public storefront view
  if (viewMode !== 'store') return null;

  const cleanPhone = (settings.whatsappNumber || '59178541236').replace(/\D/g, '');

  return (
    <div className="fixed bottom-6 right-6 z-40 no-print">
      
      {/* Expanded Quick Message Bubble */}
      {isOpen && (
        <div className="mb-3 w-80 bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden animate-fade-in text-stone-900">
          
          {/* Header */}
          <div 
            className="p-4 text-white flex items-center justify-between"
            style={{ backgroundColor: settings.primaryColor }}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                  alt="Asesor BRK"
                  className="w-10 h-10 rounded-full object-cover border-2 border-white/60"
                />
                <span className="w-3 h-3 bg-emerald-400 border-2 border-stone-900 rounded-full absolute bottom-0 right-0 animate-pulse" />
              </div>
              <div>
                <h4 className="font-extrabold text-xs text-white">Rodrigo V.</h4>
                <p className="text-[10px] text-amber-300 font-bold">Asesor de Campo • BRK Agro</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 space-y-3 text-xs">
            <div className="p-3 bg-stone-100 rounded-2xl rounded-tl-none border border-stone-200 text-stone-700 leading-relaxed font-medium">
              🤠 ¡Hola! ¿Tienes dudas sobre tu talla en camisas UV50+ o botinas de cuero? ¿O necesitas una cotización por mayor para tu cabaña? Escríbeme y te respondo en minutos.
            </div>

            <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-800">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>1er Cambio de Talla Gratis Garantizado</span>
            </div>

            <a
              href={`https://wa.me/${cleanPhone}?text=Hola%20Rodrigo,%20estoy%20en%20la%20tienda%20online%20de%20BRK%20Agro%20y%20tengo%20una%20consulta`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 px-4 rounded-xl font-black text-xs uppercase tracking-wider text-white shadow-md flex items-center justify-center gap-2 hover:opacity-95 transition bg-emerald-700"
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
        className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-2xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95 border-2 border-white/80 relative group"
        title="Hablar con Asesor Técnico WhatsApp"
      >
        <span className="w-3.5 h-3.5 bg-amber-400 border-2 border-stone-900 rounded-full absolute top-0.5 right-0.5 animate-ping" />
        <span className="w-3.5 h-3.5 bg-amber-400 border-2 border-stone-900 rounded-full absolute top-0.5 right-0.5" />
        <MessageSquare className="w-6 h-6 fill-white" />
      </button>

    </div>
  );
};
