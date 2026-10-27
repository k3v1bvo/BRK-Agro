import React, { useState, useMemo } from 'react';
import { 
  SunMedium, 
  ShieldCheck, 
  Truck, 
  Award, 
  Sparkles, 
  Filter, 
  ArrowRight,
  Flame,
  CheckCircle2,
  Ruler,
  PhoneCall,
  Star,
  Quote,
  Layers,
  ChevronRight
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product, ProductCategory } from '../../types';
import { ProductCard } from './ProductCard';
import { ProductModal } from './ProductModal';
import { SizeGuideModal } from '../common/SizeGuideModal';

interface StoreFrontProps {
  searchTerm: string;
  isSizeGuideOpen: boolean;
  setIsSizeGuideOpen: (open: boolean) => void;
}

export const StoreFront: React.FC<StoreFrontProps> = ({ 
  searchTerm,
  isSizeGuideOpen,
  setIsSizeGuideOpen 
}) => {
  const { settings, products } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [selectedGender, setSelectedGender] = useState<string>('Todos');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const cleanPhone = (settings.whatsappNumber || '59178541236').replace(/\D/g, '');

  // Filter products by search term, category and gender
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      const matchSearch = 
        searchTerm.trim() === '' ||
        prod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prod.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prod.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchCategory = 
        selectedCategory === 'Todos' || prod.category === selectedCategory;

      const matchGender = 
        selectedGender === 'Todos' || prod.gender === selectedGender || prod.gender === 'Unisex';

      return matchSearch && matchCategory && matchGender;
    });
  }, [products, searchTerm, selectedCategory, selectedGender]);

  const categories = [
    { id: 'Todos', label: 'Todos los Artículos', icon: '🌾' },
    { id: 'Camisas UV50+', label: 'Camisas UV50+', icon: '👕' },
    { id: 'Botinas de Trabajo', label: 'Botinas de Cuero', icon: '🥾' },
    { id: 'Jeans', label: 'Jeans Reforzados 14oz', icon: '👖' },
    { id: 'Gorras y Accesorios', label: 'Gorras & Cinturones', icon: '🧢' },
    { id: 'Mujer', label: 'Línea Mujer Country', icon: '🌸' },
    { id: 'Infantil', label: 'Mini-Agro Infantil', icon: '👦' },
  ];

  // Visual category tiles
  const categoryTiles = [
    {
      title: 'Camisas Técnicas UV50+',
      desc: 'Protección solar permanente para jornadas de campo pesado',
      image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
      category: 'Camisas UV50+',
      tag: 'Más Vendido en Faena',
    },
    {
      title: 'Botinas de Cuero Vacuno',
      desc: 'Cuero engrasado hidrofugado resistente a barro y estiércol',
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
      category: 'Botinas de Trabajo',
      tag: '100% Cuero Genuino',
    },
    {
      title: 'Jeans Heavy Duty 14.5oz',
      desc: 'Triple costura reforzada con bolsillo carpintero para herramientas',
      image: 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=800&q=80',
      category: 'Jeans',
      tag: 'Anti-Desgarre',
    },
    {
      title: 'Gorras Trucker Bordadas',
      desc: 'Bordado 3D de alta densidad con malla transpirable snapback',
      image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80',
      category: 'Gorras y Accesorios',
      tag: 'Edición Especial',
    },
  ];

  // Real Testimonials
  const testimonials = [
    {
      name: 'Ing. Carlos Méndez',
      role: 'Gerente de Producción • Cabaña Sausalito (Montero)',
      text: 'Dotamos a 20 vaqueros con las camisas UV50+ de BRK Agro. La frescura bajo el sol de 38°C en el norte cruceño y la durabilidad de las costuras no tienen comparación con ninguna camisa tradicional.',
      rating: 5,
    },
    {
      name: 'Sandra Rojas',
      role: 'Propietaria • Hacienda El Porvenir (Santa Cruz)',
      text: 'Compré 4 pares de botinas de cuero café. No se rajan con el estiércol ni con la humedad constante de los corrales. La plantilla acolchada realmente evita el cansancio de pie durante todo el día.',
      rating: 5,
    },
    {
      name: 'Dr. Marcelo Arze',
      role: 'Médico Veterinario • Valle Alto (Cochabamba)',
      text: 'Pedí por WhatsApp desde Cochabamba y me despacharon el mismo día por Trans Copacabana con foto de la guía. La talla me quedó perfecta gracias a la calculadora. Atención de primer nivel.',
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-stone-100/70 pb-24">
      
      {/* 1. HERO SECTION (EDITORIAL LUXURY WESTERN LOOK) */}
      <section className="relative bg-stone-950 text-white overflow-hidden border-b-4 border-amber-500">
        
        {/* Cinematic Backdrop Image */}
        <div 
          className="absolute inset-0 opacity-30 bg-cover bg-center mix-blend-luminosity transform scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1920&q=80')`,
          }}
        />

        {/* Ambient Dark Green Gradient */}
        <div 
          className="absolute inset-0 opacity-90"
          style={{
            background: `radial-gradient(circle at 15% 40%, ${settings.primaryColor} 0%, #151b17 55%, #0c0f0d 100%)`,
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28">
          <div className="max-w-3xl">
            
            {/* Top Quality Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-black text-amber-400 mb-6 shadow-md">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>TECNOLOGÍA AGRO BRASIL • CERTIFICACIÓN REAL UV50+</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] font-heading uppercase">
              RUDEZA Y MÁXIMA <br />
              <span className="text-amber-400">PROTECCIÓN EN EL CAMPO</span>
            </h1>

            {/* Sub-headline */}
            <p className="mt-5 text-sm sm:text-base lg:text-lg text-stone-300 leading-relaxed font-medium">
              Equipamiento técnico para ganaderos, ingenieros agrónomos y personal de faena. Camisas con bloqueo permanente del 98% de radiación solar y botinas de cuero vacuno legítimo forjadas para el trabajo pesado.
            </p>

            {/* Value Highlights Pill Grid */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-bold">
              <div className="flex items-center gap-2 bg-stone-900/80 backdrop-blur-sm p-2.5 rounded-xl border border-stone-800">
                <SunMedium className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Protección Solar UV50+</span>
              </div>
              <div className="flex items-center gap-2 bg-stone-900/80 backdrop-blur-sm p-2.5 rounded-xl border border-stone-800">
                <Award className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Cuero Vacuno Grasoso</span>
              </div>
              <div className="flex items-center gap-2 bg-stone-900/80 backdrop-blur-sm p-2.5 rounded-xl border border-stone-800 col-span-2 sm:col-span-1">
                <Truck className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Envíos Diarios por Flota</span>
              </div>
            </div>

            {/* Hero CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                onClick={() => {
                  const el = document.getElementById('catalogo-grid');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="py-3.5 px-7 rounded-xl font-black text-xs uppercase tracking-wider text-stone-950 bg-amber-400 hover:bg-amber-300 shadow-xl transition-transform active:scale-95 flex items-center gap-2"
              >
                <span>Ver Catálogo Completo</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsSizeGuideOpen(true)}
                className="py-3.5 px-6 rounded-xl font-extrabold text-xs uppercase tracking-wider text-white bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/25 transition flex items-center gap-2"
              >
                <Ruler className="w-4 h-4 text-amber-400" />
                <span>Calculadora de Talla Ideal</span>
              </button>

              <a
                href={`https://wa.me/${cleanPhone}?text=Hola,%20quisiera%20cotizar%20pedido%20por%20mayor%20para%20mi%20hacienda`}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-stone-300 hover:text-white underline underline-offset-4 flex items-center gap-1.5 ml-2"
              >
                <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                <span>Cotización por Mayor</span>
              </a>
            </div>

          </div>
        </div>

        {/* Bottom Trust Strip */}
        <div className="bg-stone-950/90 border-t border-stone-800/80 backdrop-blur-md py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-extrabold text-stone-300">
            <div className="flex items-center gap-2.5">
              <span className="p-1.5 bg-amber-500/20 text-amber-400 rounded-lg">☀️</span>
              <span>Bloquea el 98% Radiación UVA/UVB</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg">🛡️</span>
              <span>1er Cambio de Talla Gratuito</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="p-1.5 bg-sky-500/20 text-sky-400 rounded-lg">🧵</span>
              <span>Bordado de Nombre o Logo de Cabaña</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="p-1.5 bg-purple-500/20 text-purple-400 rounded-lg">📦</span>
              <span>Precios Especiales desde 3 unidades</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORY TILES LOOKBOOK */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="flex items-end justify-between mb-6">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-amber-800 block">
              Líneas Especializadas BRK Agro
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 font-heading">
              Colecciones Principales
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categoryTiles.map((tile, idx) => (
            <div
              key={idx}
              onClick={() => {
                setSelectedCategory(tile.category);
                const el = document.getElementById('catalogo-grid');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group relative rounded-2xl overflow-hidden aspect-[4/5] cursor-pointer shadow-md border border-stone-200 card-luxury"
            >
              <img
                src={tile.image}
                alt={tile.title}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent opacity-90 group-hover:opacity-95 transition-opacity" />

              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 rounded-full bg-amber-500 text-stone-950 font-black text-[10px] uppercase shadow-sm">
                  {tile.tag}
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="font-black text-lg font-heading leading-tight group-hover:text-amber-400 transition-colors">
                  {tile.title}
                </h3>
                <p className="text-xs text-stone-300 mt-1 line-clamp-2">
                  {tile.desc}
                </p>
                <div className="mt-3 flex items-center gap-1.5 text-xs font-black text-amber-400">
                  <span>Explorar Prendas</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. MAIN PRODUCT CATALOG SECTION */}
      <section id="catalogo-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        
        {/* Catalog Header with Filters */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-stone-100">
            <div>
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-800">
                <Flame className="w-4 h-4 text-amber-600" />
                <span>INVENTARIO DISPONIBLE CON DESPACHO INMEDIATO</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900 font-heading mt-1">
                Prendas y Calzado de Faena ({filteredProducts.length})
              </h2>
            </div>

            {/* Gender Switcher */}
            <div className="flex items-center gap-1 bg-stone-100 p-1.5 rounded-xl self-start md:self-auto border border-stone-200">
              {['Todos', 'Hombre', 'Mujer', 'Infantil'].map((g) => (
                <button
                  key={g}
                  onClick={() => setSelectedGender(g)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition ${
                    selectedGender === g
                      ? 'bg-stone-900 text-amber-400 shadow-sm'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="pt-4 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-black whitespace-nowrap transition-all flex items-center gap-2 shrink-0 ${
                  selectedCategory === cat.id
                    ? 'bg-stone-900 text-amber-400 shadow-md ring-2 ring-amber-400/40'
                    : 'bg-stone-50 text-stone-700 border border-stone-200 hover:border-stone-400'
                }`}
              >
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Search feedback if any */}
          {searchTerm.trim() !== '' && (
            <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 font-bold flex items-center justify-between">
              <span>Buscando: <strong>"{searchTerm}"</strong></span>
              <button
                onClick={() => setSelectedCategory('Todos')}
                className="text-amber-800 underline hover:text-amber-950"
              >
                Ver todos
              </button>
            </div>
          )}
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelectProduct={setSelectedProduct}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-stone-300 my-8">
            <span className="text-4xl block mb-2">🔍</span>
            <h3 className="text-base font-extrabold text-stone-800">
              No encontramos productos que coincidan con tu búsqueda
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Prueba cambiando la categoría seleccionada o el término ingresado.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('Todos');
                setSelectedGender('Todos');
              }}
              className="mt-4 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-white shadow"
              style={{ backgroundColor: settings.primaryColor }}
            >
              Restablecer Filtros
            </button>
          </div>
        )}

      </section>

      {/* 4. INTERACTIVE SIZE RECOMMENDER BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="bg-gradient-to-r from-stone-900 via-stone-950 to-stone-900 text-white rounded-3xl p-8 sm:p-12 border border-stone-800 shadow-xl relative overflow-hidden">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-black text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 mb-3">
              <Ruler className="w-3.5 h-3.5" />
              <span>AJUSTE PERFECTO GARANTIZADO</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black font-heading leading-tight">
              ¿Dudas sobre si te quedará bien la talla?
            </h3>

            <p className="mt-3 text-xs sm:text-sm text-stone-300 leading-relaxed font-medium">
              Usa nuestra calculadora interactiva: ingresa tu altura y peso para camisas, o los centímetros de tu pie para botinas. Además, cuentas con <strong>1er cambio de talla gratuito</strong> si necesitas otra medida.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsSizeGuideOpen(true)}
                className="py-3 px-6 rounded-xl font-black text-xs uppercase tracking-wider text-stone-950 bg-amber-400 hover:bg-amber-300 shadow-lg transition active:scale-95"
              >
                Abrir Calculadora de Tallas
              </button>
              <span className="text-xs text-stone-400 font-semibold">
                Tallas PP a XGG y calzados 38 al 43
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. VERIFIED CATTLE RANCH REVIEWS (SOCIAL PROOF) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-black uppercase tracking-wider text-amber-800">
            Opiniones de Clientes Reales
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 font-heading mt-1">
            Comprobado en el Barro y Sol de Bolivia
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-3">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-stone-700 leading-relaxed italic">
                  "{t.text}"
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-100">
                <div className="font-black text-sm text-stone-900">{t.name}</div>
                <div className="text-[11px] text-stone-500 font-medium">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. WHOLESALE & EMBROIDERY CALLOUT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="bg-stone-900 text-white rounded-3xl p-8 sm:p-10 border border-stone-800 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="max-w-2xl">
            <span className="text-xs font-black uppercase text-amber-400 tracking-wider">
              📦 ATENCIÓN CORPORATIVA PARA CABAÑAS & ESTANCIAS
            </span>
            <h3 className="text-2xl font-black font-heading mt-1">
              ¿Necesitas dotar a tu personal o equipo de campo?
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 mt-2 leading-relaxed">
              Descuentos automáticos a partir de 3 prendas, con opción de bordado computarizado de alta definición de tu marca ganadera o logotipo corporativo.
            </p>
          </div>

          <a
            href={`https://wa.me/${cleanPhone}?text=Hola,%20quisiera%20cotizar%20un%20lote%20mayorista%20con%20bordado%20personalizado`}
            target="_blank"
            rel="noreferrer"
            className="py-3.5 px-6 rounded-xl font-black text-xs uppercase tracking-wider text-stone-950 bg-amber-400 hover:bg-amber-300 shadow-xl transition active:scale-95 shrink-0 flex items-center gap-2"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Hablar con Asesor Mayorista</span>
          </a>
        </div>
      </section>

      {/* Modals */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
      />

      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
      />

    </div>
  );
};
