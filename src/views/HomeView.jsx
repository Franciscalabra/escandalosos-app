import React from 'react';
import { CategoryNav } from '../components/products/CategoryNav';
import { ProductGrid } from '../components/products/ProductGrid';
import { useWooCommerce } from '../hooks/useWooCommerce';
import { useConfig } from '../context/ConfigContext';

// 1. Mover componentes de estado fuera para evitar re-declaraciones.
const LoadingState = ({ primaryColor }) => (
  <div className="flex justify-center items-center py-20">
    <div 
      className="animate-spin rounded-full h-12 w-12 border-b-2" 
      style={{ borderColor: primaryColor }}
    />
  </div>
);

const EmptyState = () => (
  <div className="text-center py-12">
    <p className="text-gray-500">No se encontraron productos en esta categoría.</p>
  </div>
);


export const HomeView = () => {
  const { config } = useConfig();
  const { 
    loading, 
    filteredProducts, 
    displayedCategories,
    selectedCategory,
    setSelectedCategory,
    categories // <-- Solo obtenemos el array
  } = useWooCommerce();

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Category Navigation */}
      <CategoryNav 
        categories={displayedCategories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        primaryColor={config.colors.primary}
      />

      {/* Products Section */}
      <section className="py-4 sm:py-8">
        <div className="container mx-auto px-2 sm:px-4">
          {loading ? (
            <LoadingState primaryColor={config.colors.primary} />
          ) : (
            <>
              {(() => {
                // 2. Mover la lógica que depende de los datos DENTRO del bloque de "no carga".
                const currentCategory = categories.find(cat => cat.id.toString() === selectedCategory);
                const isComboCategory = config.combos?.enabled && config.combos?.categories?.[selectedCategory]?.enabled;

                return (
                  <>
                    <div className="mb-3 sm:mb-6 flex items-center justify-between">
                      <h3 className="text-2xl font-bold text-gray-900 uppercase" 
                          style={{ fontFamily: 'Anton, sans-serif' }}>
                        {/* Se usa optional chaining (?.) por si la categoría no se encuentra */}
                        {currentCategory?.name.toUpperCase() || 'PRODUCTOS'}
                      </h3>
                      <p className="text-gray-600">{filteredProducts.length} productos</p>
                    </div>

                    {filteredProducts.length === 0 ? (
                      <EmptyState />
                    ) : (
                      <ProductGrid 
                        products={filteredProducts}
                        loading={loading}
                        primaryColor={config.colors.primary}
                        isComboCategory={isComboCategory}
                      />
                    )}
                  </>
                );
              })()}
            </>
          )}
        </div>
      </section>
    </div>
  );
};