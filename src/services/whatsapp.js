import { formatPrice } from '../utils/formatters';

export const whatsappService = {
  sendOrder(orderDetails, orderNumber, cart, deliveryMethod, paymentMethod, shippingCost, config) {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) + shippingCost;
    
    const message = `🍕 *Nuevo Pedido #${orderNumber} - ${config.business.name}*\n\n` +
      `*Cliente:* ${orderDetails.name}\n` +
      `*Teléfono:* ${orderDetails.phone}\n` +
      `*Email:* ${orderDetails.email}\n` +
      `*Método:* ${deliveryMethod === 'delivery' ? 'DELIVERY' : 'RETIRO EN LOCAL'}\n` +
      `${deliveryMethod === 'delivery' ? `*Dirección:* ${orderDetails.address}\n` : `*Retiro en:* ${config.business.address}, ${config.business.city}\n`}\n` +
      `*Método de Pago:* ${paymentMethod?.title || 'No especificado'}\n\n` +
      `*Productos:*\n${cart.map(item => {
        let productText = `• ${item.name} x${item.quantity} - ${formatPrice(item.price * item.quantity)}`;
        
        // Agregar detalles del combo si aplica
        if (item.isCombo && item.comboSelections) {
          productText += '\n  _Incluye:_';
          Object.values(item.comboSelections).forEach(products => {
            products.forEach(product => {
              productText += `\n    - ${product.name}`;
              
              // Agregar modificaciones de ingredientes
              if (product.modifications) {
                if (product.modifications.removed?.length > 0) {
                  productText += `\n      ❌ Sin: ${product.modifications.removed.join(', ')}`;
                }
                if (product.modifications.added?.length > 0) {
                  productText += `\n      ✅ Extra: ${product.modifications.added.join(', ')} (+${formatPrice(config.extraIngredientPrice * product.modifications.added.length)})`;
                }
              }
            });
          });
        }
        
        return productText;
      }).join('\n')}\n\n` +
      `*Subtotal:* ${formatPrice(cart.reduce((sum, item) => sum + (item.price * item.quantity), 0))}\n` +
      `${shippingCost > 0 ? `*Envío:* ${formatPrice(shippingCost)}\n` : ''}` +
      `*Total:* ${formatPrice(total)}\n\n` +
      `*Notas:* ${orderDetails.notes || 'Sin notas'}`;
    
    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = config.business.phone.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
  }
};