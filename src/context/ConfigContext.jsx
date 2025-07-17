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

export const ConfigProvider = ({ children }) => {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);

  // Cargar configuración al iniciar
  useEffect(() => {
    const loadConfig = async () => {
      try {
        setLoading(true);
        
        // Primero intentar cargar del plugin de WordPress
        const pluginConfig = await wooCommerceService.getPluginConfig();
        
        if (pluginConfig && Object.keys(pluginConfig).length > 0) {
          console.log('Configuración cargada desde WordPress:', pluginConfig);
          
          // Mezclar con la configuración por defecto para asegurar que no falten propiedades
          const mergedConfig = { ...DEFAULT_CONFIG, ...pluginConfig };
          setConfig(mergedConfig);
          
          // Guardar en storage local como caché
          storageService.saveConfig(mergedConfig);
        } else {
          console.log('No se encontró configuración en WordPress, usando storage local');
          
          // Si no hay config del plugin, usar local storage
          const savedConfig = storageService.getConfig();
          if (savedConfig) {
            setConfig({ ...DEFAULT_CONFIG, ...savedConfig });
          }
        }
      } catch (error) {
        console.error('Error cargando configuración:', error);
        
        // En caso de error, intentar cargar desde storage local
        const savedConfig = storageService.getConfig();
        if (savedConfig) {
          setConfig({ ...DEFAULT_CONFIG, ...savedConfig });
        }
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, []);

  // Guardar configuración cuando cambie (solo en local, WordPress se actualiza desde el admin)
  useEffect(() => {
    if (!loading) {
      storageService.saveConfig(config);
    }
  }, [config, loading]);

  const updateConfig = (newConfig) => {
    setConfig(prevConfig => ({ ...prevConfig, ...newConfig }));
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

  // Función para recargar la configuración desde WordPress
  const reloadConfig = async () => {
    try {
      setLoading(true);
      const pluginConfig = await wooCommerceService.getPluginConfig();
      
      if (pluginConfig && Object.keys(pluginConfig).length > 0) {
        const mergedConfig = { ...DEFAULT_CONFIG, ...pluginConfig };
        setConfig(mergedConfig);
        storageService.saveConfig(mergedConfig);
        console.log('Configuración recargada desde WordPress');
      }
    } catch (error) {
      console.error('Error recargando configuración:', error);
    } finally {
      setLoading(false);
    }
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