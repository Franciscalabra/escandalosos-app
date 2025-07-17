import React from 'react';
import { Truck, MapPin, Tag } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';

export const CartSummary = ({ 
  subtotal,
  subtotalWithDiscounts, // <-- Usaremos este para más claridad
  discounts,
  shippingCost, 
  total, 
  deliveryMethod,
  shippingMethods,
  freeShippingAmount,
  primaryColor,
  secondaryColor,
  onDeliveryMethodChange,
  config 
}) => {
  const hasShipping = shippingMethods.some(m => 
    m.enabled && (m.method_id === 'flat_rate' || m.method_id === 'free_shipping')
  );

  const isFreeShipping = config.shipping.freeShippingEnabled && 
    (subtotalWithDiscounts || subtotal) >= freeShippingAmount;

  return (
    <div className="space-y-4">
      {/* Selector de método de entrega */}
      <div className="space-y-3">
        <h3 className="font-bold text-sm uppercase" style={{ fontFamily: 'Poppins, sans-serif' }}>
          MÉTODO DE ENTREGA
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {hasShipping && (
            <button
              onClick={() => onDeliveryMethodChange('delivery')}
              className={`p-3 rounded-lg transition-all ${
                deliveryMethod === 'delivery' 
                  ? 'text-white' 
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
              style={{ 
                outline: 'none',
                backgroundColor: deliveryMethod === 'delivery' ? primaryColor : undefined
              }}
            >
              <Truck className="h-5 w-5 mx-auto mb-1" />
              <span className="text-xs font-bold uppercase" style={{ fontFamily: 'Poppins, sans-serif' }}>
                DELIVERY
              </span>
            </button>
          )}
          
          <button
            onClick={() => onDeliveryMethodChange('pickup')}
            className={`p-3 rounded-lg transition-all ${
              deliveryMethod === 'pickup' 
                ? 'text-white' 
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
            style={{ 
              outline: 'none',
              backgroundColor: deliveryMethod === 'pickup' ? primaryColor : undefined
            }}
          >
            <MapPin className="h-5 w-5 mx-auto mb-1" />
            <span className="text-xs font-bold uppercase" style={{ fontFamily: 'Poppins, sans-serif' }}>
              RETIRO
            </span>
          </button>
        </div>
        
        <DeliveryMethodInfo 
          deliveryMethod={deliveryMethod} 
          config={config} 
        />
      </div>

      {/* Desglose de costos */}
      <div className="border-t pt-4 space-y-3">
        
        {/* === BLOQUE DE SUBTOTAL CORREGIDO === */}
        {discounts.total > 0 ? (
          // Vista CON descuentos
          <>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 uppercase line-through" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Subtotal:
              </span>
              <span className="font-medium text-gray-500 line-through">{formatPrice(subtotal)}</span>
            </div>
            {discounts.applied.map(discount => (
              <div key={discount.ruleId} className="flex justify-between text-sm">
                <span className="text-green-600 flex items-center">
                  <Tag className="h-3 w-3 mr-1" />
                  {discount.description}:
                </span>
                <span className="font-medium text-green-600">
                  -{formatPrice(discount.amount)}
                </span>
              </div>
            ))}
             <div className="flex justify-between text-sm font-bold pt-1 border-t border-dashed">
              <span className="uppercase" style={{ fontFamily: 'Poppins, sans-serif' }}>Nuevo Subtotal:</span>
              <span>{formatPrice(subtotalWithDiscounts)}</span>
            </div>
          </>
        ) : (
          // Vista SIN descuentos
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 uppercase" style={{ fontFamily: 'Poppins, sans-serif' }}>
              SUBTOTAL:
            </span>
            <span className="font-medium">{formatPrice(subtotal)}</span>
          </div>
        )}
        
        {/* Costo de envío */}
        {deliveryMethod === 'delivery' && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 uppercase" style={{ fontFamily: 'Poppins, sans-serif' }}>
              ENVÍO:
            </span>
            <span className={`font-medium ${shippingCost === 0 ? 'text-green-600' : ''}`}>
              {shippingCost === 0 ? 'GRATIS' : formatPrice(shippingCost)}
            </span>
          </div>
        )}
        
        {/* Mensaje de envío gratis */}
        {deliveryMethod === 'delivery' && config.shipping.freeShippingEnabled && !isFreeShipping && (
          <div 
            className="bg-opacity-10 rounded-lg p-3 text-sm"
            style={{ 
              backgroundColor: `${secondaryColor}20`,
              color: '#000'
            }}
          >
            <p className="font-semibold">
              ¡Agrega {formatPrice(freeShippingAmount - (subtotalWithDiscounts || subtotal))} más para envío gratis!
            </p>
            <div className="mt-2 bg-gray-200 rounded-full h-2">
              <div 
                className="h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${Math.min(((subtotalWithDiscounts || subtotal) / freeShippingAmount) * 100, 100)}%`,
                  backgroundColor: primaryColor
                }}
              />
            </div>
          </div>
        )}
        
        {/* Total */}
        <div className="flex justify-between text-lg font-bold pt-3 border-t">
          <span className="uppercase" style={{ fontFamily: 'Anton, sans-serif' }}>
            TOTAL:
          </span>
          <span style={{ color: primaryColor }}>
            {formatPrice(total)}
          </span>
        </div>
      </div>
    </div>
  );
};

// Componente interno para información del método de entrega
const DeliveryMethodInfo = ({ deliveryMethod, config }) => {
  if (deliveryMethod === 'pickup') {
    return (
      <div className="bg-gray-50 p-3 rounded-lg text-sm">
        <p className="font-semibold uppercase mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
          DIRECCIÓN DE RETIRO:
        </p>
        <p className="text-gray-600">{config.business.address}</p>
        <p className="text-gray-600 mb-2">{config.business.city}</p>
        
        <p className="font-semibold uppercase mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
          HORARIO:
        </p>
        <div className="text-gray-600 text-xs space-y-0.5">
          <p>LUN-JUE: {config.business.schedule.monday.open} - {config.business.schedule.monday.close}</p>
          <p>VIERNES: {config.business.schedule.friday.open} - {config.business.schedule.friday.close}</p>
          <p>SÁBADO: {config.business.schedule.saturday.open} - {config.business.schedule.saturday.close}</p>
          <p>DOMINGO: {config.business.schedule.sunday.open} - {config.business.schedule.sunday.close}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 p-3 rounded-lg text-sm">
      <p className="text-gray-600 uppercase font-semibold" style={{ fontFamily: 'Poppins, sans-serif' }}>
        ENVÍO A DOMICILIO
      </p>
      <p className="text-gray-600">Tiempo estimado: {config.texts.deliveryTime}</p>
      <p className="text-gray-500 text-xs mt-1">
        * El tiempo puede variar según la zona de entrega
      </p>
    </div>
  );
};