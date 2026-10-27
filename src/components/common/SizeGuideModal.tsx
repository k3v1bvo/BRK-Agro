import React, { useState } from 'react';
import { X, Ruler, CheckCircle2, Footprints, Shirt } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose }) => {
  const { settings } = useStore();
  const [activeTab, setActiveTab] = useState<'shirts' | 'boots'>('shirts');

  // Shirt calculator state
  const [gender, setGender] = useState<'Hombre' | 'Mujer'>('Hombre');
  const [height, setHeight] = useState<number>(175);
  const [weight, setWeight] = useState<number>(78);

  // Boots calculator state
  const [footCm, setFootCm] = useState<number>(27);

  if (!isOpen) return null;

  // Calculate recommended shirt size
  const getRecommendedShirtSize = () => {
    const bmi = weight / Math.pow(height / 100, 2);
    if (gender === 'Mujer') {
      if (weight < 50 || bmi < 19) return { size: 'PP', desc: 'Ajuste entallado fino' };
      if (weight < 58 || bmi < 22) return { size: 'P', desc: 'Ajuste regular cómodo' };
      if (weight < 68 || bmi < 25) return { size: 'M', desc: 'Ajuste ideal confort' };
      if (weight < 78 || bmi < 28) return { size: 'G', desc: 'Ajuste holgado para movimiento' };
      return { size: 'GG', desc: 'Ajuste extra holgado' };
    } else {
      // Hombre
      if (weight < 65 || bmi < 21) return { size: 'P/S', desc: 'Para complexión delgada' };
      if (weight < 76 || bmi < 24.5) return { size: 'M', desc: 'Ajuste estándar BRK más popular' };
      if (weight < 88 || bmi < 28) return { size: 'G/L', desc: 'Recomendado para complexión atlética o espalda ancha' };
      if (weight < 100 || bmi < 31) return { size: 'GG/XL', desc: 'Corte amplio y holgado' };
      return { size: 'XGG', desc: 'Máxima amplitud de movimiento' };
    }
  };

  // Calculate recommended boot size
  const getRecommendedBootSize = () => {
    if (footCm <= 25.2) return '38';
    if (footCm <= 26.0) return '39';
    if (footCm <= 26.8) return '40';
    if (footCm <= 27.5) return '41';
    if (footCm <= 28.3) return '42';
    return '43';
  };

  const shirtRec = getRecommendedShirtSize();
  const bootRec = getRecommendedBootSize();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200">
        
        {/* Header */}
        <div 
          className="p-5 text-white flex items-center justify-between"
          style={{ backgroundColor: settings.primaryColor }}
        >
          <div className="flex items-center gap-2.5">
            <Ruler className="w-6 h-6 text-amber-300" />
            <div>
              <h3 className="font-extrabold text-lg text-white">Calculadora de Talla BRK</h3>
              <p className="text-xs text-stone-200">Horma original agropecuaria para campo</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-stone-200 bg-stone-50">
          <button
            onClick={() => setActiveTab('shirts')}
            className={`flex-1 py-3 text-xs md:text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition ${
              activeTab === 'shirts'
                ? 'border-amber-600 text-stone-900 bg-white'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Shirt className="w-4 h-4" />
            <span>Camisas UV50+</span>
          </button>
          <button
            onClick={() => setActiveTab('boots')}
            className={`flex-1 py-3 text-xs md:text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition ${
              activeTab === 'boots'
                ? 'border-amber-600 text-stone-900 bg-white'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Footprints className="w-4 h-4" />
            <span>Botinas de Cuero</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'shirts' ? (
            <div className="space-y-5">
              
              {/* Gender selector */}
              <div>
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wide block mb-2">
                  Línea de Confección
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setGender('Hombre')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition ${
                      gender === 'Hombre'
                        ? 'border-emerald-700 bg-emerald-50 text-emerald-900'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    Hombre (Corte Clásico Campo)
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('Mujer')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition ${
                      gender === 'Mujer'
                        ? 'border-pink-600 bg-pink-50 text-pink-900'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    Mujer (Corte Entallado Country)
                  </button>
                </div>
              </div>

              {/* Sliders */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-bold text-stone-700 mb-1">
                    <span>Tu Estatura:</span>
                    <span className="text-emerald-700 font-extrabold">{height} cm</span>
                  </div>
                  <input
                    type="range"
                    min="145"
                    max="205"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="w-full accent-emerald-700 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-stone-400">
                    <span>145 cm</span>
                    <span>175 cm</span>
                    <span>205 cm</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-stone-700 mb-1">
                    <span>Tu Peso:</span>
                    <span className="text-emerald-700 font-extrabold">{weight} kg</span>
                  </div>
                  <input
                    type="range"
                    min="45"
                    max="135"
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="w-full accent-emerald-700 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-stone-400">
                    <span>45 kg</span>
                    <span>85 kg</span>
                    <span>135 kg</span>
                  </div>
                </div>
              </div>

              {/* Recommendation Card */}
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-amber-500 text-stone-900 font-black text-2xl flex items-center justify-center shrink-0 shadow">
                  {shirtRec.size}
                </div>
                <div>
                  <div className="flex items-center gap-1 text-emerald-800 font-bold text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Talla Recomendada BRK</span>
                  </div>
                  <div className="text-stone-800 font-extrabold text-sm mt-0.5">
                    Talla {shirtRec.size} ({shirtRec.desc})
                  </div>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    El tejido Dry-Fit con Spandex cede ligeramente para no limitar tus movimientos al montar o trabajar.
                  </p>
                </div>
              </div>

            </div>
          ) : (
            <div className="space-y-5">
              
              <p className="text-xs text-stone-600 leading-relaxed">
                Coloca tu pie descalzo sobre una hoja de papel, marca desde el talón hasta la punta del dedo más largo y mide los centímetros con una regla:
              </p>

              <div>
                <div className="flex justify-between text-xs font-bold text-stone-700 mb-1">
                  <span>Largo de tu pie:</span>
                  <span className="text-emerald-700 font-extrabold">{footCm.toFixed(1)} cm</span>
                </div>
                <input
                  type="range"
                  min="24.0"
                  max="30.0"
                  step="0.5"
                  value={footCm}
                  onChange={(e) => setFootCm(Number(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-stone-400">
                  <span>24 cm (Talla 37)</span>
                  <span>27 cm (Talla 41)</span>
                  <span>30 cm (Talla 44)</span>
                </div>
              </div>

              {/* Recommendation Card */}
              <div className="p-4 rounded-xl bg-stone-100 border border-stone-300 flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-stone-900 text-amber-400 font-black text-2xl flex items-center justify-center shrink-0 shadow">
                  {bootRec}
                </div>
                <div>
                  <div className="flex items-center gap-1 text-emerald-700 font-bold text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Calzado Recomendado</span>
                  </div>
                  <div className="text-stone-800 font-extrabold text-sm mt-0.5">
                    Numeración {bootRec} de Horma BRK Agro
                  </div>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    Nuestras botinas tienen horma normal/confortable con elásticos laterales dobles.
                  </p>
                </div>
              </div>

              {/* Guarantee callout */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>Garantía de Satisfacción:</strong> Tu 1er cambio de talla es 100% gratuito si necesitas otra medida al recibir tu par.
                </span>
              </div>

            </div>
          )}

          <div className="mt-6">
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white shadow transition"
              style={{ backgroundColor: settings.primaryColor }}
            >
              ¡Entendido, volver a las prendas!
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
