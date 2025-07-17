// Configuración de WooCommerce - Modo Producción
export const WOO_CONFIG = {
  API_URL: '/wp-json/wc/v3',
  CONSUMER_KEY: 'ck_6895c7576c0f2b8adca8319dbbaf516842f0809b',
  CONSUMER_SECRET: 'cs_e477ac1edb8521fb2d145befc53be2778ca93434'
};

// Configuración por defecto
export const DEFAULT_CONFIG = {
  colors: {
    primary: '#f70295',
    secondary: '#fae202',
    text: '#000000',
    background: '#ffffff',
    // Nuevos colores configurables
    footer: {
      background: '#111827',
      text: '#ffffff',
      accent: '#f70295'
    },
    buttons: {
      primary: '#f70295',
      primaryHover: '#e00285',
      secondary: '#fae202',
      secondaryHover: '#e8d102',
      text: '#ffffff'
    }
  },
  texts: {
    heroTitle: 'THE BEST PIZZAS DE ISLA DE MAIPO',
    heroSubtitle: 'MASA FILETE, INGREDIENTES DE CALIDAD Y TODO EL ESTILO DE ESCANDALOSOS!',
    deliveryTime: '30-40 MINUTOS'
  },
  business: {
    name: 'ESCANDALOSOS',
    phone: '+56942740261',
    address: 'CAMINO LAS PARCELAS 12',
    city: 'ISLA DE MAIPO',
    schedule: {
      monday: { open: '18:00', close: '22:00' },
      tuesday: { open: '18:00', close: '22:00' },
      wednesday: { open: '18:00', close: '22:00' },
      thursday: { open: '18:00', close: '22:00' },
      friday: { open: '18:00', close: '23:00' },
      saturday: { open: '13:00', close: '23:00' },
      sunday: { open: '13:00', close: '22:00' }
    }
  },
  shipping: {
    defaultCost: 2500,
    freeShippingEnabled: true,
    freeShippingAmount: 20000
  },
  categorySettings: {
    order: [],
    visible: {}
  },
  happyHour: {
    enabled: false,
    categories: {}
  },
  promoBanner: {
    enabled: false,
    text: 'HOY 20% DE DESCUENTO EN PIZZAS ESPECIALES',
    backgroundColor: '#ff6b35',
    textColor: '#ffffff',
    schedule: {
      enabled: false,
      type: 'daily',
      startTime: '00:00',
      endTime: '23:59',
      startDate: '',
      endDate: '',
      daysOfWeek: [0, 1, 2, 3, 4, 5, 6]
    }
  },
  combos: {
    enabled: false,
    categories: {}
  },
  // Nueva sección de personalización mejorada
  personalization: {
    sizes: {},
    ingredients: {},
    badges: [],
    suggestions: {
      enabled: true,
      drinks: true,
      extras: true,
      threshold: 15000 // Monto mínimo para sugerir bebidas
    }
  },
  // Nueva sección de descuentos
  discounts: {
    enabled: false,
    rules: []
    // Ejemplo de estructura:
    // rules: [{
    //   id: '1',
    //   name: '2x1 en Pizzas Especiales',
    //   type: 'buyXgetY', // 'buyXgetY', 'percentage', 'fixed', 'progressive'
    //   enabled: true,
    //   conditions: {
    //     categories: ['15'], // IDs de categorías
    //     products: [], // IDs de productos específicos
    //     minQuantity: 2,
    //     getQuantity: 1
    //   },
    //   value: 100 // 100% de descuento en el producto gratis
    // }]
  }
};

// Configuración de acceso admin
export const ADMIN_CONFIG = {
  PASSWORD: 'escandalosos',
  UNLOCK_SEQUENCE: 'admin'
};