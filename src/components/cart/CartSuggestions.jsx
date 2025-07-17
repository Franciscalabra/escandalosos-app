import React, { useMemo } from 'react';
import { Coffee, Pizza, Plus, AlertCircle } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';

export const CartSuggestions = ({ cart, products, categories, config, onAddToCart, subtotal }) => {
  const suggestions = config.personalization?.suggestions;
  
  // Detectar si el carrito tiene bebidas o extras
  const cartCategories = useMemo(() => {
    const categoryIds = new Set();
    const categoryNames = new Set();
    
    cart.forEach(item => {
      item.categories?.forEach(cat => {
        categoryIds.add(cat.id);
        categoryNames.add(cat.name.toLowerCase());
      });
    });
    
    return { ids: categoryIds, names: categoryNames };
  }, [cart]);
  
  const hasDrinks = cartCategories.names.has('bebidas') || 
                    cartCategories.names.has('bebida') || 
                    cartCategories.names.has('drinks');
                    
  const hasExtras = cartCategories.names.has('agregados') || 
                    cartCategories.names.has('extras') || 
                    cartCategories.names.has('complementos');
  
  // Obtener productos sugeridos
  const suggestedProducts = useMemo(() => {
    if (!suggestions?.enabled || subtotal < suggestions.threshold) return [];
    
    const suggested = [];
    
    // Sugerir bebidas si no hay
    if (suggestions.drinks && !hasDrinks) {
      const drinkCategory = categories.find(cat => 
        cat.name.toLowerCase().includes('bebida') || 
        cat.name.toLowerCase().includes('drink')
      );
      
      if (drinkCategory) {
        const drinkProducts = products
          .filter(p => p.categories.some(c => c.id === drinkCategory.id))
          .slice(0, 3);
        
        if (drinkProducts.length > 0) {
          suggested.push({
            type: 'drinks',
            title: '¿Agregar una bebida?',
            icon: Coffee,
            products: drinkProducts
          });
        }
      }
    }
    
    // Sugerir extras si no hay
    if (suggestions.extras && !hasExtras) {
      const extrasCategory = categories.find(cat => 
        cat.name.toLowerCase().includes('agregado') || 
        cat.name.toLowerCase().includes('extra') || 
        cat.name.toLowerCase().includes('complemento')
      );
      
      if (extrasCategory) {
        const extraProducts = products
          .filter(p => p.categories.some(c => c.id === extrasCategory.id))
          .slice(0, 3);
        
        if (extraProducts.length > 0) {
          suggested.push({
            type: 'extras',
            title: '¿Complementar tu pedido?',
            icon: Pizza,
            products: extraProducts
          });
        }
      }
    }
    
    return suggested;
  }, [suggestions, subtotal, hasDrinks, hasExtras, categories, products]);
  
  if (suggestedProducts.length === 0) return null;
  
  return (
    <div className="space-y-4 mt-6">
      {suggestedProducts.map(suggestion => (
        <div key={suggestion.type} className="bg-yellow-50 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <suggestion.icon className="h-5 w-5 text-yellow-600 mr-2" />
            <h4 className="font-bold text-yellow-800">{suggestion.title}</h4>
          </div>
          
          <div className="space-y-2">
            {suggestion.products.map(product => (
              <div 
                key={product.id} 
                className="bg-white rounded-lg p-3 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <img 
                    src={product.images?.[0]?.src || '/api/placeholder/50/50'} 
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div>
                    <p className="font-medium text-sm">{product.name}</p>
                    <p className="text-sm text-gray-600">{formatPrice(product.price)}</p>
                  </div>
                </div>
                <button
                  onClick={() => onAddToCart(product)}
                  className="p-2 rounded-lg transition-colors flex items-center"
                  style={{ 
                    backgroundColor: config.colors.buttons?.primary || config.colors.primary,
                    color: config.colors.buttons?.text || '#ffffff'
                  }}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};