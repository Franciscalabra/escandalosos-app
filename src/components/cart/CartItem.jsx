import React from 'react';
import { Plus, Minus, X, Clock, Package } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';

export const CartItem = ({ item, onUpdateQuantity, onRemove, primaryColor }) => {
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 0) {
      onUpdateQuantity(item.id, newQuantity);
    }
  };

  const hasHappyHour = item.happy_hour_discount?.active;
  const isCombo = item.isCombo;

  return (
    <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
      {/* Imagen del producto */}
      <div className="flex-shrink-0">
        <img 
          src={item.images?.[0]?.src || '/api/placeholder/80/80'} 
          alt={item.name}
          className="w-20 h-20 object-cover rounded"
        />
      </div>
      
      {/* Información del producto */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <h4 className="font-medium text-gray-900 uppercase truncate" 
              style={{ fontFamily: 'Poppins, sans-serif' }}>
            {item.name}
          </h4>
          {hasHappyHour && (
            <span className="flex items-center text-xs text-orange-600 font-semibold whitespace-nowrap">
              <Clock className="h-3 w-3 mr-1" />
              Happy Hour
            </span>
          )}
          {isCombo && (
            <span className="flex items-center text-xs text-yellow-600 font-semibold whitespace-nowrap">
              <Package className="h-3 w-3 mr-1" />
              Combo
            </span>
          )}
        </div>
        
        {item.description && (
          <p className="text-xs text-gray-600 mt-1 line-clamp-2" 
             style={{ textTransform: 'none' }}>
            {item.description}
          </p>
        )}
        
        {/* Mostrar selecciones del combo */}
        {isCombo && item.comboSelections && (
          <div className="mt-2 bg-gray-100 rounded p-2 text-xs">
            <p className="font-semibold mb-1">Incluye:</p>
            {Object.entries(item.comboSelections).map(([subcatId, products]) => (
              <div key={subcatId} className="ml-2">
                {products.map(product => (
                  <p key={product.id} className="text-gray-600">• {product.name}</p>
                ))}
              </div>
            ))}
          </div>
        )}
        
        <div className="flex items-center justify-between mt-2">
          <div>
            {hasHappyHour && (
              <p className="text-xs text-gray-400 line-through">
                {formatPrice(item.original_price)}
              </p>
            )}
            <p className="text-gray-700 font-semibold">
              {formatPrice(item.price)}
            </p>
          </div>
          
          {/* Controles de cantidad */}
          <div className="flex items-center">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
              style={{ outline: 'none', border: 'none' }}
              aria-label="Disminuir cantidad"
            >
              <Minus className="h-4 w-4" />
            </button>
            
            <span className="mx-3 font-medium min-w-[2rem] text-center">
              {item.quantity}
            </span>
            
            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
              style={{ outline: 'none', border: 'none' }}
              aria-label="Aumentar cantidad"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {/* Subtotal del item */}
        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm text-gray-500">Subtotal:</span>
          <span className="font-semibold" style={{ color: hasHappyHour ? '#ff6b35' : primaryColor }}>
            {formatPrice(item.price * item.quantity)}
          </span>
        </div>
        
        {hasHappyHour && (
          <div className="mt-1 text-xs text-orange-600">
            Ahorro: {formatPrice((item.original_price - item.price) * item.quantity)}
          </div>
        )}
      </div>
      
      {/* Botón de eliminar */}
      <button
        onClick={() => onRemove(item.id)}
        className="p-2 hover:bg-gray-200 rounded transition-colors"
        style={{ outline: 'none', border: 'none' }}
        aria-label="Eliminar del carrito"
      >
        <X className="h-4 w-4 text-gray-500" />
      </button>
    </div>
  );
};