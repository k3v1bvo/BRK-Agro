# 🌾 BRK Agro Bolivia — Sistema E-Commerce & ERP Agropecuario

Aplicación web integral inspirada en **BRK Agro Brasil**, diseñada específicamente para la venta y control de inventario de indumentaria agropecuaria (Camisas técnicas UV50+, Botinas de trabajo en cuero legítimo engrasado, Jeans reforzados 14.5oz, Gorras trucker bordadas y accesorios para campo, ganadería e industria).

---

## 🚀 Características Principales

### 🛍️ 1. Módulo E-Commerce Público
- **Diseño Ultra-Premium Country / Agro:** Tipografía contemporánea (*Outfit*, *Plus Jakarta Sans* y *Syne*), paleta cromática de lujo inspirada en cuero vacuno y verde esmeralda.
- **Protección UV50+ Certificada:** Badges de factor de protección solar real y garantía de 1er cambio de talla gratuito.
- **Calculadora / Guía de Tallas Interactiva:** Sugiere la talla ideal para camisas analizando estatura y peso, y número de calzado mediante medición en centímetros del pie.
- **Carrito con Precios Mayoristas Automáticos:** Aplica automáticamente tarifa por mayor a partir de 3 unidades y resalta el ahorro obtenido.
- **Checkout directo a WhatsApp:** Genera pedido con código `#BRK-XXXX` y redirige a `wa.me` con el mensaje formateado con emojis, prendas, tallas, bordado personalizado y totales.
- **Widget Flotante de Atención Técnica:** Asistente ganadero en línea para resolver dudas en vivo.

### ⚙️ 2. Panel Administrativo ERP (`/admin`)
- **Dashboard Financiero de 5 Tarjetas:**
  1. Ventas Brutas (Efectivo vs QR)
  2. Costo de Mercadería Vendida (CMV)
  3. Ganancia Bruta (`Ventas - CMV`)
  4. Gastos Operativos & Pagos de Personal
  5. 💰 **Utilidad Neta Real (Ganancia Limpia del Dueño)**
- **Bandeja de Pedidos WhatsApp:** Aprobación en 1 clic que descuenta stock por talla y acredita dinero en caja.
- **POS Mostrador:** Venta rápida en tienda física con selección de prendas, tallas y cobro inmediato.
- **Control de Cuentas por Cobrar (Fiados / Saldos Pendientes):** Registro de cobranzas parciales o contra-entrega.
- **Asistente de "🔄 Cambio de Talla Express":** Reintegra al stock la prenda devuelta (+1) y descuenta la nueva talla (-1) con doble registro en Kardex.
- **Inventario Matricial por Tallas:** Control visual de stock con chips de advertencia de stock bajo y modal para reponer stock rápido (`+30`, `+50`).
- **Caja Chica & Arqueo Diario:** Monitor separado de efectivo en cajón vs QR banco, registro de sueldos/adelantos y acta de cierre.
- **Centro de Impresiones:**
  - Nota de Venta / Recibo.
  - 📦 Rótulo / Etiqueta de Encomienda a Provincia (formato gigante para pegar en flotas/expresos).
  - Acta de Arqueo y Balance Diario.
- **Personalización de Marca en Vivo (White-Label):** Modifica en vivo nombre, slogan, colores, moneda y WhatsApp frente al cliente.

---

## 🛠️ Stack Tecnológico

- **Frontend:** React 19 + Vite 8 + TypeScript
- **Estilos:** Tailwind CSS v4 + Vanilla CSS Tokens
- **Iconografía:** Lucide React
- **Imágenes:** Integración con ImgBB API v1 (`eab6ae5aafbda13b9f3b4cb86600f61c`) y compresión local a WebP en Canvas
- **Base de Datos:** Arquitectura Híbrida (Supabase PostgreSQL + Fallback LocalStorage)
- **Efectos:** Canvas Confetti

---

## 🗄️ Base de Datos Supabase

El archivo `supabase_schema.sql` contiene todas las tablas, relaciones, índices y políticas RLS:
- `store_settings`
- `products`
- `product_variants`
- `whatsapp_orders`
- `sales`
- `cash_movements`
- `kardex_movements`
- `size_exchanges`

### Conexión Directa PostgreSQL
```bash
postgresql://postgres:delunoalnueve_19@db.rwnuknrqjolwvvgfandg.supabase.co:5432/postgres
```

---

## 📦 Despliegue en Vercel

1. Sube este repositorio a GitHub (`https://github.com/k3v1bvo/BRK-Agro.git`).
2. En el panel de Vercel, importa el repositorio `k3v1bvo/BRK-Agro`.
3. Configura las variables de entorno:
   - `VITE_SUPABASE_URL`: `https://rwnuknrqjolwvvgfandg.supabase.co`
   - `VITE_IMGBB_API_KEY`: `eab6ae5aafbda13b9f3b4cb86600f61c`
4. Presiona **Deploy**.
