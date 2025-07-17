import React, { useState } from 'react';
import { ShoppingCart, Pizza, Menu } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useConfig } from '../../context/ConfigContext';

export const Header = ({ onViewChange }) => {
  const { setCartOpen, getCartItemsCount } = useCart();
  const { config } = useConfig();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
   <header className="bg-black text-white sticky top-0 z-50" style={{ border: 'none' }}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center space-x-2 cursor-pointer" 
               onClick={() => onViewChange('home')}>
            <div className="p-2 rounded" 
                 style={{ backgroundColor: config.colors.primary, border: 'none' }}>
              <Pizza className="h-6 w-6 md:h-8 md:w-8 text-white" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold uppercase" 
                style={{ fontFamily: 'Anton, sans-serif' }}>
              {config.business.name}
            </h1>
          </div>

          {/* Espacio vacío para centrar el logo */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8"></div>

          {/* Acciones */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 hover:bg-gray-800 rounded-lg transition-colors"
              style={{ border: 'none', outline: 'none' }}
            >
              <ShoppingCart className="h-6 w-6" />
              {getCartItemsCount() > 0 && (
                <span 
                  className="absolute -top-1 -right-1 text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold"
                  style={{ 
                    backgroundColor: config.colors.primary, 
                    color: 'white',
                    border: 'none',
                    outline: 'none'
                  }}
                >
                  {getCartItemsCount()}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2"
              style={{ outline: 'none', border: 'none' }}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};