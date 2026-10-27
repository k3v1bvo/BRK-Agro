import React, { useState } from 'react';
import { 
  Package, 
  Plus, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Edit, 
  Trash2, 
  RefreshCw, 
  History,
  Upload,
  ArrowUpRight,
  TrendingDown,
  Sparkles
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product, ProductCategory, ProductGender, ProductVariant } from '../../types';
import { uploadToImgBB } from '../../services/imgbb';

export const InventoryTab: React.FC = () => {
  const { settings, products, saveProduct, deleteProduct, replenishStock, kardex } = useStore();
  const currency = settings.currency || 'Bs.';

  const [activeSubTab, setActiveSubTab] = useState<'matrix' | 'kardex'>('matrix');

  // Replenish Modal State
  const [replenishProduct, setReplenishProduct] = useState<Product | null>(null);
  const [replenishQuantities, setReplenishQuantities] = useState<{ [size: string]: number }>({});
  const [newCostPrice, setNewCostPrice] = useState<number>(0);

  // Product Form Modal State (Create / Edit)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState<boolean>(false);
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<ProductCategory>('Camisas UV50+');
  const [formGender, setFormGender] = useState<ProductGender>('Hombre');
  const [formCostPrice, setFormCostPrice] = useState<number>(100);
  const [formSalePrice, setFormSalePrice] = useState<number>(200);
  const [formWholesalePrice, setFormWholesalePrice] = useState<number>(175);
  const [formWholesaleMinQty, setFormWholesaleMinQty] = useState<number>(3);
  const [formAllowCustomization, setFormAllowCustomization] = useState<boolean>(false);
  const [formCustomizationPrice, setFormCustomizationPrice] = useState<number>(25);
  const [formDescription, setFormDescription] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formVariants, setFormVariants] = useState<ProductVariant[]>([
    { size: 'P/S', stock: 10 },
    { size: 'M', stock: 15 },
    { size: 'G/L', stock: 12 },
    { size: 'GG/XL', stock: 8 },
  ]);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Open replenish modal
  const handleOpenReplenish = (prod: Product) => {
    setReplenishProduct(prod);
    const initialMap: { [size: string]: number } = {};
    prod.variants.forEach((v) => {
      initialMap[v.size] = 0;
    });
    setReplenishQuantities(initialMap);
    setNewCostPrice(prod.costPrice);
  };

  const handleSaveReplenish = () => {
    if (!replenishProduct) return;
    const items = Object.entries(replenishQuantities)
      .filter(([_, qty]) => qty > 0)
      .map(([size, addQty]) => ({ size, addQty }));

    if (items.length === 0) {
      alert('Ingresa al menos 1 unidad en alguna de las tallas para reponer.');
      return;
    }

    replenishStock(replenishProduct.id, items, newCostPrice > 0 ? newCostPrice : undefined);
    setReplenishProduct(null);
  };

  // Open Create Product
  const handleOpenCreateProduct = () => {
    setEditingProduct(null);
    setFormName('');
    setFormCategory('Camisas UV50+');
    setFormGender('Hombre');
    setFormCostPrice(100);
    setFormSalePrice(200);
    setFormWholesalePrice(175);
    setFormWholesaleMinQty(3);
    setFormAllowCustomization(true);
    setFormCustomizationPrice(25);
    setFormDescription('Prenda con protección UV50+ confeccionada con tejido Dry-Fit de alta tecnología para trabajo pesado en campo.');
    setFormImage('https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80');
    setFormVariants([
      { size: 'P/S', stock: 10 },
      { size: 'M', stock: 15 },
      { size: 'G/L', stock: 12 },
      { size: 'GG/XL', stock: 8 },
    ]);
    setIsProductModalOpen(true);
  };

  // Open Edit Product
  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setFormName(prod.name);
    setFormCategory(prod.category);
    setFormGender(prod.gender);
    setFormCostPrice(prod.costPrice);
    setFormSalePrice(prod.salePrice);
    setFormWholesalePrice(prod.wholesalePrice);
    setFormWholesaleMinQty(prod.wholesaleMinQty);
    setFormAllowCustomization(prod.allowCustomization);
    setFormCustomizationPrice(prod.customizationPrice);
    setFormDescription(prod.description);
    setFormImage(prod.image);
    setFormVariants([...prod.variants]);
    setIsProductModalOpen(true);
  };

  // Image upload handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    try {
      const res = await uploadToImgBB(file, settings.imgbbApiKey);
      setFormImage(res.url);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSaveProductForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      alert('Ingresa el nombre del producto');
      return;
    }

    const prodToSave: Product = {
      id: editingProduct ? editingProduct.id : `prod-brk-${Date.now()}`,
      name: formName.trim(),
      category: formCategory,
      gender: formGender,
      costPrice: Number(formCostPrice),
      salePrice: Number(formSalePrice),
      wholesalePrice: Number(formWholesalePrice),
      wholesaleMinQty: Number(formWholesaleMinQty),
      allowCustomization: formAllowCustomization,
      customizationPrice: Number(formCustomizationPrice),
      description: formDescription,
      image: formImage || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
      badges: editingProduct ? editingProduct.badges : ['☀️ UV50+', '🔥 Nuevo'],
      variants: formVariants,
      createdAt: editingProduct ? editingProduct.createdAt : new Date().toISOString(),
    };

    saveProduct(prodToSave);
    setIsProductModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & Sub tabs */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-200 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('matrix')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeSubTab === 'matrix'
                ? 'bg-stone-900 text-amber-400 shadow-sm'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Matriz de Inventario por Tallas</span>
          </button>

          <button
            onClick={() => setActiveSubTab('kardex')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeSubTab === 'kardex'
                ? 'bg-stone-900 text-amber-400 shadow-sm'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Kardex de Movimientos ({kardex.length})</span>
          </button>
        </div>

        <button
          onClick={handleOpenCreateProduct}
          className="px-4 py-2 rounded-xl font-black text-xs uppercase tracking-wider text-white shadow flex items-center gap-1.5 transition hover:opacity-95"
          style={{ backgroundColor: settings.primaryColor }}
        >
          <Plus className="w-4 h-4" />
          <span>+ Nuevo Producto Agro</span>
        </button>
      </div>

      {/* SUB-TAB 1: MATRIX INVENTORY TABLE */}
      {activeSubTab === 'matrix' && (
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
          <div className="p-5 border-b border-stone-200 flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-stone-900">
                Inventario Matricial en Tiempo Real
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Control de stock exacto por talla, costo de fábrica, precio mayorista y reposición inmediata
              </p>
            </div>
            <div className="text-xs font-bold text-stone-500">
              Total Artículos:{' '}
              <span className="text-sm font-black text-stone-900">
                {products.reduce((acc, p) => acc + p.variants.reduce((vSum, v) => vSum + v.stock, 0), 0)} u.
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-500 font-extrabold uppercase border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Prenda / Categoría</th>
                  <th className="py-3 px-4">Costo</th>
                  <th className="py-3 px-4">Venta</th>
                  <th className="py-3 px-4">Mayorista (3+ u.)</th>
                  <th className="py-3 px-4">Stock Matricial por Tallas</th>
                  <th className="py-3 px-4 text-center">Stock Total</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium">
                {products.map((prod) => {
                  const totalProdStock = prod.variants.reduce((s, v) => s + v.stock, 0);

                  return (
                    <tr key={prod.id} className="hover:bg-stone-50 transition">
                      
                      {/* Product Name & Photo */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-12 h-12 object-cover rounded-xl bg-stone-100 shrink-0"
                          />
                          <div>
                            <div className="font-extrabold text-stone-900 text-sm leading-snug">
                              {prod.name}
                            </div>
                            <div className="text-[11px] text-stone-500 flex items-center gap-1.5 mt-0.5">
                              <span className="text-amber-800 font-semibold">{prod.category}</span>
                              <span>•</span>
                              <span>{prod.gender}</span>
                              {prod.allowCustomization && (
                                <span className="text-emerald-700 bg-emerald-50 px-1.5 rounded text-[10px]">
                                  Personalizable (+{currency} {prod.customizationPrice})
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Cost */}
                      <td className="py-3.5 px-4 font-bold text-stone-600">
                        {currency} {prod.costPrice}
                      </td>

                      {/* Sale Price */}
                      <td className="py-3.5 px-4 font-black text-stone-900 text-sm">
                        {currency} {prod.salePrice}
                      </td>

                      {/* Wholesale Price */}
                      <td className="py-3.5 px-4 font-extrabold text-emerald-700">
                        {currency} {prod.wholesalePrice}
                      </td>

                      {/* Matrix Chips */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1.5">
                          {prod.variants.map((v) => {
                            const isZero = v.stock === 0;
                            const isLow = v.stock > 0 && v.stock <= 3;
                            return (
                              <span
                                key={v.size}
                                className={`px-2 py-1 rounded-lg text-[11px] font-black border flex items-center gap-1 ${
                                  isZero
                                    ? 'bg-rose-50 text-rose-700 border-rose-200 line-through'
                                    : isLow
                                    ? 'bg-amber-50 text-amber-900 border-amber-300 animate-pulse'
                                    : 'bg-emerald-50 text-emerald-900 border-emerald-200'
                                }`}
                              >
                                <span>{v.size}:</span>
                                <span>{v.stock}</span>
                                {isZero && <span>❌</span>}
                                {isLow && <span>⚠️</span>}
                              </span>
                            );
                          })}
                        </div>
                      </td>

                      {/* Total Stock */}
                      <td className="py-3.5 px-4 text-center">
                        <span className={`px-2.5 py-1 rounded-xl font-black text-xs ${
                          totalProdStock === 0
                            ? 'bg-red-100 text-red-700'
                            : totalProdStock <= 8
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-stone-100 text-stone-800'
                        }`}>
                          {totalProdStock} u.
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenReplenish(prod)}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-white shadow flex items-center gap-1 hover:opacity-90"
                            style={{ backgroundColor: settings.primaryColor }}
                            title="Ingreso de mercadería por tallas"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>+ Reponer Stock</span>
                          </button>

                          <button
                            onClick={() => handleOpenEditProduct(prod)}
                            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100"
                            title="Editar Producto"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`¿Eliminar ${prod.name}?`)) {
                                deleteProduct(prod.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-stone-100"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: KARDEX MOVEMENTS TABLE */}
      {activeSubTab === 'kardex' && (
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
          <div className="p-5 border-b border-stone-200 flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-stone-900">
                Kardex de Movimientos Físicos de Inventario
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Registro inmutable de ventas, reposiciones de fábrica y cambios de talla
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-500 font-extrabold uppercase border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Fecha / Hora</th>
                  <th className="py-3 px-4">Tipo</th>
                  <th className="py-3 px-4">Prenda & Talla</th>
                  <th className="py-3 px-4 text-center">Variación</th>
                  <th className="py-3 px-4 text-center">Stock Previo</th>
                  <th className="py-3 px-4 text-center">Nuevo Stock</th>
                  <th className="py-3 px-4">Referencia / Motivo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium">
                {kardex.map((k) => (
                  <tr key={k.id} className="hover:bg-stone-50">
                    <td className="py-3 px-4 font-mono text-stone-600">{k.date}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                        k.type === 'VENTA'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : k.type === 'REPOSICION'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : k.type === 'CAMBIO_DEVOLUCION'
                          ? 'bg-blue-50 text-blue-800 border border-blue-200'
                          : 'bg-purple-50 text-purple-800 border border-purple-200'
                      }`}>
                        {k.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-stone-900">
                      {k.productName} <span className="text-amber-800">[Talla {k.size}]</span>
                    </td>
                    <td className="py-3 px-4 text-center font-black text-sm">
                      <span className={k.quantity > 0 ? 'text-emerald-700' : 'text-rose-600'}>
                        {k.quantity > 0 ? `+${k.quantity}` : k.quantity}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center text-stone-500">{k.previousStock}</td>
                    <td className="py-3 px-4 text-center font-bold text-stone-900">{k.newStock}</td>
                    <td className="py-3 px-4 text-stone-500 text-[11px]">{k.notes || k.referenceId || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: STOCK REPLENISH BY SIZES */}
      {replenishProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-stone-100">
              <h3 className="font-extrabold text-stone-900 text-base">
                + Reponer Stock: {replenishProduct.name}
              </h3>
              <button onClick={() => setReplenishProduct(null)} className="text-stone-400 hover:text-stone-700">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-stone-500">
              Ingresa la cantidad de unidades que llegaron por cada talla. El sistema actualizará el inventario y creará el movimiento en Kardex.
            </p>

            {/* Inputs per size */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-stone-700 uppercase">
                Unidades por Talla a Sumar (+30, +50, etc.):
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {replenishProduct.variants.map((v) => (
                  <div key={v.size} className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <div className="flex justify-between text-xs font-extrabold text-stone-800 mb-1">
                      <span>Talla {v.size}</span>
                      <span className="text-stone-400 text-[10px]">Act: {v.stock}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-emerald-700 font-black text-sm">+</span>
                      <input
                        type="number"
                        min="0"
                        value={replenishQuantities[v.size] || 0}
                        onChange={(e) =>
                          setReplenishQuantities({
                            ...replenishQuantities,
                            [v.size]: Math.max(0, Number(e.target.value)),
                          })
                        }
                        className="w-full text-xs font-black p-1.5 rounded-lg border border-stone-300 text-center"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Optional updated cost */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                Nuevo Costo de Fábrica por Prenda ({currency}):
              </label>
              <input
                type="number"
                value={newCostPrice}
                onChange={(e) => setNewCostPrice(Number(e.target.value))}
                className="w-full text-xs font-black p-2.5 rounded-xl border border-stone-300"
              />
              <span className="text-[11px] text-stone-400">
                Si el fabricante ajustó el costo de confección, actualízalo aquí.
              </span>
            </div>

            <div className="flex gap-3 pt-3">
              <button
                onClick={() => setReplenishProduct(null)}
                className="flex-1 py-2.5 rounded-xl font-bold text-xs border border-stone-200 text-stone-600"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveReplenish}
                className="flex-1 py-2.5 rounded-xl font-black text-xs uppercase text-white shadow"
                style={{ backgroundColor: settings.primaryColor }}
              >
                Guardar Reposición
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: PRODUCT CREATE / EDIT WITH IMGBB */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-stone-100">
              <h3 className="font-extrabold text-stone-900 text-base">
                {editingProduct ? 'Editar Prenda Agro' : 'Registrar Nueva Prenda en Catálogo'}
              </h3>
              <button onClick={() => setIsProductModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProductForm} className="space-y-4 text-xs">
              
              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">
                  Nombre del Producto *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Ej: Camisa Agro BRK UV50+ Verde Esmeralda"
                  className="w-full p-2.5 rounded-xl border border-stone-300 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">
                    Categoría
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as ProductCategory)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 font-bold"
                  >
                    <option value="Camisas UV50+">Camisas UV50+</option>
                    <option value="Botinas de Trabajo">Botinas de Trabajo</option>
                    <option value="Jeans">Jeans Reforzados</option>
                    <option value="Gorras y Accesorios">Gorras y Accesorios</option>
                    <option value="Mujer">Línea Mujer</option>
                    <option value="Infantil">Línea Infantil</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">
                    Público / Género
                  </label>
                  <select
                    value={formGender}
                    onChange={(e) => setFormGender(e.target.value as ProductGender)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 font-bold"
                  >
                    <option value="Hombre">Hombre</option>
                    <option value="Mujer">Mujer</option>
                    <option value="Unisex">Unisex</option>
                    <option value="Infantil">Infantil</option>
                  </select>
                </div>
              </div>

              {/* Pricing row */}
              <div className="grid grid-cols-3 gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">
                    Costo Fábrica ({currency}):
                  </label>
                  <input
                    type="number"
                    value={formCostPrice}
                    onChange={(e) => setFormCostPrice(Number(e.target.value))}
                    className="w-full font-bold p-2 rounded-lg border border-stone-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">
                    Precio Venta ({currency}):
                  </label>
                  <input
                    type="number"
                    value={formSalePrice}
                    onChange={(e) => setFormSalePrice(Number(e.target.value))}
                    className="w-full font-black p-2 rounded-lg border border-stone-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">
                    Mayorista ({currency}):
                  </label>
                  <input
                    type="number"
                    value={formWholesalePrice}
                    onChange={(e) => setFormWholesalePrice(Number(e.target.value))}
                    className="w-full font-extrabold text-emerald-800 p-2 rounded-lg border border-stone-300"
                  />
                </div>
              </div>

              {/* Image Upload with ImgBB + Canvas WebP */}
              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1 flex items-center justify-between">
                  <span>Foto del Producto</span>
                  <span className="text-[10px] text-amber-700">Soporta ImgBB API + Compresión WebP</span>
                </label>
                <div className="flex gap-3 items-center">
                  {formImage && (
                    <img
                      src={formImage}
                      alt="Preview"
                      className="w-14 h-14 object-cover rounded-xl border border-stone-300 shrink-0"
                    />
                  )}
                  <label className="flex-1 border-2 border-dashed border-stone-300 hover:border-amber-500 rounded-xl p-3 text-center cursor-pointer transition">
                    <span className="flex items-center justify-center gap-2 font-bold text-stone-600">
                      <Upload className="w-4 h-4 text-amber-600" />
                      {isUploadingImage ? 'Comprimiendo y subiendo...' : 'Subir Imagen desde el dispositivo'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <input
                  type="text"
                  placeholder="O pega una URL de imagen directa (Unsplash/ImgBB)"
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  className="w-full mt-2 p-2 rounded-lg border border-stone-300 text-[11px]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">
                  Descripción Técnica de Campo:
                </label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300"
                />
              </div>

              {/* Tallas Iniciales */}
              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">
                  Stock Inicial por Tallas:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {formVariants.map((v, i) => (
                    <div key={i} className="p-2 bg-stone-50 rounded-lg border border-stone-200 flex items-center justify-between">
                      <span className="font-bold text-stone-800">{v.size}</span>
                      <input
                        type="number"
                        min="0"
                        value={v.stock}
                        onChange={(e) => {
                          const updated = [...formVariants];
                          updated[i].stock = Math.max(0, Number(e.target.value));
                          setFormVariants(updated);
                        }}
                        className="w-14 text-center p-1 rounded border border-stone-300 font-bold"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl font-bold border border-stone-200 text-stone-600"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl font-black text-xs uppercase text-white shadow"
                  style={{ backgroundColor: settings.primaryColor }}
                >
                  Guardar Producto
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
