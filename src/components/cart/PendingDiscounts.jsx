import React, { useMemo } from 'react';
import { Tag, ShoppingCart } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';

export const PendingDiscounts = ({ cart, discountRules, currentTotal, onAddToCart, products }) => {
  const pendingDiscounts = useMemo(() => {
    const pending = [];
    
    discountRules.forEach(rule => {
      if (!rule.enabled) return;
      
      switch (rule.type) {
        case 'buyXgetY': {
          // Contar productos elegibles
          const eligibleItems = cart.filter(item => {
            if (rule.conditions.categories?.length > 0) {
              return item.categories?.some(cat => 
                rule.conditions.categories.includes(cat.id.toString())
              );
            }
            return false;
          });
          
          const totalQuantity = eligibleItems.reduce((sum, item) => sum + item.quantity, 0);
          const needed = rule.conditions.minQuantity - totalQuantity;
          
          if (needed > 0 && needed <= 2) {
            pending.push({
              type: 'quantity',
              description: `Agrega ${needed} producto${needed > 1 ? 's' : ''} más para ${rule.name}`,
              needed: needed,
              rule: rule,
              suggestedCategory: rule.conditions.categories?.[0]
            });
          }
          break;
        }
        
        case 'percentage': {
          if (rule.conditions.minAmount && currentTotal < rule.conditions.minAmount) {
            const needed = rule.conditions.minAmount - currentTotal;
            if (needed < 10000) { // Solo mostrar si falta menos de $10.000
              pending.push({
                type: 'amount',
                description: `Agrega ${formatPrice(needed)} más para ${rule.value}% de descuento`,
                needed: needed,
                rule: rule
              });
            }
          }
          break;
        }
      }
    });
    
    return pending;
  }, [cart, discountRules, currentTotal]);
  
  if (pendingDiscounts.length === 0) return null;
  
  return (
    <div className="bg-blue-50 rounded-lg p-4 mt-4">
      <div className="flex items-center mb-2">
        <Tag className="h-5 w-5 text-blue-600 mr-2" />
        <h4 className="font-bold text-blue-800">Casi tienes un descuento!</h4>
      </div>
      
      {pendingDiscounts.map((pending, index) => (
        <div key={index} className="mb-3">
          <p className="text-sm text-blue-700 mb-2">{pending.description}</p>
          
          {pending.type === 'quantity' && pending.suggestedCategory && (
            <div className="flex flex-col gap-2">
              {products
                .filter(p => p.categories.some(c => c.id.toString() === pending.suggestedCategory))
                .slice(0, 2)
                .map(product => (
                  <button
                    key={product.id}
                    onClick={() => onAddToCart(product)}
                    className="bg-white rounded p-2 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="flex items-center space-x-2">
                      <img 
                        src={product.images?.[0]?.src || '/api/placeholder/40/40'} 
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                      <div>
                        <p className="text-sm font-medium">{product.name}</p>
                        <p className="text-xs text-gray-600">{formatPrice(product.price)}</p>
                      </div>
                    </div>
                    <ShoppingCart className="h-4 w-4 text-blue-600" />
                  </button>
                ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};