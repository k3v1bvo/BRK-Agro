const { Client } = require('pg');

const connectionString = 'postgresql://postgres:delunoalnueve_19@db.rwnuknrqjolwvvgfandg.supabase.co:5432/postgres';

async function seed() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();
  console.log('Connected to Supabase for seeding...');

  // 1. Settings
  await client.query(`
    INSERT INTO public.store_settings (
      store_name, slogan, announcement_bar, currency, primary_color, accent_color, whatsapp_number, address, imgbb_api_key
    ) VALUES (
      'BRK AGRO BOLIVIA',
      'Indumentaria & Calzado Agropecuario • Calidad y Protección UV50+',
      '🚚 Envíos diarios a todo el país | ☀️ Protección UV50+ Certificada | 🔄 1er Cambio de Talla Gratis',
      'Bs.',
      '#0B4F26',
      '#D97706',
      '59178541236',
      'Av. Cristo Redentor 4to Anillo, Santa Cruz de la Sierra',
      'eab6ae5aafbda13b9f3b4cb86600f61c'
    ) ON CONFLICT DO NOTHING;
  `);

  // 2. Products
  const products = [
    {
      id: 'prod-brk-01',
      name: 'Camisa Agro BRK UV50+ Verde Esmeralda (Hombre)',
      category: 'Camisas UV50+',
      gender: 'Hombre',
      cost_price: 110,
      sale_price: 220,
      wholesale_price: 190,
      wholesale_min_qty: 3,
      allow_customization: true,
      customization_price: 25,
      description: 'Tejido Dry-Fit Pro con factor de protección solar UV50+ permanente. Máxima transpirabilidad en jornadas de campo, secado ultra-rápido y costuras reforzadas anti-desgarre. Ideal para ganaderos, ingenieros agrónomos y trabajo pesado.',
      image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80',
      badges: ['☀️ UV50+', '🔥 Más Vendido', '📦 Mayorista desde 3 u.'],
      variants: [
        { size: 'P/S', stock: 8 },
        { size: 'M', stock: 15 },
        { size: 'G/L', stock: 3 },
        { size: 'GG/XL', stock: 12 },
        { size: 'XGG', stock: 0 },
      ]
    },
    {
      id: 'prod-brk-02',
      name: 'Botina de Trabajo BRK Cuero Legítimo Café (Unisex)',
      category: 'Botinas de Trabajo',
      gender: 'Unisex',
      cost_price: 210,
      sale_price: 380,
      wholesale_price: 340,
      wholesale_min_qty: 3,
      allow_customization: false,
      customization_price: 0,
      description: 'Fabricada en cuero vacuno engrasado 100% legítimo de alta resistencia a la humedad, barro y estiércol. Elásticos laterales dobles para calce rápido, plantilla acolchada de confort anti-fatiga y suela antideslizante cosida a mano.',
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&q=80',
      badges: ['🛡️ Cuero 100%', '💪 Trabajo Pesado', '📦 Mayorista desde 3 pares'],
      variants: [
        { size: '38', stock: 4 },
        { size: '39', stock: 10 },
        { size: '40', stock: 14 },
        { size: '41', stock: 2 },
        { size: '42', stock: 8 },
        { size: '43', stock: 0 },
      ]
    },
    {
      id: 'prod-brk-03',
      name: 'Camisa Agro BRK UV50+ Rosa Country (Mujer)',
      category: 'Mujer',
      gender: 'Mujer',
      cost_price: 105,
      sale_price: 210,
      wholesale_price: 185,
      wholesale_min_qty: 3,
      allow_customization: true,
      customization_price: 25,
      description: 'Corte anatómico entallado femenino. Tecnología de protección solar UV50+ que bloquea el 98% de los rayos UVA/UVB.',
      image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=900&q=80',
      badges: ['☀️ UV50+', '🌸 Colección Femenina', '📦 Mayorista desde 3 u.'],
      variants: [
        { size: 'PP', stock: 5 },
        { size: 'P', stock: 12 },
        { size: 'M', stock: 9 },
        { size: 'G', stock: 4 },
        { size: 'GG', stock: 2 },
      ]
    },
    {
      id: 'prod-brk-04',
      name: 'Pantalón Jeans Agro Reforzado Carpenter (Hombre)',
      category: 'Jeans',
      gender: 'Hombre',
      cost_price: 130,
      sale_price: 260,
      wholesale_price: 230,
      wholesale_min_qty: 3,
      allow_customization: false,
      customization_price: 0,
      description: 'Denim grueso de 14.5 oz 100% algodón prelavado con triple costura reforzada en tiro y entrepierna.',
      image: 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=900&q=80',
      badges: ['💪 Denim 14.5oz', '🛡️ Triple Costura', '📦 Mayorista desde 3 u.'],
      variants: [
        { size: '38', stock: 6 },
        { size: '40', stock: 11 },
        { size: '42', stock: 8 },
        { size: '44', stock: 3 },
        { size: '46', stock: 5 },
      ]
    },
    {
      id: 'prod-brk-05',
      name: 'Gorra Trucker BRK Agro Bordada Edición Especial',
      category: 'Gorras y Accesorios',
      gender: 'Unisex',
      cost_price: 35,
      sale_price: 85,
      wholesale_price: 65,
      wholesale_min_qty: 6,
      allow_customization: false,
      customization_price: 0,
      description: 'Frente estructurado con bordado 3D de alta densidad del logo BRK Agro, malla lateral trasera transpirable.',
      image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=900&q=80',
      badges: ['🧢 Trucker Snapback', '🔥 Edición Especial', '📦 Mayorista desde 6 u.'],
      variants: [
        { size: 'Única Ajustable', stock: 35 },
      ]
    },
    {
      id: 'prod-brk-06',
      name: 'Camisa Infantil Mini-Agro UV50+ Azul (Infantil)',
      category: 'Infantil',
      gender: 'Infantil',
      cost_price: 75,
      sale_price: 150,
      wholesale_price: 130,
      wholesale_min_qty: 3,
      allow_customization: true,
      customization_price: 20,
      description: 'Para los pequeños ganaderos del hogar. Protección UV50+ total para días de campo, feria ganadera y cabalgatas.',
      image: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=900&q=80',
      badges: ['☀️ UV50+ Niños', '🧸 Hipoalergénico'],
      variants: [
        { size: 'Talla 4', stock: 5 },
        { size: 'Talla 6', stock: 8 },
        { size: 'Talla 8', stock: 2 },
        { size: 'Talla 10', stock: 6 },
      ]
    }
  ];

  for (const p of products) {
    await client.query(`
      INSERT INTO public.products (
        id, name, category, gender, cost_price, sale_price, wholesale_price, wholesale_min_qty, allow_customization, customization_price, description, image, badges
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        sale_price = EXCLUDED.sale_price,
        cost_price = EXCLUDED.cost_price;
    `, [
      p.id, p.name, p.category, p.gender, p.cost_price, p.sale_price, p.wholesale_price, p.wholesale_min_qty, p.allow_customization, p.customization_price, p.description, p.image, p.badges
    ]);

    for (const v of p.variants) {
      await client.query(`
        INSERT INTO public.product_variants (product_id, size, stock)
        VALUES ($1, $2, $3)
        ON CONFLICT (product_id, size) DO UPDATE SET stock = EXCLUDED.stock;
      `, [p.id, v.size, v.stock]);
    }
  }

  // 3. Orders
  await client.query(`
    INSERT INTO public.whatsapp_orders (
      id, customer_name, customer_phone, customer_city, delivery_method, delivery_address, transport_company, items, total_amount, total_cost, status
    ) VALUES 
    (
      'BRK-1048',
      'Ing. Carlos Méndez',
      '59177392810',
      'Montero',
      'Encomienda Provincia',
      'Terminal de Montero - Caseta Expreso Minero',
      'Flota Trans Copacabana',
      '[{"productName": "Camisa Agro BRK UV50+ Verde Esmeralda (Hombre)", "quantity": 4, "size": "G/L", "unitPrice": 190, "subtotal": 760}, {"productName": "Botina de Trabajo BRK Cuero Legítimo Café (Unisex)", "quantity": 1, "size": "41", "unitPrice": 380, "subtotal": 380}]',
      1140.00,
      650.00,
      'PENDIENTE'
    ),
    (
      'BRK-1049',
      'Hacienda El Porvenir (Sandra Rojas)',
      '59178120499',
      'Santa Cruz Centro',
      'Delivery',
      'Calle Beni #450',
      NULL,
      '[{"productName": "Gorra Trucker BRK Agro Bordada Edición Especial", "quantity": 6, "size": "Única Ajustable", "unitPrice": 65, "subtotal": 390}, {"productName": "Camisa Agro BRK UV50+ Rosa Country (Mujer)", "quantity": 3, "size": "M", "unitPrice": 185, "subtotal": 555}]',
      945.00,
      525.00,
      'PENDIENTE'
    )
    ON CONFLICT (id) DO NOTHING;
  `);

  console.log('Seeding completed successfully!');
  await client.end();
}

seed().catch(console.error);
