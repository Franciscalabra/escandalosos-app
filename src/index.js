// src/index.js - Archivo de entrada principal para ReactPress
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Para ReactPress, asegúrate de que el elemento root esté disponible
const rootElement = document.getElementById('pizzeria-escandalosos-root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error('No se encontró el elemento root para montar la aplicación');
}
console.log('🔍 Diagnóstico SSL - Elemento root:', document.getElementById('pizzeria-escandalosos-root'));
console.log('🔍 URL actual:', window.location.href);
console.log('🔍 Protocol:', window.location.protocol);