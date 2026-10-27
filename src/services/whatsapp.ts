import { WhatsAppOrder, StoreSettings } from '../types';

export function formatWhatsAppMessage(order: WhatsAppOrder, settings: StoreSettings): string {
  const currency = settings.currency || 'Bs.';
  
  let msg = `🤠 *¡HOLA ${settings.storeName.toUpperCase()}! QUIERO CONFIRMAR MI PEDIDO* 🌾\n\n`;
  msg += `📋 *Código de Pedido:* #${order.id}\n`;
  msg += `👤 *Cliente:* ${order.customerName}\n`;
  msg += `📞 *Teléfono:* ${order.customerPhone}\n`;
  msg += `📍 *Destino:* ${order.customerCity}\n`;
  msg += `🚚 *Modalidad:* ${order.deliveryMethod}\n`;
  if (order.deliveryAddress) {
    msg += `🏠 *Dirección/Punto de Entrega:* ${order.deliveryAddress}\n`;
  }
  if (order.transportCompany) {
    msg += `🚌 *Transporte Preferido:* ${order.transportCompany}\n`;
  }
  
  msg += `\n📦 *DETALLE DE PRENDAS:* \n`;
  order.items.forEach((item, idx) => {
    msg += `${idx + 1}. *${item.quantity}x* ${item.productName}\n`;
    msg += `   └ Talla: *${item.size}* | Subtotal: ${currency} ${item.subtotal.toLocaleString()}\n`;
    if (item.customText) {
      msg += `   └ ✍️ *Personalización:* "${item.customText}"\n`;
    }
  });

  msg += `\n💰 *TOTAL A PAGAR: ${currency} ${order.totalAmount.toLocaleString()}*\n`;
  msg += `\n☀️ *Garantía:* Protección UV50+ Real y 1er Cambio de Talla Gratis.\n`;
  msg += `Quedo atento a los datos para la transferencia / QR o pago contra-entrega. ¡Muchas gracias!`;

  return msg;
}

export function generateWhatsAppLink(order: WhatsAppOrder, settings: StoreSettings): string {
  const cleanPhone = (settings.whatsappNumber || '59178541236').replace(/\D/g, '');
  const text = formatWhatsAppMessage(order, settings);
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}
