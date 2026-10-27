import React, { useState } from 'react';
import { 
  Palette, 
  Store, 
  Phone, 
  DollarSign, 
  RotateCcw, 
  Trash2, 
  Database, 
  CheckCircle2, 
  Sparkles,
  Key,
  MapPin,
  FileCode
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { isSupabaseConfigured } from '../../services/storage';

export const BrandSettingsTab: React.FC = () => {
  const { settings, updateSettings, resetToDemo, clearAll } = useStore();

  const [designTheme, setDesignTheme] = useState<'brasil_heavy_duty' | 'bolivia_country'>(
    settings.designTheme || 'brasil_heavy_duty'
  );
  const [storeName, setStoreName] = useState(settings.storeName);
  const [slogan, setSlogan] = useState(settings.slogan);
  const [announcementBar, setAnnouncementBar] = useState(settings.announcementBar);
  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsappNumber);
  const [currency, setCurrency] = useState(settings.currency);
  const [primaryColor, setPrimaryColor] = useState(settings.primaryColor);
  const [accentColor, setAccentColor] = useState(settings.accentColor);
  const [imgbbApiKey, setImgbbApiKey] = useState(settings.imgbbApiKey || '');
  const [address, setAddress] = useState(settings.address);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Theme presets
  const colorPresets = [
    { name: 'Verde BRK Agro (Oficial)', primary: '#0B4F26', accent: '#D97706' },
    { name: 'Azul Safari Petróleo', primary: '#0D3B52', accent: '#EAB308' },
    { name: 'Terracota Campo & Rodeo', primary: '#9E3D1B', accent: '#F59E0B' },
    { name: 'Negro & Dorado Country', primary: '#18181B', accent: '#EAB308' },
    { name: 'Verde Oliva Ganadero', primary: '#365314', accent: '#D97706' },
  ];

  const handleThemeChange = (theme: 'brasil_heavy_duty' | 'bolivia_country') => {
    setDesignTheme(theme);
    updateSettings({ designTheme: theme });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleApplyPreset = (preset: { primary: string; accent: string }) => {
    setPrimaryColor(preset.primary);
    setAccentColor(preset.accent);
    updateSettings({ primaryColor: preset.primary, accentColor: preset.accent });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      storeName: storeName.trim(),
      slogan: slogan.trim(),
      announcementBar: announcementBar.trim(),
      whatsappNumber: whatsappNumber.trim(),
      currency,
      primaryColor,
      accentColor,
      designTheme,
      imgbbApiKey: imgbbApiKey.trim() || undefined,
      address: address.trim(),
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const isCloudConnected = isSupabaseConfigured();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-100 text-amber-800 rounded-xl">
            <Palette className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-stone-900">
              Personalización de Marca en Vivo (White-Label)
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Cambia el estilo visual, colores, WhatsApp y datos de negocio frente al cliente en tiempo real.
            </p>
          </div>
        </div>

        {savedSuccess && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>¡Configuración y estilo visual actualizados en tiempo real!</span>
          </div>
        )}
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSaveSettings} className="space-y-6">
        
        {/* Visual Design Style Selector (Both Options) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-stone-900 uppercase tracking-wide flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Estilo Visual del Storefront (Demostración al Cliente)</span>
            </h3>
            <span className="text-[11px] font-bold text-stone-500">2 Diseños Disponibles</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Design 1: BRK Agro Brasil Heavy Duty */}
            <div
              onClick={() => handleThemeChange('brasil_heavy_duty')}
              className={`p-5 rounded-2xl border-2 text-left cursor-pointer transition relative flex flex-col justify-between ${
                designTheme === 'brasil_heavy_duty'
                  ? 'border-yellow-400 bg-stone-950 text-white shadow-xl ring-2 ring-yellow-400/50'
                  : 'border-stone-200 hover:border-stone-400 bg-stone-900 text-stone-300 opacity-80'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-[#FFE600] text-black">
                    ⚡ Diseño 1: BRK Brasil
                  </span>
                  {designTheme === 'brasil_heavy_duty' && (
                    <span className="text-xs text-yellow-400 font-extrabold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Activo
                    </span>
                  )}
                </div>
                <h4 className="text-base font-black text-white font-heading">
                  Dark Charcoal & Yellow Heavy-Duty
                </h4>
                <p className="text-xs text-stone-300 mt-1 leading-relaxed">
                  Fondo concreto carbón (`#0e1110`), acentos amarillo industrial (`#FFE600`) y verde. Incluye "A FORÇA DO TRABALHO NO CAMPO", Stories/Reels interactivo "Gente do Campo", 3 insignias blindadas y sección "Os Preferidos de Quem Pega Pesado".
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-800 flex items-center justify-between text-[11px] font-bold">
                <span className="text-yellow-400">Reels TikTok/Insta • 3 Badges</span>
                <span className="text-stone-400">R$ 9,90 Frete Fixo</span>
              </div>
            </div>

            {/* Design 2: BRK Agro Bolivia Country */}
            <div
              onClick={() => handleThemeChange('bolivia_country')}
              className={`p-5 rounded-2xl border-2 text-left cursor-pointer transition relative flex flex-col justify-between ${
                designTheme === 'bolivia_country'
                  ? 'border-emerald-600 bg-emerald-950 text-white shadow-xl ring-2 ring-emerald-500/50'
                  : 'border-stone-200 hover:border-stone-400 bg-stone-50 text-stone-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-700 text-white">
                    🌾 Diseño 2: BRK Bolivia
                  </span>
                  {designTheme === 'bolivia_country' && (
                    <span className="text-xs text-emerald-400 font-extrabold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Activo
                    </span>
                  )}
                </div>
                <h4 className="text-base font-black text-stone-900 font-heading">
                  Western Country & Cuero Legítimo
                </h4>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  Estilo sobrio para el mercado boliviano y ganadero tradicional. Lookbook visual, catálogo segmentado (Camisas, Botinas, Jeans 14.5oz, Niños), cotizador de encomiendas por flota y personalización con logo bordado.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-200 flex items-center justify-between text-[11px] font-bold text-stone-600">
                <span>Catálogo Completo • Filtros</span>
                <span>Envíos Nacionales</span>
              </div>
            </div>

          </div>
        </div>

        {/* Color Theme Selector */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 space-y-4">
          <h3 className="text-sm font-extrabold text-stone-900 uppercase tracking-wide flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Paleta de Colores de la Marca (Tema Dinámico)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {colorPresets.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition ${
                  primaryColor === preset.primary
                    ? 'border-stone-900 bg-stone-50 ring-2 ring-stone-900 shadow-sm'
                    : 'border-stone-200 hover:border-stone-400 bg-white'
                }`}
              >
                <div>
                  <div className="text-xs font-black text-stone-900">{preset.name}</div>
                  <div className="text-[10px] text-stone-500 font-mono mt-0.5">
                    {preset.primary} • {preset.accent}
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <div 
                    className="w-5 h-5 rounded-full border border-stone-300 shadow-sm"
                    style={{ backgroundColor: preset.primary }}
                  />
                  <div 
                    className="w-4 h-4 rounded-full border border-stone-300 shadow-sm"
                    style={{ backgroundColor: preset.accent }}
                  />
                </div>
              </button>
            ))}
          </div>

          {/* Custom Color Pickers */}
          <div className="pt-3 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-stone-700 uppercase mb-1">
                Color Primario Personalizado:
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer border border-stone-300 p-0.5"
                />
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-32 p-2 rounded-lg border border-stone-300 font-mono font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-stone-700 uppercase mb-1">
                Color Secundario / Acento:
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer border border-stone-300 p-0.5"
                />
                <input
                  type="text"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-32 p-2 rounded-lg border border-stone-300 font-mono font-bold"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Brand Information */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 space-y-4 text-xs">
          <h3 className="text-sm font-extrabold text-stone-900 uppercase tracking-wide flex items-center gap-2">
            <Store className="w-4 h-4 text-amber-500" />
            <span>Identidad del Negocio</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-stone-700 uppercase mb-1">
                Nombre de la Tienda / Negocio:
              </label>
              <input
                type="text"
                required
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300 font-black text-sm"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 uppercase mb-1">
                Moneda del Sistema:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Bs.', '$', 'R$'] as const).map((curr) => (
                  <button
                    key={curr}
                    type="button"
                    onClick={() => setCurrency(curr)}
                    className={`py-2 px-3 rounded-xl font-black text-xs border text-center transition ${
                      currency === curr
                        ? 'bg-stone-900 text-amber-400 border-stone-900 shadow'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {curr}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block font-bold text-stone-700 uppercase mb-1">
              Slogan / Subtítulo de Cabecera:
            </label>
            <input
              type="text"
              value={slogan}
              onChange={(e) => setSlogan(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-stone-300"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-700 uppercase mb-1">
              Mensaje del Banner Superior de Anuncios:
            </label>
            <input
              type="text"
              value={announcementBar}
              onChange={(e) => setAnnouncementBar(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-stone-300 font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-stone-700 uppercase mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                Número WhatsApp para Recibir Pedidos:
              </label>
              <input
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300 font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 uppercase mb-1 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-amber-600" />
                API Key de ImgBB (Opcional):
              </label>
              <input
                type="text"
                placeholder="Pega tu clave gratuita de https://api.imgbb.com"
                value={imgbbApiKey}
                onChange={(e) => setImgbbApiKey(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-stone-700 uppercase mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-stone-400" />
              Dirección Física / Ubicación:
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-stone-300"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl font-black text-xs uppercase tracking-wider text-white shadow-lg transition hover:opacity-95"
              style={{ backgroundColor: primaryColor }}
            >
              Guardar y Aplicar Cambios de Marca
            </button>
          </div>
        </div>

      </form>

      {/* Cloud & Database Status Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 space-y-4">
        <h3 className="text-sm font-extrabold text-stone-900 uppercase tracking-wide flex items-center gap-2">
          <Database className="w-4 h-4 text-emerald-600" />
          <span>Arquitectura Híbrida: Supabase Ready + Local Fallback</span>
        </h3>

        <div className={`p-4 rounded-xl border flex items-center justify-between text-xs ${
          isCloudConnected 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
            : 'bg-stone-50 border-stone-200 text-stone-700'
        }`}>
          <div>
            <div className="font-black text-sm flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isCloudConnected ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
              {isCloudConnected ? 'Conectado a la Base de Datos Supabase en la Nube' : 'Modo Demostración Activo (Persistencia en LocalStorage)'}
            </div>
            <p className="text-[11px] text-stone-500 mt-1">
              {isCloudConnected 
                ? 'Todos los cambios se están sincronizando con la nube en tiempo real.'
                : 'El sistema funciona 100% interactivo de forma local sin requerir credenciales inmediatas para la reunión de venta.'}
            </p>
          </div>
          <span className="font-extrabold uppercase text-[10px] bg-white px-2 py-1 rounded shadow-sm border border-stone-200">
            {isCloudConnected ? 'Cloud Active' : 'Offline Mode'}
          </span>
        </div>

        <div className="p-3 bg-stone-100 rounded-xl text-stone-600 text-[11px] flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-bold">
            <FileCode className="w-4 h-4 text-amber-600" />
            Script SQL Listo para Producción: <code>supabase_schema.sql</code>
          </span>
          <span className="text-[10px] text-stone-400">Incluye tablas, RLS y triggers</span>
        </div>
      </div>

      {/* Demo Controls Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 space-y-4">
        <h3 className="text-sm font-extrabold text-stone-900 uppercase tracking-wide flex items-center gap-2">
          <RotateCcw className="w-4 h-4 text-stone-500" />
          <span>Control de Datos de Demostración</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 space-y-2">
            <h4 className="font-extrabold text-amber-900 text-xs">
              🔄 Restaurar Datos Demo Hiper-Realistas
            </h4>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              Vuelve a cargar los 8 productos BRK Agro, las 2 solicitudes pendientes de WhatsApp (#BRK-1048 y #BRK-1049), las 5 ventas del día y movimientos de caja.
            </p>
            <button
              type="button"
              onClick={() => {
                if (confirm('¿Restablecer todos los datos al catálogo demo de BRK Agro?')) {
                  resetToDemo();
                }
              }}
              className="mt-2 w-full py-2 rounded-lg font-bold text-xs bg-amber-600 hover:bg-amber-700 text-white shadow transition"
            >
              Restablecer Datos Demo
            </button>
          </div>

          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
            <h4 className="font-extrabold text-stone-800 text-xs">
              🧹 Limpiar Todos los Datos para Producción
            </h4>
            <p className="text-[11px] text-stone-600 leading-relaxed">
              Elimina todas las ventas y pedidos de prueba para entregar el sistema limpio cuando el cliente cargue su inventario real.
            </p>
            <button
              type="button"
              onClick={() => {
                if (confirm('¿Estás seguro de vaciar el sistema para empezar de cero?')) {
                  clearAll();
                }
              }}
              className="mt-2 w-full py-2 rounded-lg font-bold text-xs bg-stone-700 hover:bg-stone-800 text-white shadow transition"
            >
              Limpiar Datos
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
