import React from 'react';
import { Plus, Minus, X, Clock, Package } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';

export const CartItem = ({ item, onUpdateQuantity, onRemove, primaryColor }) => {
  const handleQuantityChange = (newQuantity) => {
    // Evita que la cantidad sea menor a 1. Si es 0, se elimina.
    if (newQuantity > 0) {
      onUpdateQuantity(item.id, newQuantity);
    } else {
      onRemove(item.id); // Llama a onRemove si la cantidad llega a 0
    }
  };

  const hasHappyHour = item.happy_hour_discount?.active;
  const isCombo = item.isCombo;

  return (
    <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4">
      {/* Header con imagen y controles */}
      <div className="flex gap-3">
        {/* Imagen del producto */}
        <div className="flex-shrink-0">
          <img
            src={item.images?.[0]?.src || '/api/placeholder/80/80'}
            alt={item.name}
            className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg"
          />
        </div>

        {/* Información y controles */}
        <div className="flex-1 min-w-0">
          {/* Nombre y badges */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 mr-2">
              <h4
                className="font-bold text-base sm:text-lg text-gray-900 uppercase line-clamp-2"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                {item.name}
              </h4>

              {/* Badges en línea */}
              <div className="flex flex-wrap gap-1 mt-1">
                {hasHappyHour && (
                  <span className="inline-flex items-center text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium">
                    <Clock className="h-3 w-3 mr-0.5" />
                    Happy Hour
                  </span>
                )}
                {isCombo && (
                  <span className="inline-flex items-center text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">
                    <Package className="h-3 w-3 mr-0.5" />
                    Combo
                  </span>
                )}
              </div>
            </div>

            {/* Botón eliminar */}
            <button
              onClick={() => onRemove(item.id)}
              className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
              aria-label="Eliminar del carrito"
            >
              <X className="h-5 w-5 text-gray-400 group-hover:text-red-500" />
            </button>
          </div>

          {/* Precio y cantidad */}
          <div className="flex items-end justify-between">
            {/* Precios */}
            <div>
              {hasHappyHour && (
                <p className="text-xs text-gray-400 line-through">
                  {formatPrice(item.original_price)}
                </p>
              )}
              <p
                className="text-lg sm:text-xl font-bold"
                style={{ color: hasHappyHour ? '#ff6b35' : '#000' }}
              >
                {formatPrice(item.price)}
              </p>
              {hasHappyHour && (
                <p className="text-xs text-orange-600 font-medium">
                  Ahorra {formatPrice(item.original_price - item.price)}
                </p>
              )}
            </div>

            {/* Controles de cantidad */}
            <div className="flex items-center bg-gray-100 rounded-lg">
              <button
                onClick={() => handleQuantityChange(item.quantity - 1)}
                className="p-2 hover:bg-gray-200 rounded-l-lg transition-colors"
                aria-label="Disminuir cantidad"
              >
                <Minus className="h-4 w-4" />
              </button>

              <span className="px-4 font-bold text-base min-w-[3rem] text-center">
                {item.quantity}
              </span>

              <button
                onClick={() => handleQuantityChange(item.quantity + 1)}
                className="p-2 hover:bg-gray-200 rounded-r-lg transition-colors"
                aria-label="Aumentar cantidad"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Subtotal */}
          <div className="mt-3 pt-3 border-t flex justify-between items-center">
            <span className="text-sm text-gray-600">Subtotal:</span>
            <span className="text-lg font-bold" style={{ color: primaryColor }}>
              {formatPrice(item.price * item.quantity)}
            </span>
          </div>
        </div>
      </div>

      {/* Información del combo */}
      {isCombo && item.comboSelections && (
        <div className="mt-3 bg-gray-50 rounded-lg p-3">
          <p className="font-medium text-sm mb-2">Este combo incluye:</p>
          {Object.entries(item.comboSelections).map(([subcatId, products]) => (
            <div key={subcatId} className="ml-2 text-sm">
              {products.map((product) => (
                <p key={product.id} className="text-gray-600 py-0.5">
                  • {product.name}
                </p>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};