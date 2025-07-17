import React, { useState } from 'react';
import { Star, Clock, TrendingUp, Settings, Plus, Flame, Leaf, Tag, Heart } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';
import { useCart } from '../../context/CartContext';
import { useConfig } from '../../context/ConfigContext';
import { ComboSidebar } from '../combos/ComboSidebar';
import { PersonalizationSidebar } from './PersonalizationSidebar';

export const ProductCard = ({ product, isCombo = false }) => {
  const { addToCart } = useCart();
  const { config } = useConfig();
  const [showComboSidebar, setShowComboSidebar] = useState(false);
  const [showPersonalizationSidebar, setShowPersonalizationSidebar] = useState(false);
  
  const discount = product.regular_price && product.sale_price 
    ? Math.round(((product.regular_price - product.sale_price) / product.regular_price) * 100)
    : 0;
  
  const mainImage = product.images && product.images.length > 0 
    ? product.images[0].src 
    : '/api/placeholder/300/300';

  const hasHappyHour = product.happy_hour_discount?.active;
  const isBestSeller = product.total_sales && product.total_sales > 10;
  
  // Verificar si el producto necesita personalización
  const categoryId = product.categories[0]?.id;
  const hasSizes = config.personalization?.sizes?.[categoryId]?.length > 0;
  const hasIngredients = config.personalization?.ingredients?.[product.id]?.base?.length > 0 || 
                        config.personalization?.ingredients?.[product.id]?.extras?.length > 0;
  const needsPersonalization = hasSizes || hasIngredients;
  
  // Obtener badges del producto
  const productBadges = config.personalization?.badges?.filter(badge => 
    badge.products?.includes(product.id)
  ) || [];

  const handleAddToCart = () => {
    if (isCombo) {
      setShowComboSidebar(true);
    } else if (needsPersonalization) {
      setShowPersonalizationSidebar(true);
    } else {
      addToCart(product);
    }
  };

  const getBadgeIcon = (iconType) => {
    switch(iconType) {
      case 'flame': return Flame;
      case 'leaf': return Leaf;
      case 'star': return Star;
      case 'heart': return Heart;
      default: return Tag;
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col h-full">
        <div className="relative aspect-square overflow-hidden">
          {/* Badges */}
          <div className="absolute top-2 left-2 z-20 space-y-2">
            {discount > 0 && !hasHappyHour && (
              <div className="bg-red-500 text-white px-2 py-1 text-xs sm:text-sm font-bold rounded">
                -{discount}%
              </div>
            )}
            
            {hasHappyHour && (
              <div className="bg-orange-500 text-white px-2 py-1 text-xs sm:text-sm font-bold rounded flex items-center animate-pulse">
                <Clock className="h-3 w-3 mr-1" />
                HAPPY HOUR
              </div>
            )}
            
            {isBestSeller && (
              <div className="bg-green-600 text-white px-2 py-1 text-xs sm:text-sm font-bold rounded flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                MÁS VENDIDO
              </div>
            )}
          </div>
          
          {/* Badges personalizados */}
          <div className="absolute top-2 right-2 z-20 space-y-2">
            {productBadges.map(badge => {
              const Icon = getBadgeIcon(badge.icon);
              return (
                <div 
                  key={badge.id}
                  className="px-2 py-1 text-xs font-bold rounded-full flex items-center text-white shadow-lg"
                  style={{ backgroundColor: badge.color }}
                >
                  <Icon className="h-3 w-3 mr-1" />
                  {badge.name}
                </div>
              );
            })}
          </div>
          
          {/* Imagen */}
          <img 
            src={mainImage} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300" />
        </div>
        
        <div className="p-2 sm:p-4 flex flex-col flex-1">
          <h3 className="font-bold text-gray-900 mb-1 sm:mb-2 line-clamp-1 uppercase text-sm sm:text-lg" 
              style={{ fontFamily: 'Poppins, sans-serif' }}>
            {product.name}
          </h3>
          
          <div className="bg-gray-50 rounded-lg p-2 sm:p-3 mb-2 sm:mb-3 flex-1">
            <p className="text-xs sm:text-sm text-gray-700 line-clamp-2 sm:line-clamp-3 leading-relaxed" 
               style={{ fontFamily: 'Poppins, sans-serif', textTransform: 'none' }}>
              {product.description || 'Deliciosa pizza artesanal preparada con ingredientes frescos.'}
            </p>
          </div>
          
          {product.average_rating > 0 && (
            <div className="flex items-center mb-2 sm:mb-3">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-3 sm:h-4 w-3 sm:w-4 ${i < Math.floor(product.average_rating) ? 'fill-current' : ''}`} 
                  />
                ))}
              </div>
              <span className="text-xs sm:text-sm text-gray-600 ml-1 sm:ml-2">({product.rating_count})</span>
            </div>
          )}

          <div className="flex items-center justify-between mb-2 sm:mb-4">
            <div>
              {hasHappyHour ? (
                <>
                  <p className="text-xs sm:text-sm text-gray-400 line-through">
                    {formatPrice(product.original_price)}
                  </p>
                  <p className="text-base sm:text-2xl font-bold text-orange-600">
                    {formatPrice(product.price)}
                  </p>
                  <p className="text-xs text-orange-600 font-semibold">
                    ¡Ahorra {formatPrice(product.original_price - product.price)}!
                  </p>
                </>
              ) : (
                <>
                  {product.regular_price && product.sale_price && (
                    <p className="text-xs sm:text-sm text-gray-400 line-through">
                      {formatPrice(product.regular_price)}
                    </p>
                  )}
                  <p className="text-base sm:text-2xl font-bold text-gray-900">
                    {formatPrice(product.price)}
                  </p>
                </>
              )}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock_status !== 'instock'}
            className={`w-full py-2 sm:py-3 px-2 sm:px-4 rounded-lg font-bold transition-colors uppercase text-xs sm:text-base flex items-center justify-center space-x-2 ${
              product.stock_status === 'instock'
                ? `transform hover:scale-105 ${hasHappyHour ? 'animate-pulse' : ''}`
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
            style={{ 
              fontFamily: 'Poppins, sans-serif', 
              outline: 'none', 
              border: 'none',
              backgroundColor: product.stock_status === 'instock' 
                ? (hasHappyHour ? '#ff6b35' : (isCombo || needsPersonalization ? config.colors.secondary : config.colors.buttons?.primary || config.colors.primary))
                : undefined,
              color: product.stock_status === 'instock' 
                ? (isCombo || needsPersonalization ? '#000000' : config.colors.buttons?.text || '#ffffff')
                : undefined
            }}
          >
            {product.stock_status === 'instock' ? (
              (isCombo || needsPersonalization) ? (
                <>
                  <Settings className="h-4 w-4" />
                  <span>PERSONALIZAR</span>
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  <span>AGREGAR</span>
                </>
              )
            ) : (
              <span>SIN STOCK</span>
            )}
          </button>
        </div>
      </div>

      {/* Combo Sidebar */}
      {isCombo && (
        <ComboSidebar
          product={product}
          config={config}
          isOpen={showComboSidebar}
          onClose={() => setShowComboSidebar(false)}
          onConfirm={(comboData) => {
            addToCart({
              ...product,
              isCombo: true,
              comboSelections: comboData
            });
            setShowComboSidebar(false);
          }}
        />
      )}
      
      {/* Personalization Sidebar */}
      {needsPersonalization && (
        <PersonalizationSidebar
          product={product}
          config={config}
          isOpen={showPersonalizationSidebar}
          onClose={() => setShowPersonalizationSidebar(false)}
        onConfirm={(personalizedProduct) => {
  if (isCombo) {
    // Si también es combo, guardar la personalización y abrir combo sidebar
    setProduct({...personalizedProduct});
    setShowPersonalizationSidebar(false);
    setShowComboSidebar(true);
  } else {
    addToCart(personalizedProduct);
    setShowPersonalizationSidebar(false);
  }
}}
        />
      )}
    </>
  );
};