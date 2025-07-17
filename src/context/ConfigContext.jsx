import React, { createContext, useState, useContext, useEffect } from 'react';
import { DEFAULT_CONFIG } from '../utils/constants';
import { storageService } from '../services/storage';
import { wooCommerceService } from '../services/woocommerce';

const ConfigContext = createContext();

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig debe ser usado dentro de ConfigProvider');
  }
  return context;
};

// Función de ayuda para fusión profunda
const deepMerge = (target, source) => {
  const output = { ...target };
  if (target && typeof target === 'object' && source && typeof source === 'object') {
    Object.keys(source).forEach(key => {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
};

export const ConfigProvider = ({ children }) => {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);

  // Cargar configuración al iniciar
  useEffect(() => {
    const loadConfig = async () => {
      try {
        setLoading(true);
        const pluginConfig = await wooCommerceService.getPluginConfig();
        
        if (pluginConfig && Object.keys(pluginConfig).length > 0) {
          console.log('Configuración cargada desde WordPress:', pluginConfig);
          
          const mappedConfig = {};
          if (pluginConfig.settings) {
              mappedConfig.shipping = {
                  freeShippingEnabled: pluginConfig.settings.free_shipping_enabled,
                  freeShippingAmount: pluginConfig.settings.free_shipping_amount
              };
          }
          if (pluginConfig.categories) {
              mappedConfig.happyHour = { enabled: true, categories: pluginConfig.categories };
          }

          // Usamos la fusión profunda para combinar las configuraciones
          const mergedConfig = deepMerge(DEFAULT_CONFIG, mappedConfig);
          setConfig(mergedConfig);
          
          // Guardar en storage local como caché
          storageService.saveConfig(mergedConfig);
        } else {
          console.log('No se encontró configuración en WordPress, usando storage local');
          const savedConfig = storageService.getConfig();
          if (savedConfig) {
            setConfig(deepMerge(DEFAULT_CONFIG, savedConfig));
          }
        }
      } catch (error) {
        console.error('Error cargando configuración:', error);
        const savedConfig = storageService.getConfig();
        if (savedConfig) {
          setConfig(deepMerge(DEFAULT_CONFIG, savedConfig));
        }
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, []);

  // Guardar configuración cuando cambie (solo en local)
  useEffect(() => {
    if (!loading) {
      storageService.saveConfig(config);
    }
  }, [config, loading]);

  const updateConfig = (newConfig) => {
    setConfig(prevConfig => deepMerge(prevConfig, newConfig));
  };

  const updateConfigSection = (section, key, value) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const updateNestedConfig = (section, subkey, key, value) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subkey]: {
          ...prev[section][subkey],
          [key]: value
        }
      }
    }));
  };
  
  const reloadConfig = async () => {
    // Implementación de recarga si es necesaria
  };

  const value = {
    config,
    loading,
    updateConfig,
    updateConfigSection,
    updateNestedConfig,
    reloadConfig
  };

  return (
    <ConfigContext.Provider value={value}>
      {!loading ? children : (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          backgroundColor: '#f5f5f5'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '50px',
              height: '50px',
              border: '3px solid #f70295',
              borderTopColor: 'transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 20px'
            }} />
            <p style={{ 
              fontFamily: 'Poppins, sans-serif',
              fontSize: '16px',
              color: '#666'
            }}>
              Cargando configuración...
            </p>
          </div>
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}
    </ConfigContext.Provider>
  );
};