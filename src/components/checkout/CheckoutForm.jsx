import React from 'react';
import { PaymentMethods } from './PaymentMethods';

export const CheckoutForm = ({
  formData,
  handleInputChange,
  deliveryMethod,
  paymentMethods,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  config
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4 uppercase" style={{ fontFamily: 'Anton, sans-serif' }}>
        INFORMACIÓN {deliveryMethod === 'delivery' ? 'DE ENTREGA' : 'DE RETIRO'}
      </h2>
      
      {/* Mostrar información de retiro si aplica */}
      {deliveryMethod === 'pickup' && (
        <div 
          className="bg-opacity-10 border rounded-lg p-4 mb-4"
          style={{ 
            backgroundColor: `${config.colors.primary}20`,
            borderColor: config.colors.primary
          }}
        >
          <h3 className="font-bold uppercase mb-2" 
              style={{ fontFamily: 'Poppins, sans-serif', color: config.colors.primary }}>
            DIRECCIÓN DE RETIRO:
          </h3>
          <p className="text-gray-700 font-semibold">{config.business.address}</p>
          <p className="text-gray-700">{config.business.city}</p>
          <p className="text-sm text-gray-600 mt-2">
            HORARIO:
            <br />LUN-JUE: {config.business.schedule.monday.open} - {config.business.schedule.monday.close}
            <br />VIERNES: {config.business.schedule.friday.open} - {config.business.schedule.friday.close}
            <br />SÁBADO: {config.business.schedule.saturday.open} - {config.business.schedule.saturday.close}
            <br />DOMINGO: {config.business.schedule.sunday.open} - {config.business.schedule.sunday.close}
          </p>
        </div>
      )}
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 uppercase" 
                 style={{ fontFamily: 'Poppins, sans-serif' }}>
            NOMBRE COMPLETO *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
            style={{ focusRingColor: config.colors.primary }}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1 uppercase" 
                 style={{ fontFamily: 'Poppins, sans-serif' }}>
            EMAIL *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1 uppercase" 
                 style={{ fontFamily: 'Poppins, sans-serif' }}>
            TELÉFONO *
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="+569XXXXXXXX"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
          />
        </div>
        
        {deliveryMethod === 'delivery' && (
          <div>
            <label className="block text-sm font-medium mb-1 uppercase" 
                   style={{ fontFamily: 'Poppins, sans-serif' }}>
              DIRECCIÓN DE ENTREGA *
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="CALLE, NÚMERO, COMUNA"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
            />
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium mb-1 uppercase" 
                 style={{ fontFamily: 'Poppins, sans-serif' }}>
            NOTAS (OPCIONAL)
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            rows="3"
            placeholder={deliveryMethod === 'delivery' 
              ? "EJ: DEPTO 301, TIMBRE NO FUNCIONA" 
              : "EJ: LLEGAMOS EN 20 MINUTOS"}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
          />
        </div>
      </div>
      
      {/* Métodos de Pago */}
      {paymentMethods.length > 0 && (
        <PaymentMethods
          paymentMethods={paymentMethods}
          selectedPaymentMethod={selectedPaymentMethod}
          setSelectedPaymentMethod={setSelectedPaymentMethod}
          primaryColor={config.colors.primary}
        />
      )}
    </div>
  );
};