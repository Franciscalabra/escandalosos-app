import { useState, useEffect, useMemo } from 'react';
import { wooCommerceService } from '../services/woocommerce';
import { useConfig } from '../context/ConfigContext';

export const useWooCommerce = () => {
  const { config } = useConfig();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [shippingZones, setShippingZones] = useState([]);
  const [shippingMethods, setShippingMethods] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [deliveryFee, setDeliveryFee] = useState(config.shipping.defaultCost);
  const [freeShippingAmount, setFreeShippingAmount] = useState(config.shipping.freeShippingAmount);

  // Cargar datos desde WooCommerce y el endpoint de configuración
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('🔄 Iniciando carga de datos...');

        // Cargar todos los datos necesarios en paralelo
        const [
          categoriesData,
          productsData,
          shippingInfo,
          paymentData,
          escandalososConfig,
          discountRules
        ] = await Promise.all([
          wooCommerceService.getCategories(),
          wooCommerceService.getProducts(),
          wooCommerceService.getShippingInfo(),
          wooCommerceService.getPaymentMethods(),
          wooCommerceService.getEscandalososConfig(),
          wooCommerceService.getDiscountRules()
        ]);

        console.log('📦 Datos cargados:', {
          categorias: categoriesData.length,
          productos: productsData.length,
          configEscandalosos: escandalososConfig
        });

        // 1. Procesar categorías con Happy Hour
        const now = new Date();
        const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        const activeHappyHourMap = new Map();

        const enhancedCategories = categoriesData.map(category => {
          const categoryConfig = escandalososConfig?.categories?.[category.id];
          
          if (categoryConfig?.happy_hour?.enabled) {
            const { start, end, type, value } = categoryConfig.happy_hour;
            const isActive = currentTime >= start && currentTime <= end;
            
            if (isActive) {
              activeHappyHourMap.set(category.id, { 
                type, 
                value, 
                name: category.name 
              });
            }

            return {
              ...category,
              happy_hour_active: isActive,
              happy_hour_config: categoryConfig.happy_hour
            };
          }
          
          return category;
        });

        setCategories(enhancedCategories);
        console.log('✅ Categorías procesadas con Happy Hour');

        // 2. Procesar productos con configuración de Escandalosos (LÓGICA CORREGIDA)
        const enhancedProducts = productsData.map(product => {
          let processedProduct = { ...product };
          const productConfig = escandalososConfig?.products?.[product.id];
        
          // Añadir la configuración de personalización DIRECTAMENTE al producto
          if (productConfig?.is_personalizable) {
            processedProduct.is_personalizable = true; // Mantener por si se usa en otro lado
            processedProduct.personalization = {
              sizes: productConfig.sizes || [],
              ingredients: productConfig.ingredients || { base: [], extras: [] }
            };
          }
        
          // Añadir la configuración de combo DIRECTAMENTE al producto
          if (productConfig?.is_combo) {
            processedProduct.is_combo = true;
            processedProduct.combo_config = productConfig.combo_config || {};
          }
        
          // Aplicar descuento de Happy Hour si corresponde
          for (const category of processedProduct.categories) {
            if (activeHappyHourMap.has(category.id)) {
              const hhConfig = activeHappyHourMap.get(category.id);
              const originalPrice = processedProduct.price;
              let discountedPrice = originalPrice;
        
              if (hhConfig.type === 'percentage') {
                discountedPrice = originalPrice * (1 - hhConfig.value / 100);
              } else if (hhConfig.type === 'fixed') {
                discountedPrice = Math.max(0, originalPrice - hhConfig.value);
              }
        
              processedProduct = {
                ...processedProduct,
                original_price: originalPrice,
                price: parseFloat(discountedPrice.toFixed(0)),
                happy_hour_discount: {
                  active: true,
                  type: hhConfig.type,
                  value: hhConfig.value,
                  category_id: category.id,
                  category_name: hhConfig.name
                }
              };
              break;
            }
          }
        
          return processedProduct;
        });
        
        setProducts(enhancedProducts);
        console.log('✅ Productos procesados con personalización y Happy Hour');
        
        // 3. Actualizar configuración global (se mantiene para otras funcionalidades)
        if (escandalososConfig) {
          if (escandalososConfig.categories) {
              const combosConfig = { enabled: true, categories: {} };
              Object.entries(escandalososConfig.products).forEach(([productId, productConfig]) => {
                if (productConfig.is_combo && productConfig.combo_config) {
                  const product = enhancedProducts.find(p => p.id === parseInt(productId));
                  if (product && product.categories.length > 0) {
                    const categoryId = product.categories[0].id;
                    if (!combosConfig.categories[categoryId]) {
                      combosConfig.categories[categoryId] = { enabled: true, subcategories: {} };
                    }
                    Object.entries(productConfig.combo_config).forEach(([subcatId, subcatConfig]) => {
                      combosConfig.categories[categoryId].subcategories[subcatId] = subcatConfig;
                    });
                  }
                }
              });
              config.combos = { ...config.combos, ...combosConfig };
          }
          
          if (discountRules && discountRules.length > 0) {
            config.discounts = {
              enabled: true,
              rules: discountRules
            };
          }
        }


        // 4. Configurar envío y pagos
        setShippingZones(shippingInfo.zones);
        setShippingMethods(shippingInfo.methods);
        if (shippingInfo.deliveryFee !== null) setDeliveryFee(shippingInfo.deliveryFee);
        if (shippingInfo.freeShippingAmount !== null) setFreeShippingAmount(shippingInfo.freeShippingAmount);
        
        setPaymentMethods(paymentData);
        if (paymentData.length > 0) {
          setSelectedPaymentMethod(paymentData[0].id);
        }

        console.log('✅ Carga de datos completada exitosamente');

      } catch (error) {
        console.error('❌ Error cargando datos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Solo ejecutar una vez al montar

  // Categorías visibles y ordenadas según la configuración
  const displayedCategories = useMemo(() => {
    const { order = [], visible = {} } = config.categorySettings || {};
    const categoryMap = new Map(categories.map(cat => [cat.id, cat]));
    const allCategoryIds = categories.map(c => c.id);
    const validOrder = order.filter(id => allCategoryIds.includes(id));
    const newCategories = allCategoryIds.filter(id => !validOrder.includes(id));
    const completeOrder = [...validOrder, ...newCategories];

    return completeOrder
      .map(id => categoryMap.get(id))
      .filter(cat => cat && visible[cat.id] !== false);
  }, [categories, config.categorySettings]);

  // Establecer categoría por defecto al cargar
  useEffect(() => {
    if (displayedCategories.length > 0 && selectedCategory === null) {
      setSelectedCategory(displayedCategories[0].id.toString());
    }
  }, [displayedCategories, selectedCategory]);

  // Filtrar productos por categoría seleccionada
  const filteredProducts = useMemo(() => {
    if (!selectedCategory) return products;
    return products.filter(product =>
      product.categories.some(cat => cat.id.toString() === selectedCategory)
    );
  }, [products, selectedCategory]);
  
  // Calcular costo de envío actual
  const getCurrentShippingCost = (cartTotal, deliveryMethod) => {
    if (deliveryMethod === 'pickup') return 0;
    if (config.shipping.freeShippingEnabled && cartTotal >= freeShippingAmount) return 0;
    return deliveryFee;
  };

  // Verificar si una categoría tiene Happy Hour activo
  const categoryHasActiveHappyHour = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.happy_hour_active || false;
  };

  return {
    products,
    categories,
    displayedCategories,
    loading,
    selectedCategory,
    setSelectedCategory,
    shippingZones,
    shippingMethods,
    paymentMethods,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    deliveryFee,
    freeShippingAmount,
    filteredProducts,
    getCurrentShippingCost,
    categoryHasActiveHappyHour
  };
};