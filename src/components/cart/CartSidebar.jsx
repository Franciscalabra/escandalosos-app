import React from 'react';
import { ShoppingCart, X, AlertCircle, Plus } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useConfig } from '../../context/ConfigContext';
import { useWooCommerce } from '../../hooks/useWooCommerce';
import { formatPrice } from '../../utils/formatters';
import { CartItem } from './CartItem';
import { CartSummary } from './CartSummary';
import { CartSuggestions } from './CartSuggestions';
import { useDiscounts } from '../../hooks/useDiscounts';
import { PendingDiscounts } from './PendingDiscounts';

export const CartSidebar = ({ onCheckout }) => {
  const { 
    cart, 
    cartOpen, 
    setCartOpen, 
    updateQuantity, 
    removeFromCart, 
    getCartTotal,
    getCartItemsCount,
    deliveryMethod,
    setDeliveryMethod,
    addToCart
  } = useCart();
  
  const { config } = useConfig();
  const { getCurrentShippingCost, shippingMethods, freeShippingAmount, products, categories } = useWooCommerce();
  const { calculateDiscounts } = useDiscounts();
  
  const subtotal = getCartTotal();
  const discounts = calculateDiscounts(cart, subtotal);
  const subtotalWithDiscounts = subtotal - discounts.total;
  const shippingCost = getCurrentShippingCost(subtotalWithDiscounts, deliveryMethod);
  const total = subtotalWithDiscounts + shippingCost;

  const handleCheckout = () => {
    setCartOpen(false);
    onCheckout();
  };

  return (
    <div className={`fixed inset-0 z-50 ${cartOpen ? 'visible' : 'invisible'}`}>
      {/* Overlay */}
      <div 
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          cartOpen ? 'opacity-50' : 'opacity-0'
        }`}
        onClick={() => setCartOpen(false)}
      />
      
      {/* Sidebar */}
      <div className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform duration-300 ${
        cartOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-bold uppercase" style={{ fontFamily: 'Anton, sans-serif' }}>
              MI CARRITO ({getCartItemsCount()})
            </h2>
            <button
              onClick={() => setCartOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-lg"
              style={{ outline: 'none', border: 'none' }}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {cart.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500 uppercase" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  TU CARRITO ESTÁ VACÍO
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map(item => (
                  <CartItem 
                    key={item.id} 
                    item={item} 
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeFromCart}
                    primaryColor={config.colors.primary}
                  />
                ))}
                
                {/* Descuentos aplicados */}
                {discounts.applied.length > 0 && (
                  <div className="bg-green-50 rounded-lg p-3 mt-4">
                    <h4 className="font-bold text-green-800 mb-2 text-sm uppercase">
                      Descuentos Aplicados
                    </h4>
                    {discounts.applied.map(discount => (
                      <div key={discount.ruleId} className="flex justify-between text-sm mb-1">
                        <span className="text-green-700">{discount.description}</span>
                        <span className="font-medium text-green-800">
                          -{formatPrice(discount.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Descuentos pendientes */}
                <PendingDiscounts 
                  cart={cart}
                  discountRules={config.discounts?.rules || []}
                  currentTotal={subtotal}
                  onAddToCart={addToCart}
                  products={products}
                />
                
                {/* Sugerencias inteligentes */}
                <CartSuggestions 
                  cart={cart}
                  products={products}
                  categories={categories}
                  config={config}
                  onAddToCart={addToCart}
                  subtotal={subtotal}
                />
              </div>
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="border-t p-4 space-y-4">
              {/* Resumen de carrito con métodos de entrega */}
              <CartSummary
                subtotal={subtotal}
                discounts={discounts}
                shippingCost={shippingCost}
                total={total}
                deliveryMethod={deliveryMethod}
                shippingMethods={shippingMethods}
                freeShippingAmount={freeShippingAmount}
                primaryColor={config.colors.primary}
                secondaryColor={config.colors.secondary}
                onDeliveryMethodChange={setDeliveryMethod}
                config={config}
              />

              <button
                onClick={handleCheckout}
                className="w-full py-3 rounded-lg font-bold hover:opacity-90 transition-colors uppercase"
                style={{ 
                  fontFamily: 'Poppins, sans-serif', 
                  outline: 'none', 
                  border: 'none',
                  backgroundColor: config.colors.buttons?.primary || config.colors.primary,
                  color: config.colors.buttons?.text || '#ffffff'
                }}
              >
                PROCEDER AL PAGO
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};