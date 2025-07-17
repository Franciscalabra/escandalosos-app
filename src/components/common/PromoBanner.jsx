import React, { useMemo } from 'react';
import { useConfig } from '../../context/ConfigContext';
import { isStoreOpen } from '../../utils/formatters';
import { Megaphone } from 'lucide-react';

export const PromoBanner = () => {
  const { config } = useConfig();
  const storeOpen = isStoreOpen(config.business.schedule);
  
  // Verificar si el banner promocional debe mostrarse
  const shouldShowPromoBanner = useMemo(() => {
    if (!config.promoBanner?.enabled) return false;
    
    const schedule = config.promoBanner.schedule;
    if (!schedule?.enabled) return true; // Si no hay programación, mostrar siempre
    
    const now = new Date();
    const currentDay = now.getDay();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const currentDate = now.toISOString().split('T')[0];
    
    switch (schedule.type) {
      case 'always':
        return true;
        
      case 'daily':
        // Verificar día de la semana
        if (!schedule.daysOfWeek?.includes(currentDay)) return false;
        // Verificar horario
        return currentTime >= schedule.startTime && currentTime <= schedule.endTime;
        
      case 'dateRange':
        // Verificar rango de fechas
        const isInDateRange = currentDate >= schedule.startDate && currentDate <= schedule.endDate;
        // Verificar horario
        const isInTimeRange = currentTime >= schedule.startTime && currentTime <= schedule.endTime;
        // Verificar día de la semana
        const isCorrectDay = schedule.daysOfWeek?.includes(currentDay);
        
        return isInDateRange && isInTimeRange && isCorrectDay;
        
      default:
        return true;
    }
  }, [config.promoBanner]);
  
  // Si no hay contenido para mostrar, mostrar solo estado de la tienda
  if (!shouldShowPromoBanner || !config.promoBanner?.text) {
    if (!storeOpen) {
      return (
        <div 
          className="py-2 text-center text-sm font-bold uppercase" 
          style={{ 
            backgroundColor: '#ef4444', 
            color: 'white' 
          }}
        >
          <p style={{ fontFamily: 'Poppins, sans-serif', color: 'white' }}>
             EN ESTE MOMENTO EL LOCAL SE ENCUENTRA CERRADO
          </p>
        </div>
      );
    }
    
    return (
      <div 
        className="py-3 text-center font-bold uppercase relative overflow-hidden pizzeria-promo-banner"
        style={{ 
          backgroundColor: config.colors.secondary, 
          color: '#000000' 
        }}
      >
        <p style={{ fontFamily: 'Poppins, sans-serif', color: '#000000' }}>
           YA ESTAMOS ATENTIENDO
        </p>
      </div>
    );
  }
  
  // Mostrar banner promocional
  return (
    <div 
      className="py-3 text-center font-bold uppercase relative overflow-hidden promo-banner"
      style={{ 
        backgroundColor: config.promoBanner.backgroundColor || '#ff6b35',
        color: config.promoBanner.textColor || '#ffffff'
      }}
    >
      <div className="container mx-auto px-4 flex items-center justify-center space-x-2">
        <Megaphone 
          className="h-5 w-5 animate-pulse" 
          style={{ color: config.promoBanner.textColor || '#ffffff' }}
        />
        <p style={{ 
          fontFamily: 'Poppins, sans-serif', 
          color: config.promoBanner.textColor || '#ffffff',
          fontSize: '0.875rem'
        }}>
          {config.promoBanner.text}
        </p>
        <Megaphone 
          className="h-5 w-5 animate-pulse" 
          style={{ color: config.promoBanner.textColor || '#ffffff' }}
        />
      </div>
    </div>
  );
};