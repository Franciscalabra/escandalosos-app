import React from 'react';
import { ProductCard } from './ProductCard';
import { Loading } from '../common/Loading';

export const ProductGrid = ({ products, loading, primaryColor, isComboCategory = false }) => {
  if (loading) {
    return <Loading color={primaryColor} />;
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No se encontraron productos en esta categoría.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-6">
      {products.map(product => (
        <ProductCard 
          key={product.id} 
          product={product} 
          isCombo={isComboCategory}
        />
      ))}
    </div>
  );
};