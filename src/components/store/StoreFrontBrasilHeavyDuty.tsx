import React, { useState, useMemo } from 'react';
import { 
  SunMedium, 
  ShieldCheck, 
  RotateCcw, 
  ShoppingBag, 
  Sparkles, 
  Play, 
  Tag, 
  CheckCircle2, 
  Star, 
  Ruler, 
  ArrowRight,
  Flame,
  Volume2,
  X,
  Heart,
  Share2,
  SlidersHorizontal,
  Search,
  Languages,
  Layers,
  ChevronRight,
  TrendingUp,
  Truck,
  PhoneCall,
  Clock,
  Award,
  Zap,
  Filter
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
import { ProductModal } from './ProductModal';
import { SizeGuideModal } from '../common/SizeGuideModal';

interface Props {
  onOpenSizeGuide: () => void;
  isSizeGuideOpen: boolean;
  setIsSizeGuideOpen: (open: boolean) => void;
}

const I18N = {
  es: {
    announcement: '⚡ ENVÍO FIJO BS. 15 — TODO EL PAÍS 🇧🇴 | ¡HASTA 3 CUOTAS SIN INTERÉS!',
    exchangeBadge: '🛡️ 1ER CAMBIO GRATIS',
    uvBadge: '☀️ FPU 50+ HOMOLOGADO',
    factoryBadge: '🚜 DIRECTO DE FÁBRICA',
    navShirts: 'Camisas UV50+',
    navBoots: 'Botinas de Cuero',
    navJeans: 'Pantalones & Jeans',
    navAccessories: 'Accesorios',
    navOffers: 'Liquidación Agro',
    sizeGuide: 'Guía de Tallas',
    cart: 'Carrito',
    searchPlaceholder: 'Buscar camisas UV50+, botinas de cuero, jeans carpintero...',
    heroTag: 'TECNOLOGÍA PROBADA EN CAMPO • MÁXIMA RESISTENCIA',
    heroTitle1: 'LA FUERZA DEL',
    heroTitle2: 'TRABAJO EN EL CAMPO',
    heroSubtitle: 'Ropa ultra resistente y con protección solar UV50+ permanente, probada bajo el sol abrasador por quienes viven la faena diaria en el campo y la hacienda.',
    heroBtnReleases: 'VER LANZAMIENTOS',
    heroBtnStories: 'HISTORIAS DEL AGRO',
    heroSocialCount: 'Más de 14.800 productores y faeneros vistiendo BRK en todo el país.',
    reelsTag: 'REELS DE CAMPO',
    shopTheLook: 'COMPRA ESTE LOOK',
    shopTheLookTitle: 'Camisa UV50+ Verde Agro',
    reelsAuthor: 'Juan M. • Operador de Maquinaria en San Julián',
    reelsTouchPrompt: 'Toca para ver el video ➔',
    badge1Title: '1. PROTECCIÓN UV50+ REAL',
    badge1Desc: 'Bloqueo permanente del 98% de radiación solar UVA y UVB. El factor no se pierde con las lavadas, protegiendo tu piel todo el día bajo el sol fuerte.',
    badge2Title: '2. GARANTÍA DE RESISTENCIA',
    badge2Desc: 'Costuras triples reforzadas y tela antirasgaduras. Desarrollada para aguantar alambre de púa, barro, espinas y trabajo con maquinaria pesada.',
    badge3Title: '3. CAMBIO GRATIS HASTA 7 DÍAS',
    badge3Desc: '¿Compraste y no te quedó a la medida exacta? El primer cambio de talla es 100% gratuito por nuestra cuenta, rápido y sin burocracia.',
    featuredTag: 'DIRECTO DE FÁBRICA • ENTREGA INMEDIATA',
    featuredTitle: 'LOS PREFERIDOS DE QUIENES TRABAJAN PESADO',
    featuredRating: 'Calificado con 4.9/5 estrellas en faena de campo',
    card1Badge: 'PROTECCIÓN UV50+',
    card1Quote: '💬 "Resiste a todo tipo de faena y calor extremo" — Juan M.',
    card1Sub: 'Lanzamiento Temporada',
    card1Title: 'Camisa UV50+ Verde Agro',
    card1Desc: 'Tejido Dry-Fit Pro ventilado que expulsa el sudor al instante. Costuras dobles en hombros y puños anatómicos.',
    card1Price: '220',
    card1OldPrice: '260',
    card1Btn: 'COMPRAR AHORA',
    card2Badge: 'RESISTENCIA GARANTIZADA',
    card2Quote: '💬 "No se raja con el barro ni con el agua" — Walter S.',
    card2Sub: '100% Cuero Vacuno Legítimo',
    card2Title: 'Botina de Trabajo Cuero Vacuno',
    card2Desc: 'Cuero vacuno engrasado repelente de humedad. Suela tractorada cosida a mano y elásticos laterales reforzados.',
    card2Price: '380',
    card2OldPrice: '450',
    card2Btn: 'AGREGAR AL CARRITO',
    card3Badge: 'PROTECCIÓN UV50+',
    card3Quote: '💬 "Muy fresca, anatómica y resistente" — Felipe R.',
    card3Sub: 'Alta Elasticidad',
    card3Title: 'Camisa UV50+ Verde Agro (Manga Larga)',
    card3Desc: 'Protección física total contra sol abrasador y picaduras. Secado relámpago ideal para cabalgatas y jornadas calurosas.',
    card3Price: '220',
    card3OldPrice: '260',
    card3Btn: 'COMPRAR AHORA',
    testiTag: 'TESTIMONIOS REALES DE CLIENTES',
    testiTitle: 'VOCES DEL CAMPO 🌾',
    testiDesc: 'Fotografías y testimonios directos de quienes madrugan a las 5:00 AM para producir la tierra.',
    t1Name: 'Marcos Alarcón',
    t1Role: 'Productor de Soya • Montero / San Pedro',
    t1Text: '"Las camisas de BRK son las únicas que no sofocan dentro de la cosechadora ni bajo el sol del mediodía. Vale cada centavo."',
    t2Name: 'Thiago Sampaio',
    t2Role: 'Ganadería de Corte • San Ignacio de Velasco',
    t2Text: '"La botina de cuero es ruda de verdad. Me paso el día en el corral y brete y no entra agua ni se despega la suela. Compré 3 pares."',
    t3Name: 'Juliana Esteves',
    t3Role: 'Ingeniera Agrónoma • Valles Cruceños',
    t3Text: '"Excelente calce en el cuerpo y la protección solar es comprobada. No termino con la piel roja tras el monitoreo de parcelas."',
    modalOrigProduct: 'PRODUCTO ORIGINAL',
    modalReelText: '"Jornada de siembra en el tractor con la camisa UV50+ BRK Agro. No sofoca nada y aguanta toda la tierra y polvo."',
    modalBuyBtn: '⚡ COMPRAR CAMISA DEL VIDEO',
  },
  pt: {
    announcement: '⚡ FRETE FIXO R$ 9,90 — TODO BRASIL 🇧🇷 | PARCELE EM ATÉ 3X SEM JUROS!',
    exchangeBadge: '🛡️ 1ª TROCA GRÁTIS',
    uvBadge: '☀️ FPU 50+ HOMOLOGADO',
    factoryBadge: '🚜 DIRETO DA FÁBRICA',
    navShirts: 'Camisas UV50+',
    navBoots: 'Botinas de Couro',
    navJeans: 'Calças & Jeans',
    navAccessories: 'Acessórios',
    navOffers: 'Liquidação Agro',
    sizeGuide: 'Guia de Tamanhos',
    cart: 'Carrinho',
    searchPlaceholder: 'Buscar camisas UV50+, botinas de couro, calças reforçadas...',
    heroTag: 'TECNOLOGIA TESTADA EM CAMPO • 100% BRASIL',
    heroTitle1: 'A FORÇA DO',
    heroTitle2: 'TRABALHO NO CAMPO',
    heroSubtitle: 'Roupas ultra resistentes e com proteção UV50+ testadas por quem vive a lida diária na fazenda, lavoura e trato com o gado.',
    heroBtnReleases: 'VER LANÇAMENTOS',
    heroBtnStories: 'HISTÓRIAS DO AGRO',
    heroSocialCount: 'Mais de 14.800 produtores rurais vestindo BRK Agro em todo o país.',
    reelsTag: 'REELS DA ROÇA',
    shopTheLook: 'COMPRE ESTE LOOK',
    shopTheLookTitle: 'Camisa UV50+ Verde Agro',
    reelsAuthor: 'João M. • Tratorista em Campo Novo',
    reelsTouchPrompt: 'Toque para ver ➔',
    badge1Title: '1. PROTEÇÃO UV50+ REAL',
    badge1Desc: 'Bloqueio permanente de 98% dos raios UVA e UVB. O fator não sai nas lavagens, protegendo sua pele o dia todo sob sol forte.',
    badge2Title: '2. GARANTIA DE RESISTÊNCIA',
    badge2Desc: 'Costura tripla reforçada e tecido anti-rasgo. Desenvolvido para encarar arame farpado, barro, poeira e trabalho com máquinas.',
    badge3Title: '3. TROCA GRÁTIS EM ATÉ 7 DIAS',
    badge3Desc: 'Comprou e não serviu certinho? A primeira troca de tamanho é 100% gratuita por nossa conta, sem burocracia.',
    featuredTag: 'DIRETO DA FÁBRICA • PRONTA ENTREGA',
    featuredTitle: 'OS PREFERIDOS DE QUEM PEGA PESADO',
    featuredRating: 'Avaliado com 4.9/5 estrelas no campo',
    card1Badge: 'PROTEÇÃO UV50+',
    card1Quote: '💬 "Resiste a todo tipo de lida" — João M.',
    card1Sub: 'Lançamento 2026',
    card1Title: 'Camisa UV50+ Verde Agro',
    card1Desc: 'Tecido Dry-Fit ventilado que expulsa o suor instantaneamente. Costuras duplas nos ombros e punhos ajustados.',
    card1Price: '39,00',
    card1OldPrice: '59,00',
    card1Btn: 'COMPRAR AGORA',
    card2Badge: 'RESISTÊNCIA GARANTIDA',
    card2Quote: '💬 "Não racha com barro nem esterco" — Valdir S.',
    card2Sub: 'Couro Vacuno 100%',
    card2Title: 'Botina de Trabalho Couro Legítimo',
    card2Desc: 'Couro vacuno tratado com óleo repelente de umidade. Solado tratorado cosido à mão e elásticos reforçados.',
    card2Price: '29,00',
    card2OldPrice: '45,00',
    card2Btn: 'ADICIONAR AO CARRINHO',
    card3Badge: 'PROTEÇÃO UV50+',
    card3Quote: '💬 "Muito confortável e forte" — Felipe R.',
    card3Sub: 'Alta Elasticidade',
    card3Title: 'Camisa UV50+ Verde Agro (Manga Longa)',
    card3Desc: 'Proteção física total contra sol inclemente e insetos. Secagem relâmpago ideal para cavalgadas e dias quentes.',
    card3Price: '39,00',
    card3OldPrice: '59,00',
    card3Btn: 'COMPRAR AGORA',
    testiTag: 'DEPOIMENTOS REAIS',
    testiTitle: 'VOZES DO CAMPO 🌾',
    testiDesc: 'Fotografias e avaliações diretas de quem acorda às 5h da manhã para produzir no campo.',
    t1Name: 'Marcos Alencar',
    t1Role: 'Produtor de Soja • Goiás',
    t1Text: '"As camisas da BRK são as únicas que não esquentam dentro da colheitadeira nem debaixo do sol do meio-dia. Vale cada centavo."',
    t2Name: 'Tiago Sampaio',
    t2Role: 'Pecuária de Corte • Mato Grosso',
    t2Text: '"A botina de couro é bruta demais. Passo o dia no mangueiro e no brete e não entra água nem descola o solado. Comprei 3 pares."',
    t3Name: 'Juliana Esteves',
    t3Role: 'Engenheira Agrônoma • Paraná',
    t3Text: '"Excelente caimento no corpo e a proteção solar é comprovada. Não fico com a pele vermelha após o monitoramento de pragas."',
    modalOrigProduct: 'PRODUTO ORIGINAL',
    modalReelText: '"Dia de plantio no trator com a camisa UV50+ BRK Agro. Não esquenta nada e aguenta a poeira."',
    modalBuyBtn: '⚡ COMPRAR CAMISA DO VÍDEO',
  }
};

export const StoreFrontBrasilHeavyDuty: React.FC<Props> = ({ 
  onOpenSizeGuide,
  isSizeGuideOpen,
  setIsSizeGuideOpen
}) => {
  const { settings, products, addToCart, setIsCartOpen, cartTotal, cartItemsCount } = useStore();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeStoryModal, setActiveStoryModal] = useState<boolean>(false);
  const [lang, setLang] = useState<'es' | 'pt'>('es'); // Default Spanish!
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedFilterCategory, setSelectedFilterCategory] = useState<string>('todos');

  const t = I18N[lang];
  const currency = lang === 'pt' ? 'R$' : (settings.currency || 'Bs.');

  // Primary products matching prompt 1
  const camisaVerde = products.find((p) => p.id === 'prod-brk-01') || products[0];
  const botinaCouro = products.find((p) => p.id === 'prod-brk-02') || products[1];

  // Filter products for the catalog section
  const displayProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCat = 
        selectedFilterCategory === 'todos' || 
        (selectedFilterCategory === 'camisas' && p.category.includes('Camisas')) ||
        (selectedFilterCategory === 'botinas' && p.category.includes('Botinas')) ||
        (selectedFilterCategory === 'jeans' && p.category.includes('Jeans')) ||
        (selectedFilterCategory === 'accesorios' && p.category.includes('Gorras'));

      const matchSearch = 
        searchTerm.trim() === '' || 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.description.toLowerCase().includes(searchTerm.toLowerCase());

      return matchCat && matchSearch;
    });
  }, [products, selectedFilterCategory, searchTerm]);

  return (
    <div className="min-h-screen bg-[#0a0d0c] text-stone-100 selection:bg-yellow-400 selection:text-black">
      
      {/* 1. TOP ANNOUNCEMENT BAR (BRIGHT YELLOW INDUSTRIAL) */}
      <div className="bg-[#FFE600] text-black text-xs font-black py-2 px-4 shadow-lg tracking-wider sticky top-0 z-40 border-b border-yellow-500">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          
          <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-none mx-auto sm:mx-0">
            <span className="flex items-center gap-1.5 uppercase font-black text-xs sm:text-sm tracking-wide">
              <Zap className="w-4 h-4 fill-black" />
              {t.announcement}
            </span>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            
            {/* Quick Guarantees (hidden on mobile) */}
            <div className="hidden lg:flex items-center gap-4 text-[11px] font-black uppercase text-stone-900">
              <span className="flex items-center gap-1 hover:opacity-80 transition cursor-default">
                <ShieldCheck className="w-3.5 h-3.5" /> {t.exchangeBadge}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 hover:opacity-80 transition cursor-default">
                <SunMedium className="w-3.5 h-3.5" /> {t.uvBadge}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 hover:opacity-80 transition cursor-default">
                <Truck className="w-3.5 h-3.5" /> {t.factoryBadge}
              </span>
            </div>

            {/* Language Switcher Button with Glowing Active Pill */}
            <div className="flex items-center bg-black text-white p-1 rounded-full text-[10px] font-black border border-stone-800 shadow-inner">
              <button
                onClick={() => setLang('es')}
                className={`px-2.5 py-0.5 rounded-full transition-all duration-300 font-extrabold flex items-center gap-1 ${
                  lang === 'es' ? 'bg-[#FFE600] text-black shadow-md scale-105' : 'text-stone-300 hover:text-white'
                }`}
                title="Cambiar a Español"
              >
                <span>🇪🇸</span>
                <span>ES</span>
              </button>
              <button
                onClick={() => setLang('pt')}
                className={`px-2.5 py-0.5 rounded-full transition-all duration-300 font-extrabold flex items-center gap-1 ${
                  lang === 'pt' ? 'bg-[#FFE600] text-black shadow-md scale-105' : 'text-stone-300 hover:text-white'
                }`}
                title="Mudar para Português"
              >
                <span>🇧🇷</span>
                <span>PT</span>
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER (HIGH PERFORMANCE BRANDING + LIVE SEARCH) */}
      <header className="bg-[#121614]/95 backdrop-blur-xl border-b border-stone-800/80 sticky top-9 z-30 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex items-center justify-between gap-4 sm:gap-6">
            
            {/* Logo with Green Leaf/Tree in the 'O' */}
            <div className="flex items-center gap-3 shrink-0">
              <a href="#" className="flex items-center gap-3 group">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-[#FFE600] to-amber-500 text-black font-black text-2xl flex items-center justify-center shadow-lg group-hover:scale-105 group-hover:rotate-1 transition-all">
                  🌾
                </div>
                <div className="flex flex-col">
                  <span className="text-xl sm:text-2xl font-black tracking-tight text-white font-heading uppercase flex items-center leading-none">
                    BRK AGR<span className="text-emerald-400 font-extrabold flex items-center">O<span className="text-xs ml-0.5">🌱</span></span>
                  </span>
                  <span className="text-[9px] font-black tracking-widest text-yellow-400 uppercase mt-0.5 flex items-center gap-1">
                    <span>WORKWEAR & PERFORMANCE</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                  </span>
                </div>
              </a>
            </div>

            {/* Desktop Navigation Links with Vector Icons */}
            <nav className="hidden xl:flex items-center gap-1 text-xs font-black uppercase tracking-wider text-stone-300">
              
              <button 
                onClick={() => {
                  setSelectedFilterCategory('camisas');
                  document.getElementById('lancamentos')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-stone-800/80 hover:text-yellow-400 transition"
              >
                <SunMedium className="w-4 h-4 text-emerald-400" />
                <span>{t.navShirts}</span>
              </button>

              <button 
                onClick={() => {
                  setSelectedFilterCategory('botinas');
                  document.getElementById('lancamentos')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-stone-800/80 hover:text-yellow-400 transition"
              >
                <ShieldCheck className="w-4 h-4 text-amber-500" />
                <span>{t.navBoots}</span>
              </button>

              <button 
                onClick={() => {
                  setSelectedFilterCategory('jeans');
                  document.getElementById('lancamentos')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-stone-800/80 hover:text-yellow-400 transition"
              >
                <Layers className="w-4 h-4 text-blue-400" />
                <span>{t.navJeans}</span>
              </button>

              <button 
                onClick={() => {
                  setSelectedFilterCategory('accesorios');
                  document.getElementById('lancamentos')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-stone-800/80 hover:text-yellow-400 transition"
              >
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>{t.navAccessories}</span>
              </button>

              <button 
                onClick={() => {
                  setSelectedFilterCategory('todos');
                  document.getElementById('lancamentos')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-yellow-400 hover:bg-yellow-400/10 font-black transition"
              >
                <Flame className="w-4 h-4 fill-yellow-400" />
                <span>{t.navOffers}</span>
              </button>

            </nav>

            {/* Quick Actions (Search Bar & Cart) */}
            <div className="flex items-center gap-3">
              
              {/* Size Guide Button */}
              <button
                onClick={onOpenSizeGuide}
                className="hidden md:flex items-center gap-1.5 px-3 py-2 text-xs font-black uppercase tracking-wider text-stone-300 bg-stone-900/90 hover:bg-stone-800 border border-stone-700/80 rounded-xl transition shadow-sm active:scale-95"
              >
                <Ruler className="w-3.5 h-3.5 text-yellow-400" />
                <span>{t.sizeGuide}</span>
              </button>

              {/* Shopping Bag Button with Live Counter Badge & Subtotal */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="px-4 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider bg-[#FFE600] text-black hover:bg-yellow-400 shadow-xl flex items-center gap-2.5 transition active:scale-95 group relative"
              >
                <div className="relative">
                  <ShoppingBag className="w-4 h-4 group-hover:rotate-6 transition-transform" />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-black flex items-center justify-center animate-bounce shadow">
                      {cartItemsCount}
                    </span>
                  )}
                </div>
                <span>{t.cart}</span>
                {cartTotal > 0 && (
                  <span className="bg-black/85 text-[#FFE600] px-2 py-0.5 rounded-lg text-[10px] font-black">
                    {currency} {cartTotal.toLocaleString()}
                  </span>
                )}
              </button>

            </div>

          </div>

          {/* Integrated Live Search Bar with Tags */}
          <div className="mt-3 pt-3 border-t border-stone-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="relative flex-1 max-w-xl">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full pl-10 pr-10 py-2 rounded-xl bg-stone-900/90 border border-stone-700/80 text-xs text-white placeholder-stone-400 focus:outline-none focus:border-yellow-400 transition"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-stone-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Trending Quick Search Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-none text-[11px] font-bold text-stone-400">
              <span className="text-stone-500 uppercase text-[10px] font-black">Populares:</span>
              <button 
                onClick={() => setSearchTerm('UV50+')}
                className="px-2.5 py-1 rounded-lg bg-stone-900 hover:bg-stone-800 hover:text-yellow-400 border border-stone-800 transition"
              >
                ☀️ Camisas UV50+
              </button>
              <button 
                onClick={() => setSearchTerm('Botina')}
                className="px-2.5 py-1 rounded-lg bg-stone-900 hover:bg-stone-800 hover:text-yellow-400 border border-stone-800 transition"
              >
                👢 Botinas Cuero
              </button>
              <button 
                onClick={() => setSearchTerm('Jeans')}
                className="px-2.5 py-1 rounded-lg bg-stone-900 hover:bg-stone-800 hover:text-yellow-400 border border-stone-800 transition"
              >
                👖 Jeans Carpintero
              </button>
            </div>
          </div>

        </div>
      </header>

      {/* 3. HERO SECTION (DYNAMIC FIELD / ACTION THEME WITH AMBIENT GLOW) */}
      <section className="relative overflow-hidden border-b border-stone-800 bg-[#0d100e]">
        
        {/* Subtle Ambient Radial Lighting */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Concrete Grid Backdrop */}
        <div className="absolute inset-0 concrete-grid opacity-20 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Col (Headline & Action) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Animated Radar Pulse Tag */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[11px] font-black text-emerald-400 uppercase tracking-widest shadow-lg">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span>{t.heroTag}</span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.02] font-heading uppercase text-white">
                {t.heroTitle1} <br />
                <span className="text-[#FFE600] drop-shadow-md">{t.heroTitle2}</span>
              </h1>

              <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-medium max-w-xl">
                {t.heroSubtitle}
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => {
                    const el = document.getElementById('lancamentos');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="py-4 px-8 rounded-2xl font-black text-xs uppercase tracking-wider bg-[#FFE600] text-black hover:bg-yellow-400 shadow-2xl transition-all active:scale-95 flex items-center gap-2 group hover:glow-yellow"
                >
                  <span>{t.heroBtnReleases}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => setActiveStoryModal(true)}
                  className="py-4 px-7 rounded-2xl font-black text-xs uppercase tracking-wider text-emerald-400 bg-emerald-950/50 hover:bg-emerald-950/80 border-2 border-emerald-500/60 transition-all active:scale-95 flex items-center gap-2 hover:glow-emerald"
                >
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <Play className="w-3 h-3 fill-emerald-400" />
                  </div>
                  <span>{t.heroBtnStories}</span>
                </button>
              </div>

              {/* Real workers quote pill */}
              <div className="pt-4 flex items-center gap-3 text-xs text-stone-400 border-t border-stone-800/80">
                <div className="flex -space-x-2">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80"
                    alt="Productor"
                    className="w-8 h-8 rounded-full border-2 border-stone-900 object-cover shadow"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80"
                    alt="Productor 2"
                    className="w-8 h-8 rounded-full border-2 border-stone-900 object-cover shadow"
                  />
                </div>
                <span>
                  {t.heroSocialCount}
                </span>
              </div>

            </div>

            {/* Right Col: Interactive UGC Stories / Reels Panel with Floating Glow */}
            <div className="lg:col-span-5 relative">
              
              <div 
                onClick={() => setActiveStoryModal(true)}
                className="relative rounded-3xl overflow-hidden border-2 border-yellow-400/70 shadow-2xl group cursor-pointer aspect-[9/14] max-w-sm mx-auto bg-stone-900 hover:glow-yellow transition-all duration-500"
              >
                {/* Generated authentic reel image */}
                <img
                  src="/brk_reels_worker.jpg"
                  alt="Gente del Campo"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-stone-950/60" />

                {/* Social Badges (TikTok & Instagram Reels overlay) */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                  <div className="flex items-center gap-2 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-white text-[11px] font-black">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span>{t.reelsTag}</span>
                  </div>

                  <div className="flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-extrabold text-white">
                    <span>🎵 @brkagro_oficial</span>
                  </div>
                </div>

                {/* Center Play Button Overlay with Pulse Rings */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-yellow-400/40 animate-ping" />
                    <div className="w-16 h-16 rounded-full bg-[#FFE600] text-black flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform relative z-10">
                      <Play className="w-7 h-7 fill-black ml-1" />
                    </div>
                  </div>
                </div>

                {/* Hotspot: "Shop The Look / Comprar Look" Tag */}
                <div className="absolute bottom-16 left-4 right-4 z-10">
                  <div className="bg-[#121614]/95 backdrop-blur-md border border-yellow-400/80 p-3 rounded-2xl flex items-center justify-between shadow-2xl group-hover:translate-y-[-2px] transition-transform">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500 flex items-center justify-center text-lg shadow">
                        👕
                      </div>
                      <div>
                        <div className="text-[10px] font-black text-yellow-400 uppercase tracking-wider flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>{t.shopTheLook}</span>
                        </div>
                        <div className="text-xs font-black text-white">
                          {t.shopTheLookTitle}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-black text-yellow-400 font-heading">
                        {currency} {t.card1Price}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Author Tag */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-bold text-stone-300">
                  <span>{t.reelsAuthor}</span>
                  <span className="text-yellow-400 font-black">{t.reelsTouchPrompt}</span>
                </div>

              </div>

            </div>

          </div>
        </div>

      </section>

      {/* 4. VALUE BADGES SECTION (THREE HIGH-CONTRAST DISTRESSED ARMORED PANELS) */}
      <section className="bg-[#121614] border-b border-stone-800 py-12 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Badge 1: Proteção UV50+ Real */}
            <div className="p-7 rounded-3xl bg-gradient-to-br from-[#18201b] to-[#121714] border-2 border-emerald-500/40 shadow-xl flex items-start gap-4 hover:border-emerald-400 hover:glow-emerald transition-all duration-300 group">
              <div className="p-4 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/40 shrink-0 group-hover:scale-110 transition-transform">
                <SunMedium className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-black text-white text-base uppercase tracking-wider font-heading flex items-center gap-2">
                  <span>{t.badge1Title}</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </h3>
                <p className="text-xs text-stone-300 mt-2 leading-relaxed font-medium">
                  {t.badge1Desc}
                </p>
              </div>
            </div>

            {/* Badge 2: Garantia de Resistência */}
            <div className="p-7 rounded-3xl bg-gradient-to-br from-[#18201b] to-[#121714] border-2 border-yellow-500/40 shadow-xl flex items-start gap-4 hover:border-yellow-400 hover:glow-yellow transition-all duration-300 group">
              <div className="p-4 rounded-2xl bg-yellow-500/20 text-yellow-400 border border-yellow-400/40 shrink-0 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-black text-white text-base uppercase tracking-wider font-heading flex items-center gap-2">
                  <span>{t.badge2Title}</span>
                  <Award className="w-4 h-4 text-yellow-400" />
                </h3>
                <p className="text-xs text-stone-300 mt-2 leading-relaxed font-medium">
                  {t.badge2Desc}
                </p>
              </div>
            </div>

            {/* Badge 3: Troca Grátis em até 7 Dias */}
            <div className="p-7 rounded-3xl bg-gradient-to-br from-[#18201b] to-[#121714] border-2 border-emerald-500/40 shadow-xl flex items-start gap-4 hover:border-emerald-400 hover:glow-emerald transition-all duration-300 group">
              <div className="p-4 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/40 shrink-0 group-hover:scale-110 transition-transform">
                <RotateCcw className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-black text-white text-base uppercase tracking-wider font-heading flex items-center gap-2">
                  <span>{t.badge3Title}</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </h3>
                <p className="text-xs text-stone-300 mt-2 leading-relaxed font-medium">
                  {t.badge3Desc}
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. FEATURED PRODUCT GRID WITH QUICK CATEGORY FILTER PILLS */}
      <section id="lancamentos" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-4 border-b border-stone-800">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-yellow-400 flex items-center gap-1.5">
              <Flame className="w-4 h-4 fill-yellow-400 animate-pulse" />
              <span>{t.featuredTag}</span>
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white font-heading uppercase mt-1">
              {t.featuredTitle}
            </h2>
          </div>

          <div className="text-xs font-bold text-stone-400 flex items-center gap-2">
            <span>{t.featuredRating}</span>
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-yellow-400" />
              ))}
            </div>
          </div>
        </div>

        {/* Quick Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          <button
            onClick={() => setSelectedFilterCategory('todos')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition ${
              selectedFilterCategory === 'todos'
                ? 'bg-[#FFE600] text-black shadow-lg scale-105'
                : 'bg-stone-900 text-stone-300 hover:bg-stone-800 border border-stone-800'
            }`}
          >
            🔥 Todos los Modelos
          </button>
          <button
            onClick={() => setSelectedFilterCategory('camisas')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition flex items-center gap-1.5 ${
              selectedFilterCategory === 'camisas'
                ? 'bg-[#FFE600] text-black shadow-lg scale-105'
                : 'bg-stone-900 text-stone-300 hover:bg-stone-800 border border-stone-800'
            }`}
          >
            <SunMedium className="w-3.5 h-3.5 text-emerald-400" />
            <span>Camisas UV50+</span>
          </button>
          <button
            onClick={() => setSelectedFilterCategory('botinas')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition flex items-center gap-1.5 ${
              selectedFilterCategory === 'botinas'
                ? 'bg-[#FFE600] text-black shadow-lg scale-105'
                : 'bg-stone-900 text-stone-300 hover:bg-stone-800 border border-stone-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Botinas de Cuero</span>
          </button>
          <button
            onClick={() => setSelectedFilterCategory('jeans')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition flex items-center gap-1.5 ${
              selectedFilterCategory === 'jeans'
                ? 'bg-[#FFE600] text-black shadow-lg scale-105'
                : 'bg-stone-900 text-stone-300 hover:bg-stone-800 border border-stone-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span>Jeans & Pantalones</span>
          </button>
        </div>

        {/* 3 Featured Products Requested in Prompt 1 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: Camisa UV50+ Verde Agro */}
          <div className="bg-[#141916] rounded-3xl overflow-hidden border border-stone-800/90 shadow-2xl flex flex-col justify-between group hover:border-yellow-400 hover:glow-yellow transition-all duration-500">
            <div>
              <div className="relative aspect-square overflow-hidden bg-stone-900">
                <img
                  src="/brk_agro_workers.jpg"
                  alt={t.card1Title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />

                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-black/85 text-emerald-400 border border-emerald-400/40 uppercase shadow-md flex items-center gap-1 backdrop-blur-sm">
                    <SunMedium className="w-3.5 h-3.5" /> {t.card1Badge}
                  </span>
                </div>

                {/* Worker quote bubble */}
                <div className="absolute bottom-3 left-3 right-3 bg-black/85 backdrop-blur-md p-2.5 rounded-xl border border-stone-700 text-[11px] text-stone-200 italic shadow-lg">
                  {t.card1Quote}
                </div>
              </div>

              <div className="p-6">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
                  {t.card1Sub}
                </span>
                <h3 className="font-black text-white text-lg font-heading leading-tight mt-1">
                  {t.card1Title}
                </h3>
                <p className="text-xs text-stone-400 mt-2 line-clamp-2 leading-relaxed">
                  {t.card1Desc}
                </p>

                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-2xl font-black text-yellow-400 font-heading">
                    {currency} {t.card1Price}
                  </span>
                  <span className="text-xs text-stone-500 line-through">
                    {currency} {t.card1OldPrice}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0">
              <button
                onClick={() => {
                  addToCart(camisaVerde, 'M', 1);
                }}
                className="w-full py-3.5 px-4 rounded-xl font-black text-xs uppercase tracking-wider bg-[#FFE600] text-black hover:bg-yellow-400 shadow-md flex items-center justify-center gap-2 transition active:scale-95"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{t.card1Btn}</span>
              </button>
            </div>
          </div>

          {/* Card 2: Botina de Trabalho Couro (Mud speckles) */}
          <div className="bg-[#141916] rounded-3xl overflow-hidden border border-stone-800/90 shadow-2xl flex flex-col justify-between group hover:border-yellow-400 hover:glow-yellow transition-all duration-500">
            <div>
              <div className="relative aspect-square overflow-hidden bg-stone-900">
                <img
                  src="/brk_leather_boot.jpg"
                  alt={t.card2Title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />

                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-black/85 text-yellow-400 border border-yellow-400/40 uppercase shadow-md flex items-center gap-1 backdrop-blur-sm">
                    <ShieldCheck className="w-3.5 h-3.5" /> {t.card2Badge}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 bg-black/85 backdrop-blur-md p-2.5 rounded-xl border border-stone-700 text-[11px] text-stone-200 italic shadow-lg">
                  {t.card2Quote}
                </div>
              </div>

              <div className="p-6">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-500">
                  {t.card2Sub}
                </span>
                <h3 className="font-black text-white text-lg font-heading leading-tight mt-1">
                  {t.card2Title}
                </h3>
                <p className="text-xs text-stone-400 mt-2 line-clamp-2 leading-relaxed">
                  {t.card2Desc}
                </p>

                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-2xl font-black text-yellow-400 font-heading">
                    {currency} {t.card2Price}
                  </span>
                  <span className="text-xs text-stone-500 line-through">
                    {currency} {t.card2OldPrice}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0">
              <button
                onClick={() => {
                  addToCart(botinaCouro, '41', 1);
                }}
                className="w-full py-3.5 px-4 rounded-xl font-black text-xs uppercase tracking-wider bg-[#FFE600] text-black hover:bg-yellow-400 shadow-md flex items-center justify-center gap-2 transition active:scale-95"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{t.card2Btn}</span>
              </button>
            </div>
          </div>

          {/* Card 3: Camisa UV50+ Verde Agro (Felipe R. Quote) */}
          <div className="bg-[#141916] rounded-3xl overflow-hidden border border-stone-800/90 shadow-2xl flex flex-col justify-between group hover:border-yellow-400 hover:glow-yellow transition-all duration-500">
            <div>
              <div className="relative aspect-square overflow-hidden bg-stone-900">
                <img
                  src="https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80"
                  alt={t.card3Title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />

                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-black/85 text-emerald-400 border border-emerald-400/40 uppercase shadow-md flex items-center gap-1 backdrop-blur-sm">
                    <SunMedium className="w-3.5 h-3.5" /> {t.card3Badge}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 bg-black/85 backdrop-blur-md p-2.5 rounded-xl border border-stone-700 text-[11px] text-stone-200 italic shadow-lg">
                  {t.card3Quote}
                </div>
              </div>

              <div className="p-6">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
                  {t.card3Sub}
                </span>
                <h3 className="font-black text-white text-lg font-heading leading-tight mt-1">
                  {t.card3Title}
                </h3>
                <p className="text-xs text-stone-400 mt-2 line-clamp-2 leading-relaxed">
                  {t.card3Desc}
                </p>

                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-2xl font-black text-yellow-400 font-heading">
                    {currency} {t.card3Price}
                  </span>
                  <span className="text-xs text-stone-500 line-through">
                    {currency} {t.card3OldPrice}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0">
              <button
                onClick={() => {
                  addToCart(camisaVerde, 'G/L', 1);
                }}
                className="w-full py-3.5 px-4 rounded-xl font-black text-xs uppercase tracking-wider bg-[#FFE600] text-black hover:bg-yellow-400 shadow-md flex items-center justify-center gap-2 transition active:scale-95"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{t.card3Btn}</span>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 6. "VOCES DEL CAMPO" TESTIMONIAL WIDGET WITH VERIFIED BADGES */}
      <section className="bg-[#121614] border-t border-stone-800 py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 pb-4 border-b border-stone-800">
            <div>
              <span className="text-xs font-black text-yellow-400 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                <span>{t.testiTag}</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white font-heading uppercase mt-1">
                {t.testiTitle}
              </h2>
            </div>
            <p className="text-xs text-stone-400 max-w-md leading-relaxed">
              {t.testiDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-[#181f1b] p-6 rounded-3xl border border-stone-800 space-y-4 hover:border-yellow-400/50 transition">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=120&q=80"
                  alt="Agricultor"
                  className="w-12 h-12 rounded-full object-cover border-2 border-yellow-400 shadow"
                />
                <div>
                  <div className="font-black text-white text-sm flex items-center gap-1.5">
                    <span>{t.t1Name}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div className="text-[11px] text-stone-400">{t.t1Role}</div>
                </div>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed italic">
                {t.t1Text}
              </p>
              <div className="flex text-yellow-400 text-xs">★★★★★</div>
            </div>

            <div className="bg-[#181f1b] p-6 rounded-3xl border border-stone-800 space-y-4 hover:border-emerald-400/50 transition">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                  alt="Vaquero"
                  className="w-12 h-12 rounded-full object-cover border-2 border-emerald-400 shadow"
                />
                <div>
                  <div className="font-black text-white text-sm flex items-center gap-1.5">
                    <span>{t.t2Name}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div className="text-[11px] text-stone-400">{t.t2Role}</div>
                </div>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed italic">
                {t.t2Text}
              </p>
              <div className="flex text-yellow-400 text-xs">★★★★★</div>
            </div>

            <div className="bg-[#181f1b] p-6 rounded-3xl border border-stone-800 space-y-4 hover:border-yellow-400/50 transition">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                  alt="Productora"
                  className="w-12 h-12 rounded-full object-cover border-2 border-yellow-400 shadow"
                />
                <div>
                  <div className="font-black text-white text-sm flex items-center gap-1.5">
                    <span>{t.t3Name}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div className="text-[11px] text-stone-400">{t.t3Role}</div>
                </div>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed italic">
                {t.t3Text}
              </p>
              <div className="flex text-yellow-400 text-xs">★★★★★</div>
            </div>

          </div>

        </div>
      </section>

      {/* 7. FULLSCREEN REEL / STORY MODAL (INTERACTIVE) */}
      {activeStoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className="relative max-w-sm w-full rounded-3xl overflow-hidden bg-stone-900 border-2 border-yellow-400 shadow-2xl">
            
            <button
              onClick={() => setActiveStoryModal(false)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 text-white hover:bg-black transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Reel media */}
            <div className="relative aspect-[9/16] w-full">
              <img
                src="/brk_reels_worker.jpg"
                alt="Reel"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />

              {/* Progress bar */}
              <div className="absolute top-3 left-3 right-12 h-1 bg-white/30 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-400 w-3/4 animate-pulse" />
              </div>

              {/* Reel details */}
              <div className="absolute bottom-6 left-5 right-5 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-yellow-400 text-black text-[10px] font-black uppercase">
                    {t.modalOrigProduct}
                  </span>
                  <span className="text-white text-xs font-bold">@brkagro_oficial</span>
                </div>

                <p className="text-xs text-stone-200">
                  {t.modalReelText}
                </p>

                <button
                  onClick={() => {
                    setActiveStoryModal(false);
                    addToCart(camisaVerde, 'G/L', 1);
                  }}
                  className="w-full py-3 rounded-xl font-black text-xs uppercase tracking-wider bg-[#FFE600] text-black shadow-lg hover:bg-yellow-400 transition"
                >
                  {t.modalBuyBtn} ({currency} {t.card1Price})
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Product Details Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onOpenSizeGuide={onOpenSizeGuide}
      />

      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
      />

    </div>
  );
};
