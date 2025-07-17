import React from 'react';
import { CreditCard, DollarSign, Wallet } from 'lucide-react';

export const PaymentMethods = ({
  paymentMethods,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  primaryColor
}) => {
  const getPaymentIcon = (methodId) => {
    switch(methodId) {
      case 'cod':
        return <DollarSign className="h-5 w-5" />;
      case 'bacs':
        return <Wallet className="h-5 w-5" />;
      default:
        return <CreditCard className="h-5 w-5" />;
    }
  };

  return (
    <div className="mt-6">
      <h3 className="font-bold text-sm uppercase mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
        MÉTODO DE PAGO
      </h3>
      <div className="space-y-2">
        {paymentMethods.map(method => (
          <label 
            key={method.id}
            className={`flex items-center p-3 rounded-lg cursor-pointer transition-all ${
              selectedPaymentMethod === method.id
                ? 'bg-opacity-10 border-2'
                : 'bg-gray-50 border-2 border-gray-200 hover:bg-gray-100'
            }`}
            style={{
              backgroundColor: selectedPaymentMethod === method.id ? `${primaryColor}20` : undefined,
              borderColor: selectedPaymentMethod === method.id ? primaryColor : undefined
            }}
          >
            <input
              type="radio"
              name="payment_method"
              value={method.id}
              checked={selectedPaymentMethod === method.id}
              onChange={(e) => setSelectedPaymentMethod(e.target.value)}
              className="sr-only"
            />
            <div className="flex items-center flex-1">
              {getPaymentIcon(method.id)}
              <div className="ml-3">
                <p className="font-medium uppercase text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {method.title}
                </p>
                {method.description && (
                  <p className="text-xs text-gray-600 mt-1" style={{ textTransform: 'none' }}>
                    {method.description}
                  </p>
                )}
              </div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};