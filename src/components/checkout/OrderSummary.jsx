import React from 'react';
import { formatPrice } from '../../utils/formatters';

export const OrderSummary = ({
  cart,
  deliveryMethod,
  shippingCost,
  total,
  discounts,
  selectedPaymentMethod,
  paymentMethods,
  orderLoading,
  handleSubmit,
  config
}) => {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4 uppercase" style={{ fontFamily: 'Anton, sans-serif' }}>
        RESUMEN DEL PEDIDO
      </h2>
      
      {/* Método de entrega seleccionado */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="font-bold uppercase text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
            MÉTODO DE ENTREGA:
          </span>
          <span className="font-bold uppercase" style={{ color: config.colors.primary }}>
            {deliveryMethod === 'delivery' ? 'DELIVERY' : 'RETIRO EN LOCAL'}
          </span>
        </div>
        {deliveryMethod === 'pickup' && (
          <div className="text-sm text-gray-600 mt-2">
            <p>{config.business.address}</p>
            <p>{config.business.city}</p>
          </div>
        )}
      </div>
      
      {/* Lista de productos */}
      <div className="space-y-3">
        {cart.map(item => (
          <div key={item.id} className="flex justify-between py-2">
            <span className="text-gray-600">{item.name} x{item.quantity}</span>
            <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
          </div>
        ))}
        
        {/* Totales */}
        <div className="border-t pt-3">
          <div className="flex justify-between">
            <span className="uppercase" style={{ fontFamily: 'Poppins, sans-serif' }}>SUBTOTAL</span>
            <span>{formatPrice(subtotal)}</span>
          </div>

          {/* Descuentos aplicados */}
{discounts && discounts.total > 0 && (
  <div className="border-t pt-3 mt-3">
    <h4 className="font-bold text-sm uppercase mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
      DESCUENTOS APLICADOS:
    </h4>
    {discounts.applied.map(discount => (
      <div key={discount.ruleId} className="flex justify-between text-sm mb-1">
        <span className="text-green-600">{discount.description}</span>
        <span className="font-medium text-green-600">
          -{formatPrice(discount.amount)}
        </span>
      </div>
    ))}
    <div className="flex justify-between text-sm font-bold mt-2">
      <span>TOTAL DESCUENTOS:</span>
      <span className="text-green-600">-{formatPrice(discounts.total)}</span>
    </div>
  </div>
)}
          
          {deliveryMethod === 'delivery' && (
            <div className="flex justify-between mt-2">
              <span className="uppercase" style={{ fontFamily: 'Poppins, sans-serif' }}>ENVÍO</span>
              <span className={shippingCost === 0 ? 'text-green-600 font-bold' : ''}>
                {shippingCost === 0 ? 'GRATIS' : formatPrice(shippingCost)}
              </span>
            </div>
          )}
          
          <div className="flex justify-between mt-3 pt-3 border-t text-lg font-bold">
            <span className="uppercase" style={{ fontFamily: 'Anton, sans-serif' }}>TOTAL</span>
            <span style={{ color: config.colors.primary }}>{formatPrice(total)}</span>
          </div>
        </div>
      </div>
      
      {/* Método de pago seleccionado */}
      {selectedPaymentMethod && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm font-bold uppercase" style={{ fontFamily: 'Poppins, sans-serif' }}>
            PAGO:
          </p>
          <p className="text-sm text-gray-600">
            {paymentMethods.find(m => m.id === selectedPaymentMethod)?.title}
          </p>
        </div>
      )}
      
      {/* Botón de confirmar */}
      <button
        onClick={handleSubmit}
        disabled={orderLoading || !selectedPaymentMethod}
        className={`w-full mt-6 py-3 rounded-lg font-bold transition-colors uppercase text-white ${
          orderLoading || !selectedPaymentMethod
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'hover:opacity-90'
        }`}
        style={{ 
          fontFamily: 'Poppins, sans-serif',
          backgroundColor: orderLoading || !selectedPaymentMethod ? undefined : config.colors.primary
        }}
      >
        {orderLoading ? 'PROCESANDO...' : 'CONFIRMAR PEDIDO'}
      </button>
      
      <div className="mt-4 text-xs text-gray-500 text-center">
        <p className="uppercase">AL CONFIRMAR RECIBIRÁS UN MENSAJE POR WHATSAPP</p>
      </div>
    </div>
  );
};