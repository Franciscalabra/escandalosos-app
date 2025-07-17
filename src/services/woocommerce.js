import { WOO_CONFIG } from '../utils/constants';

// Helper para autenticación
const getAuthHeader = () => {
  const credentials = btoa(`${WOO_CONFIG.CONSUMER_KEY}:${WOO_CONFIG.CONSUMER_SECRET}`);
  return {
    'Authorization': `Basic ${credentials}`,
    'Content-Type': 'application/json'
  };
};

// Helper para logging en desarrollo
const debugLog = (message, data) => {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log(` Escandalosos: ${message}`, data);
  }
};

// Obtenemos la URL base del sitio
const getBaseUrl = () => {
  try {
    // Si estamos en desarrollo local
    if (window.location.hostname === 'localhost') {
      return 'http://localhost'; // Ajusta según tu configuración local
    }
    // En producción, usar la URL actual
    return window.location.origin;
  } catch (e) {
    return window.location.origin;
  }
};

const BASE_URL = getBaseUrl();

// Servicio WooCommerce
export const wooCommerceService = {
  // Obtener categorías
  async getCategories() {
    try {
      const response = await fetch(`${WOO_CONFIG.API_URL}/products/categories?per_page=100`, {
        headers: getAuthHeader()
      });
      if (!response.ok) throw new Error('Falló la respuesta de red para las categorías');
      const data = await response.json();
      // Filtrar categorías con productos
      return data.filter(cat => cat.count > 0);
    } catch (error) {
      console.error('Error cargando categorías:', error);
      throw error;
    }
  },

  // Obtener productos
  async getProducts() {
    try {
      const response = await fetch(`${WOO_CONFIG.API_URL}/products?per_page=100&status=publish`, {
        headers: getAuthHeader()
      });
      if (!response.ok) throw new Error('Falló la respuesta de red para los productos');
      const data = await response.json();
      
      // Formatear productos
      return data.map(product => ({
        id: product.id,
        name: product.name,
        price: parseFloat(product.price),
        regular_price: product.regular_price ? parseFloat(product.regular_price) : null,
        sale_price: product.sale_price ? parseFloat(product.sale_price) : null,
        categories: product.categories,
        images: product.images,
        description: product.short_description ? 
          product.short_description.replace(/<[^>]*>/g, '').trim() : 
          (product.description ? product.description.replace(/<[^>]*>/g, '').trim().substring(0, 150) + '...' : ''),
        stock_status: product.stock_status,
        on_sale: product.on_sale,
        featured: product.featured,
        rating_count: product.rating_count || 0,
        average_rating: product.average_rating || 0,
        total_sales: product.total_sales || 0
      }));
    } catch (error) {
      console.error('Error cargando productos:', error);
      throw error;
    }
  },
  
  // Obtener configuración del plugin Escandalosos
  async getEscandalososConfig() {
    try {
      // Usar la URL base correcta
      const url = `${BASE_URL}/wp-json/escandalosos/v1/config`;
      console.log('🔍 Fetching Escandalosos config from:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        console.error(` Error en el endpoint de configuración: ${response.status} ${response.statusText}`);
        return null;
      }
      
      const data = await response.json();
      console.log(' Configuración Escandalosos cargada:', data);
      return data;
      
    } catch (error) {
      console.error(' Error cargando configuración Escandalosos:', error);
      return null;
    }
  },

  // Obtener configuración del plugin (método legacy para compatibilidad)
  async getPluginConfig() {
    // Este método redirige al nuevo getEscandalososConfig
    return this.getEscandalososConfig();
  },

  // Obtener reglas de descuento
  async getDiscountRules() {
    try {
      const url = `${BASE_URL}/wp-json/escandalosos/v1/discounts`;
      console.log('Fetching discount rules from:', url);
          
      const response = await fetch(url);
          
      if (!response.ok) {
        console.error(`Error en endpoint de descuentos: ${response.status}`);
        return [];
      }
          
      const data = await response.json();
      console.log('Reglas de descuento cargadas:', data);
      return data;
        
    } catch (error) {
      console.error('Error cargando reglas de descuento:', error);
      return [];
    }
  },

  // Obtener información de envío
  async getShippingInfo() {
    try {
      const zones = await fetch(`${WOO_CONFIG.API_URL}/shipping/zones`, {
        headers: getAuthHeader()
      });
      const shippingData = await zones.json();
      
      const allShippingMethods = [];
      let deliveryFee = null;
      let freeShippingAmount = null;
      
      for (const zone of shippingData) {
        const methodsResponse = await fetch(`${WOO_CONFIG.API_URL}/shipping/zones/${zone.id}/methods`, {
          headers: getAuthHeader()
        });
        const methodsData = await methodsResponse.json();
        
        for (const method of methodsData) {
          if (method.enabled) {
            if (method.method_id === 'flat_rate' && deliveryFee === null) {
              const cost = method.settings?.cost?.value;
              if (cost) deliveryFee = parseFloat(cost.replace(/[^\d.-]/g, '')) || null;
            }
            if (method.method_id === 'free_shipping' && freeShippingAmount === null) {
              const minAmount = method.settings?.min_amount?.value;
              if (minAmount) freeShippingAmount = parseFloat(minAmount.replace(/[^\d.-]/g, '')) || null;
            }
          }
        }
        
        const methodsWithZone = methodsData.map(method => ({ ...method, zone_id: zone.id, zone_name: zone.name }));
        allShippingMethods.push(...methodsWithZone);
      }
      
      return { zones: shippingData, methods: allShippingMethods, deliveryFee, freeShippingAmount };
    } catch (error) {
      console.error('Error cargando información de envío:', error);
      throw error;
    }
  },

  // Obtener métodos de pago
  async getPaymentMethods() {
    try {
      const response = await fetch(`${WOO_CONFIG.API_URL}/payment_gateways`, {
        headers: getAuthHeader()
      });
      if (!response.ok) throw new Error('Falló la respuesta de red para los métodos de pago');
      const data = await response.json();
      return data.filter(method => method.enabled === true);
    } catch (error) {
      console.error('Error cargando métodos de pago:', error);
      throw error;
    }
  },

  // Crear orden
  async createOrder(orderData) {
    try {
      const response = await fetch(`${WOO_CONFIG.API_URL}/orders`, {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify(orderData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear el pedido');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creando orden:', error);
      throw error;
    }
  },

  // Actualizar orden
  async updateOrder(orderId, data) {
    try {
      const response = await fetch(`${WOO_CONFIG.API_URL}/orders/${orderId}`, {
        method: 'PUT',
        headers: getAuthHeader(),
        body: JSON.stringify(data)
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error actualizando orden:', error);
    }
  }
};