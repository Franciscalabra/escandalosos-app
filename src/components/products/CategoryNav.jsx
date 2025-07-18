import React from 'react';
import { Clock } from 'lucide-react';
import { useWooCommerce } from '../../hooks/useWooCommerce';
import { useConfig } from '../../context/ConfigContext';

export const CategoryNav = ({ categories, selectedCategory, onCategoryChange, primaryColor }) => {
  const { categoryHasActiveHappyHour } = useWooCommerce();
  const { config } = useConfig();
  
  // --- INICIO DE LA CORRECCIÓN ---
  // Se ha eliminado la lógica de ordenamiento personalizado ('categoryOrder' y 'sortedCategories').
  // Ahora el componente respetará el orden del array 'categories' que recibe como prop.
  // --- FIN DE LA CORRECCIÓN ---

  return (
    <nav className="bg-gray-50 sticky top-[64px] z-30">
      <div className="container mx-auto px-4">
        <div className="flex items-center space-x-4 overflow-x-auto py-4 scrollbar-hide">
          {/* Se itera directamente sobre 'categories' en lugar de 'sortedCategories' */}
          {categories.map(category => {
            const hasHappyHour = categoryHasActiveHappyHour(category.id);
            
            return (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id.toString())}
                className={`relative whitespace-nowrap py-2 px-4 sm:px-6 rounded-full transition-all font-bold uppercase text-sm sm:text-base ${
                  selectedCategory === category.id.toString()
                    ? 'text-white shadow-md transform scale-105' 
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
                style={{ 
                  fontFamily: 'Poppins, sans-serif', 
                  outline: 'none',
                  backgroundColor: selectedCategory === category.id.toString() 
                    ? (hasHappyHour ? '#ff6b35' : primaryColor)
                    : undefined,
                  boxShadow: hasHappyHour && selectedCategory === category.id.toString() 
                    ? '0 0 20px rgba(255, 107, 53, 0.5)' 
                    : undefined
                }}
              >
                <span className="flex items-center space-x-2">
                  {hasHappyHour && (
                    <Clock className="inline-block h-4 w-4 animate-pulse" />
                  )}
                  <span>{category.name.toUpperCase()}</span>
                </span>
                
                {/* Badges mejorados */}
                {hasHappyHour && (
                  <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg animate-bounce">
                    <Clock className="inline-block h-3 w-3 mr-1" />
                    HH
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};