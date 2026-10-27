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

  const isBrasilTheme = (settings.designTheme || 'brasil_heavy_duty') === 'brasil_heavy_duty';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md animate-fade-in">
      <div className={`rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative animate-modal-pop transition-all duration-300 ${
        isBrasilTheme 
          ? 'bg-[#0e1110] text-stone-100 border-2 border-stone-800 shadow-[0_0_60px_rgba(0,0,0,0.85)]' 
          : 'bg-white text-stone-900 border border-stone-200'
      }`}>
        
        {/* Header */}
        <div 
          className={`p-5 flex items-center justify-between border-b ${
            isBrasilTheme ? 'bg-[#080a09] border-stone-800 text-white' : 'text-white'
          }`}
          style={{ backgroundColor: !isBrasilTheme ? settings.primaryColor : undefined }}
        >
          <div className="flex items-center gap-2.5">
            <Ruler className={`w-6 h-6 ${isBrasilTheme ? 'text-[#FFE600]' : 'text-amber-300'}`} />
            <div>
              <h3 className="font-black text-lg text-white font-heading">Calculadora de Talla BRK</h3>
              <p className={`text-xs ${isBrasilTheme ? 'text-stone-400' : 'text-stone-200'}`}>
                Horma original agropecuaria para trabajo y campo
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className={`p-1.5 rounded-full transition ${
              isBrasilTheme 
                ? 'text-stone-400 hover:text-black hover:bg-[#FFE600]' 
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className={`flex border-b ${
          isBrasilTheme ? 'border-stone-800 bg-[#151918]' : 'border-stone-200 bg-stone-50'
        }`}>
          <button
            onClick={() => setActiveTab('shirts')}
            className={`flex-1 py-3 text-xs md:text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition ${
              activeTab === 'shirts'
                ? isBrasilTheme
                  ? 'border-[#FFE600] text-[#FFE600] bg-[#1a1f1d]'
                  : 'border-amber-600 text-stone-900 bg-white'
                : isBrasilTheme
                ? 'border-transparent text-stone-400 hover:text-white'
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
                ? isBrasilTheme
                  ? 'border-[#FFE600] text-[#FFE600] bg-[#1a1f1d]'
                  : 'border-amber-600 text-stone-900 bg-white'
                : isBrasilTheme
                ? 'border-transparent text-stone-400 hover:text-white'
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
                <label className={`text-xs font-bold uppercase tracking-wide block mb-2 ${
                  isBrasilTheme ? 'text-stone-300' : 'text-stone-700'
                }`}>
                  Línea de Confección
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setGender('Hombre')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                      gender === 'Hombre'
                        ? isBrasilTheme
                          ? 'border-[#FFE600] bg-yellow-400/10 text-[#FFE600]'
                          : 'border-emerald-700 bg-emerald-50 text-emerald-900'
                        : isBrasilTheme
                        ? 'border-stone-800 text-stone-400 hover:bg-stone-900'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    Hombre (Corte Clásico Campo)
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('Mujer')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                      gender === 'Mujer'
                        ? isBrasilTheme
                          ? 'border-pink-500 bg-pink-500/10 text-pink-400'
                          : 'border-pink-600 bg-pink-50 text-pink-900'
                        : isBrasilTheme
                        ? 'border-stone-800 text-stone-400 hover:bg-stone-900'
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
                  <div className={`flex justify-between text-xs font-bold mb-1 ${
                    isBrasilTheme ? 'text-stone-300' : 'text-stone-700'
                  }`}>
                    <span>Tu Estatura:</span>
                    <span className={`font-black ${isBrasilTheme ? 'text-[#FFE600]' : 'text-emerald-700'}`}>
                      {height} cm
                    </span>
                  </div>
                  <input
                    type="range"
                    min="145"
                    max="205"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className={`w-full cursor-pointer ${isBrasilTheme ? 'accent-yellow-400' : 'accent-emerald-700'}`}
                  />
                  <div className={`flex justify-between text-[10px] ${isBrasilTheme ? 'text-stone-500' : 'text-stone-400'}`}>
                    <span>145 cm</span>
                    <span>175 cm</span>
                    <span>205 cm</span>
                  </div>
                </div>

                <div>
                  <div className={`flex justify-between text-xs font-bold mb-1 ${
                    isBrasilTheme ? 'text-stone-300' : 'text-stone-700'
                  }`}>
                    <span>Tu Peso:</span>
                    <span className={`font-black ${isBrasilTheme ? 'text-[#FFE600]' : 'text-emerald-700'}`}>
                      {weight} kg
                    </span>
                  </div>
                  <input
                    type="range"
                    min="45"
                    max="135"
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className={`w-full cursor-pointer ${isBrasilTheme ? 'accent-yellow-400' : 'accent-emerald-700'}`}
                  />
                  <div className={`flex justify-between text-[10px] ${isBrasilTheme ? 'text-stone-500' : 'text-stone-400'}`}>
                    <span>45 kg</span>
                    <span>85 kg</span>
                    <span>135 kg</span>
                  </div>
                </div>
              </div>

              {/* Recommendation Card */}
              <div className={`p-4 rounded-2xl border flex items-center gap-4 ${
                isBrasilTheme 
                  ? 'bg-[#181d1b] border-stone-700 shadow-lg' 
                  : 'bg-amber-50 border-amber-200'
              }`}>
                <div className={`w-16 h-16 rounded-2xl font-black text-2xl flex items-center justify-center shrink-0 shadow-md ${
                  isBrasilTheme 
                    ? 'bg-[#FFE600] text-black shadow-[0_0_20px_rgba(255,230,0,0.3)]' 
                    : 'bg-amber-500 text-stone-900'
                }`}>
                  {shirtRec.size}
                </div>
                <div>
                  <div className={`flex items-center gap-1 font-bold text-xs ${
                    isBrasilTheme ? 'text-[#FFE600]' : 'text-emerald-800'
                  }`}>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Talla Recomendada BRK</span>
                  </div>
                  <div className={`font-black text-sm mt-0.5 ${
                    isBrasilTheme ? 'text-white' : 'text-stone-800'
                  }`}>
                    Talla {shirtRec.size} ({shirtRec.desc})
                  </div>
                  <p className={`text-[11px] mt-0.5 leading-relaxed ${
                    isBrasilTheme ? 'text-stone-400' : 'text-stone-500'
                  }`}>
                    El tejido Dry-Fit con Spandex cede ligeramente para no limitar tus movimientos al montar o trabajar.
                  </p>
                </div>
              </div>

            </div>
          ) : (
            <div className="space-y-5">
              
              <p className={`text-xs leading-relaxed ${isBrasilTheme ? 'text-stone-300' : 'text-stone-600'}`}>
                Coloca tu pie descalzo sobre una hoja de papel, marca desde el talón hasta la punta del dedo más largo y mide los centímetros con una regla:
              </p>

              <div>
                <div className={`flex justify-between text-xs font-bold mb-1 ${
                  isBrasilTheme ? 'text-stone-300' : 'text-stone-700'
                }`}>
                  <span>Largo de tu pie:</span>
                  <span className={`font-black ${isBrasilTheme ? 'text-[#FFE600]' : 'text-emerald-700'}`}>
                    {footCm.toFixed(1)} cm
                  </span>
                </div>
                <input
                  type="range"
                  min="24.0"
                  max="30.0"
                  step="0.5"
                  value={footCm}
                  onChange={(e) => setFootCm(Number(e.target.value))}
                  className={`w-full cursor-pointer ${isBrasilTheme ? 'accent-yellow-400' : 'accent-amber-600'}`}
                />
                <div className={`flex justify-between text-[10px] ${isBrasilTheme ? 'text-stone-500' : 'text-stone-400'}`}>
                  <span>24 cm (Talla 37)</span>
                  <span>27 cm (Talla 41)</span>
                  <span>30 cm (Talla 44)</span>
                </div>
              </div>

              {/* Recommendation Card */}
              <div className={`p-4 rounded-2xl border flex items-center gap-4 ${
                isBrasilTheme 
                  ? 'bg-[#181d1b] border-stone-700 shadow-lg' 
                  : 'bg-stone-100 border-stone-300'
              }`}>
                <div className={`w-16 h-16 rounded-2xl font-black text-2xl flex items-center justify-center shrink-0 shadow-md ${
                  isBrasilTheme 
                    ? 'bg-[#FFE600] text-black shadow-[0_0_20px_rgba(255,230,0,0.3)]' 
                    : 'bg-stone-900 text-amber-400'
                }`}>
                  {bootRec}
                </div>
                <div>
                  <div className={`flex items-center gap-1 font-bold text-xs ${
                    isBrasilTheme ? 'text-[#FFE600]' : 'text-emerald-700'
                  }`}>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Calzado Recomendado</span>
                  </div>
                  <div className={`font-black text-sm mt-0.5 ${
                    isBrasilTheme ? 'text-white' : 'text-stone-800'
                  }`}>
                    Numeración {bootRec} de Horma BRK Agro
                  </div>
                  <p className={`text-[11px] mt-0.5 leading-relaxed ${
                    isBrasilTheme ? 'text-stone-400' : 'text-stone-500'
                  }`}>
                    Nuestras botinas tienen horma confortable con elásticos laterales dobles y suela tractorada cosida.
                  </p>
                </div>
              </div>

              {/* Guarantee callout */}
              <div className={`rounded-xl p-3 text-xs flex items-center gap-2 border ${
                isBrasilTheme 
                  ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300' 
                  : 'bg-emerald-50 border-emerald-200 text-emerald-800'
              }`}>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  <strong>Garantía de Satisfacción:</strong> Tu 1er cambio de talla es 100% gratuito si necesitas otra medida al recibir tu par.
                </span>
              </div>

            </div>
          )}

          <div className="mt-6">
            <button
              onClick={onClose}
              className={`w-full py-3 rounded-xl font-black text-xs uppercase tracking-wider shadow-lg transition active:scale-95 ${
                isBrasilTheme 
                  ? 'bg-[#FFE600] hover:bg-[#ffe81a] text-black shadow-[0_0_20px_rgba(255,230,0,0.3)]' 
                  : 'text-white'
              }`}
              style={{ backgroundColor: !isBrasilTheme ? settings.primaryColor : undefined }}
            >
              ¡Entendido, volver a las prendas!
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
