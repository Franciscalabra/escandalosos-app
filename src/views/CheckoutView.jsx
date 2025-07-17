// src/views/CheckoutView.jsx

import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useConfig } from '../context/ConfigContext';
import { useWooCommerce } from '../hooks/useWooCommerce';
import { useDiscounts } from '../hooks/useDiscounts';
import { wooCommerceService } from '../services/woocommerce';
import { whatsappService } from '../services/whatsapp';
import { isStoreOpen } from '../utils/formatters';
import { CheckoutForm } from '../components/checkout/CheckoutForm';
import { OrderSummary } from '../components/checkout/OrderSummary';
import { bodyScrollUtils } from '../styles/globals';

export const CheckoutView = ({ onViewChange }) => {
  const { config } = useConfig();
  const { cart, clearCart, getCartTotal, deliveryMethod } = useCart();
  const { getCurrentShippingCost, paymentMethods, selectedPaymentMethod, setSelectedPaymentMethod } = useWooCommerce();
  const { calculateDiscounts } = useDiscounts();
  
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', address: '', notes: ''
  });
  
  const [orderLoading, setOrderLoading] = useState(false);
  const storeOpen = isStoreOpen(config.business.schedule);

  const subtotal = getCartTotal();
  const discounts = calculateDiscounts(cart, subtotal);
  const subtotalWithDiscounts = subtotal - discounts.total;
  const shippingCost = getCurrentShippingCost(subtotalWithDiscounts, deliveryMethod);
  const total = subtotalWithDiscounts + shippingCost;

  useEffect(() => {
    bodyScrollUtils.scrollToTop();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.phone) {
      alert('Por favor completa todos los campos requeridos');
      return false;
    }
    if (deliveryMethod === 'delivery' && !formData.address) {
      alert('Por favor ingresa tu dirección de entrega');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setOrderLoading(true);
    
    try {
      const selectedPayment = paymentMethods.find(m => m.id === selectedPaymentMethod);
      
      const shippingLines = deliveryMethod === 'delivery' && shippingCost > 0 ? [{
        method_id: "flat_rate",
        method_title: "Envío estándar",
        total: shippingCost.toString()
      }] : [];
      
      const orderData = {
        payment_method: selectedPaymentMethod,
        payment_method_title: selectedPayment?.title || "Pago contra entrega",
        set_paid: false,
        billing: {
          first_name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address_1: deliveryMethod === 'delivery' ? formData.address : 'Retiro en local',
          city: config.business.city,
          state: "Santiago",
          country: "CL"
        },
        shipping: deliveryMethod === 'delivery' ? {
          first_name: formData.name,
          address_1: formData.address,
          city: config.business.city,
          state: "Santiago",
          country: "CL"
        } : {
          first_name: formData.name,
          address_1: config.business.address,
          city: config.business.city,
          state: "Santiago",
          country: "CL"
        },
        line_items: cart.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          meta_data: item.modifications ? [{ key: '_personalization', value: JSON.stringify(item.modifications) }] : []
        })),
        shipping_lines: shippingLines,
        customer_note: formData.notes || '',
        meta_data: [
          { key: "_delivery_method", value: deliveryMethod },
          { key: "_order_sent_to_whatsapp", value: "pending" }
        ]
      };
      
      const order = await wooCommerceService.createOrder(orderData);
      
      whatsappService.sendOrder(
        formData, order.number || order.id, cart, deliveryMethod, selectedPayment, shippingCost, config, total, discounts
      );
      
      await wooCommerceService.updateOrder(order.id, {
        meta_data: [{ key: "_order_sent_to_whatsapp", value: "sent" }]
      });
      
      alert(`¡Pedido #${order.number || order.id} creado con éxito! Te contactaremos por WhatsApp para confirmar.`);
      clearCart();
      onViewChange('home');
    } catch (error) {
      console.error('Error:', error);
      const selectedPayment = paymentMethods.find(m => m.id === selectedPaymentMethod);
      whatsappService.sendOrder(
        formData, 'MANUAL-' + Date.now(), cart, deliveryMethod, selectedPayment, shippingCost, config, total, discounts
      );
      alert('¡Pedido enviado! Te contactaremos por WhatsApp para confirmar.');
      clearCart();
      onViewChange('home');
    } finally {
      setOrderLoading(false);
    }
  };

  useEffect(() => {
    if (cart.length === 0 && !orderLoading) {
      onViewChange('home');
    }
  }, [cart, orderLoading, onViewChange]);

  const StoreClosedWarning = () => (
    <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
      <p className="font-bold uppercase" style={{ fontFamily: 'Poppins, sans-serif' }}>
         ATENCIÓN: ACTUALMENTE ESTAMOS CERRADOS
      </p>
      <p className="text-sm mt-1">
        Tu pedido será procesado cuando abramos. Revisa nuestros horarios de atención.
      </p>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 uppercase" style={{ fontFamily: 'Anton, sans-serif' }}>
          FINALIZAR COMPRA
        </h1>
        
        {!storeOpen && <StoreClosedWarning />}
        
        <div className="grid md:grid-cols-2 gap-8">
          <CheckoutForm
            formData={formData}
            handleInputChange={handleInputChange}
            deliveryMethod={deliveryMethod}
            paymentMethods={paymentMethods}
            selectedPaymentMethod={selectedPaymentMethod}
            setSelectedPaymentMethod={setSelectedPaymentMethod}
            config={config}
          />

          <OrderSummary
            cart={cart}
            deliveryMethod={deliveryMethod}
            shippingCost={shippingCost}
            subtotal={subtotal}
            discounts={discounts}
            total={total}
            selectedPaymentMethod={selectedPaymentMethod}
            paymentMethods={paymentMethods}
            orderLoading={orderLoading}
            handleSubmit={handleSubmit}
            config={config}
          />
        </div>
      </div>
    </div>
  );
};