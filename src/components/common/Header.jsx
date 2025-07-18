import React, { useState } from 'react';
import { ShoppingCart, Pizza, Menu, X, Home, Clock, Tag, Phone } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useConfig } from '../../context/ConfigContext';

export const Header = ({ onViewChange }) => {
  const { setCartOpen, getCartItemsCount } = useCart();
  const { config } = useConfig();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { icon: Home, label: 'Inicio', action: () => { onViewChange('home'); setMobileMenuOpen(false); }},
    { icon: Clock, label: 'Horarios', action: () => { /* Mostrar modal de horarios */ setMobileMenuOpen(false); }},
    { icon: Tag, label: 'Promociones', action: () => { /* Ir a categoría de promos */ setMobileMenuOpen(false); }},
    { icon: Phone, label: 'Contacto', action: () => { window.open(`tel:${config.business.phone}`); setMobileMenuOpen(false); }},
  ];

  return (
    <>
      <header className="bg-black text-white sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <div className="flex items-center space-x-2 cursor-pointer" 
                 onClick={() => onViewChange('home')}>
              <div className="p-2 rounded" 
                   style={{ backgroundColor: config.colors.primary }}>
                <Pizza className="h-6 w-6 md:h-8 md:w-8 text-white" />
              </div>
              <h1 className="text-xl md:text-2xl font-bold uppercase" 
                  style={{ fontFamily: 'Anton, sans-serif' }}>
                {config.business.name}
              </h1>
            </div>

            {/* Acciones */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ShoppingCart className="h-6 w-6" />
                {getCartItemsCount() > 0 && (
                  <span 
                    className="absolute -top-1 -right-1 text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold"
                    style={{ 
                      backgroundColor: config.colors.primary, 
                      color: 'white'
                    }}
                  >
                    {getCartItemsCount()}
                  </span>
                )}
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Menú móvil desplegable */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden" onClick={() => setMobileMenuOpen(false)}>
          <div className="absolute right-0 top-16 bg-white rounded-l-lg shadow-xl p-4 w-64" onClick={e => e.stopPropagation()}>
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={item.action}
                className="flex items-center gap-3 w-full p-3 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <item.icon className="h-5 w-5" style={{ color: config.colors.primary }} />
                <span className="text-gray-800 font-medium">{item.label}</span>
              </button>
            ))}
            
            {/* Información adicional */}
            <div className="mt-4 pt-4 border-t text-sm text-gray-600">
              <p className="font-bold mb-2">Horario de hoy:</p>
              <p>{config.business.schedule.monday.open} - {config.business.schedule.monday.close}</p>
              <p className="mt-2">{config.business.address}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};