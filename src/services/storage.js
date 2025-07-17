const STORAGE_KEYS = {
  CONFIG: 'escandalosos-config',
  CART: 'escandalosos-cart',
  DELIVERY_METHOD: 'escandalosos-delivery-method'
};

export const storageService = {
  // Configuración
  getConfig() {
    const saved = localStorage.getItem(STORAGE_KEYS.CONFIG);
    return saved ? JSON.parse(saved) : null;
  },

  saveConfig(config) {
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
  },

  // Carrito
  getCart() {
    const saved = localStorage.getItem(STORAGE_KEYS.CART);
    return saved ? JSON.parse(saved) : [];
  },

  saveCart(cart) {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  },

  clearCart() {
    localStorage.removeItem(STORAGE_KEYS.CART);
  },

  // Método de entrega
  getDeliveryMethod() {
    return localStorage.getItem(STORAGE_KEYS.DELIVERY_METHOD) || 'delivery';
  },

  saveDeliveryMethod(method) {
    localStorage.setItem(STORAGE_KEYS.DELIVERY_METHOD, method);
  }
};