// Estilos globales inyectados dinámicamente para evitar conflictos con WordPress
export const injectGlobalStyles = () => {
  const styleId = 'pizzeria-escandalosos-global-styles';
  
  // Verificar si ya existe
  if (document.getElementById(styleId)) {
    return;
  }

  const styles = `
    /* Reset para el contenedor de la app */
    #pizzeria-escandalosos-root {
      position: relative;
      z-index: 1;
    }

    /* Fix para modales */
    .pizzeria-modal-overlay {
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      right: 0 !important;
      bottom: 0 !important;
      z-index: 999999 !important;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
    }

    /* Cuando hay modal abierto */
    body.pizzeria-modal-open {
      overflow: hidden !important;
      position: fixed !important;
      width: 100% !important;
      height: 100% !important;
    }

    /* Contenido del modal */
    .pizzeria-modal-content {
      position: relative;
      max-height: 90vh;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      margin: auto;
    }

    /* Scroll suave */
    html.pizzeria-smooth-scroll {
      scroll-behavior: smooth;
    }

    /* Fix para z-index en WordPress */
    #wpadminbar {
      z-index: 99999 !important;
    }

    /* Asegurar que los modales estén sobre el admin bar */
    .pizzeria-modal-overlay {
      margin-top: 0 !important;
    }

    /* Fix para el carrito lateral */
    .pizzeria-cart-sidebar {
      z-index: 999998 !important;
    }

    /* Animaciones mejoradas */
    @keyframes pizzeriaFadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .pizzeria-fade-in {
      animation: pizzeriaFadeIn 0.3s ease-out;
    }

    /* Prevenir scroll horizontal */
    body {
      overflow-x: hidden !important;
      max-width: 100vw !important;
    }

    /* Mejorar rendimiento de scroll en móviles */
    .pizzeria-scrollable {
      -webkit-overflow-scrolling: touch;
      transform: translateZ(0);
      will-change: transform;
    }

    /* Fix para inputs en iOS */
    input[type="text"],
    input[type="email"],
    input[type="tel"],
    input[type="number"],
    textarea,
    select {
      font-size: 16px !important; /* Previene zoom en iOS */
    }

    /* Estilos para el banner promocional */
    .pizzeria-promo-banner {
      position: relative;
      overflow: hidden;
    }

    .pizzeria-promo-banner::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: linear-gradient(
        45deg,
        transparent 30%,
        rgba(255, 255, 255, 0.1) 50%,
        transparent 70%
      );
      animation: pizzeriaShimmer 3s infinite;
    }

    @keyframes pizzeriaShimmer {
      0% {
        transform: translateX(-100%) translateY(-100%) rotate(45deg);
      }
      100% {
        transform: translateX(100%) translateY(100%) rotate(45deg);
      }
    }

    /* Responsive utilities */
    @media (max-width: 768px) {
      .pizzeria-modal-content {
        margin: 1rem;
        max-height: calc(100vh - 2rem);
      }
      
      .pizzeria-hide-mobile {
        display: none !important;
      }
    }

    /* Print styles */
    @media print {
      .pizzeria-no-print {
        display: none !important;
      }
    }
  `;

  const styleElement = document.createElement('style');
  styleElement.id = styleId;
  styleElement.innerHTML = styles;
  document.head.appendChild(styleElement);
};

// Utilidades para manejar el scroll del body
export const bodyScrollUtils = {
  disable: () => {
    document.body.classList.add('pizzeria-modal-open');
    document.documentElement.classList.add('pizzeria-smooth-scroll');
  },
  
  enable: () => {
    document.body.classList.remove('pizzeria-modal-open');
  },
  
  scrollToTop: () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};