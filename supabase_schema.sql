-- =========================================================================
-- ESQUEMA COMPLETO DE BASE DE DATOS SUPABASE PARA BRK AGRO BOLIVIA
-- Tablas, Tipos, Llaves Foráneas, Índices, RLS y Triggers
-- =========================================================================

-- 1. Habilitar extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLA: CONFIGURACIÓN DE TIENDA Y MARCA (White-Label)
CREATE TABLE IF NOT EXISTS public.store_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_name TEXT NOT NULL DEFAULT 'BRK AGRO BOLIVIA',
    slogan TEXT DEFAULT 'Indumentaria & Calzado Agropecuario • Calidad y Protección UV50+',
    announcement_bar TEXT DEFAULT '🚚 Envíos diarios a todo el país | ☀️ Protección UV50+ | 🔄 1er Cambio de Talla Gratis',
    currency VARCHAR(10) DEFAULT 'Bs.',
    primary_color VARCHAR(20) DEFAULT '#0B4F26',
    accent_color VARCHAR(20) DEFAULT '#D97706',
    whatsapp_number VARCHAR(30) DEFAULT '59178541236',
    address TEXT DEFAULT 'Av. Cristo Redentor 4to Anillo, Santa Cruz de la Sierra',
    bank_account_details TEXT DEFAULT 'Banco Ganadero: Cta Cte 1052-849201 a nombre de BRK Agro SRL',
    logo_url TEXT,
    imgbb_api_key TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. TABLA: PRODUCTOS
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    gender TEXT NOT NULL,
    cost_price NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    sale_price NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    wholesale_price NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    wholesale_min_qty INT NOT NULL DEFAULT 3,
    allow_customization BOOLEAN NOT NULL DEFAULT false,
    customization_price NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    description TEXT,
    image TEXT NOT NULL,
    images TEXT[],
    badges TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. TABLA: VARIANTES DE PRODUCTO (MATRIZ DE TALLAS Y STOCK)
CREATE TABLE IF NOT EXISTS public.product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    size TEXT NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    sku TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    UNIQUE(product_id, size)
);

-- 5. TABLA: PEDIDOS DE WHATSAPP (Bandeja Entrada ERP)
CREATE TABLE IF NOT EXISTS public.whatsapp_orders (
    id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_city TEXT NOT NULL,
    delivery_method TEXT NOT NULL,
    delivery_address TEXT,
    transport_company TEXT,
    items JSONB NOT NULL,
    total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    total_cost NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    status TEXT NOT NULL DEFAULT 'PENDIENTE', -- 'PENDIENTE', 'CONFIRMADO', 'CANCELADO'
    payment_method TEXT,
    amount_paid NUMERIC(12, 2) DEFAULT 0.00,
    pending_balance NUMERIC(12, 2) DEFAULT 0.00,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 6. TABLA: VENTAS REALIZADAS
CREATE TABLE IF NOT EXISTS public.sales (
    id TEXT PRIMARY KEY,
    order_code TEXT,
    customer_name TEXT NOT NULL,
    customer_phone TEXT,
    customer_city TEXT NOT NULL,
    delivery_method TEXT NOT NULL,
    transport_company TEXT,
    items JSONB NOT NULL,
    total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    total_cost NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    gross_profit NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    payment_method TEXT NOT NULL,
    cash_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    qr_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    amount_paid NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    pending_balance NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    status TEXT NOT NULL DEFAULT 'PAGADO', -- 'PAGADO', 'PENDIENTE_PAGO'
    seller_name TEXT DEFAULT 'Ventas',
    notes TEXT,
    date_str TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 7. TABLA: MOVIMIENTOS DE CAJA CHICA Y PAGOS DE PERSONAL
CREATE TABLE IF NOT EXISTS public.cash_movements (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL, -- 'APERTURA', 'INGRESO_VENTA', 'PAGO_PERSONAL', 'GASTO_OPERATIVO', 'RETIRO_SOCIO', 'COBRO_CREDITO'
    category TEXT NOT NULL, -- 'Sueldo', 'Adelanto', 'Comisión', 'Encomienda', 'Publicidad', 'Venta', etc.
    description TEXT NOT NULL,
    recipient_or_staff TEXT,
    amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    payment_channel TEXT NOT NULL, -- 'Efectivo', 'QR/Banco'
    reference_id TEXT,
    date_str TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 8. TABLA: KARDEX DE MOVIMIENTOS DE INVENTARIO
CREATE TABLE IF NOT EXISTS public.kardex_movements (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    product_name TEXT NOT NULL,
    size TEXT NOT NULL,
    type TEXT NOT NULL, -- 'VENTA', 'REPOSICION', 'CAMBIO_DEVOLUCION', 'CAMBIO_ENTREGA', 'AJUSTE'
    quantity INT NOT NULL,
    previous_stock INT NOT NULL,
    new_stock INT NOT NULL,
    reference_id TEXT,
    notes TEXT,
    date_str TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 9. TABLA: HISTORIAL DE CAMBIO DE TALLAS
CREATE TABLE IF NOT EXISTS public.size_exchanges (
    id TEXT PRIMARY KEY,
    sale_id TEXT,
    customer_name TEXT NOT NULL,
    customer_phone TEXT,
    product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    product_name TEXT NOT NULL,
    returned_size TEXT NOT NULL,
    new_size TEXT NOT NULL,
    reason TEXT NOT NULL,
    notes TEXT,
    date_str TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- =========================================================================
-- HABILITAR ROW LEVEL SECURITY (RLS)
-- =========================================================================
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cash_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kardex_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.size_exchanges ENABLE ROW LEVEL SECURITY;

-- Políticas de lectura pública para catálogo
CREATE POLICY "Public Read Settings" ON public.store_settings FOR SELECT USING (true);
CREATE POLICY "Public Read Products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public Read Variants" ON public.product_variants FOR SELECT USING (true);
CREATE POLICY "Public Insert WhatsApp Orders" ON public.whatsapp_orders FOR INSERT WITH CHECK (true);

-- Políticas de gestión para usuarios autenticados / service role
CREATE POLICY "Allow All for Authenticated" ON public.store_settings FOR ALL USING (true);
CREATE POLICY "Allow All Products Authenticated" ON public.products FOR ALL USING (true);
CREATE POLICY "Allow All Variants Authenticated" ON public.product_variants FOR ALL USING (true);
CREATE POLICY "Allow All Orders Authenticated" ON public.whatsapp_orders FOR ALL USING (true);
CREATE POLICY "Allow All Sales Authenticated" ON public.sales FOR ALL USING (true);
CREATE POLICY "Allow All Cash Movements Authenticated" ON public.cash_movements FOR ALL USING (true);
CREATE POLICY "Allow All Kardex Authenticated" ON public.kardex_movements FOR ALL USING (true);
CREATE POLICY "Allow All Exchanges Authenticated" ON public.size_exchanges FOR ALL USING (true);
