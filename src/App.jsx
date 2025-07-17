import React, { useState, useEffect } from 'react';
import { ConfigProvider } from './context/ConfigContext';
import { CartProvider } from './context/CartContext';
import { Header } from './components/common/Header';
import { PromoBanner } from './components/common/PromoBanner';
import { Footer } from './components/common/Footer';
import { CartSidebar } from './components/cart/CartSidebar';
import { HomeView } from './views/HomeView';
import { CheckoutView } from './views/CheckoutView';
import { injectGlobalStyles } from './styles/globals';

function AppContent() {
  const [currentView, setCurrentView] = useState('home');

  useEffect(() => {
    injectGlobalStyles();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <PromoBanner />
      <Header onViewChange={setCurrentView} />
      
      {currentView === 'home' && <HomeView />}
      {currentView === 'checkout' && <CheckoutView onViewChange={setCurrentView} />}
      
      <CartSidebar onCheckout={() => setCurrentView('checkout')} />
      
      <Footer />
    </div>
  );
}

export default function PizzeriaEscandalosos() {
  return (
    <ConfigProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </ConfigProvider>
  );
}