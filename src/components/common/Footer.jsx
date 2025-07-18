import React from 'react';
import { Pizza } from 'lucide-react';
import { useConfig } from '../../context/ConfigContext';

export const Footer = () => {
  const { config } = useConfig();
  const footerColors = config.colors.footer || {
    background: '#00000',
    text: '#ffffff',
    accent: config.colors.primary
  };
  
  return (
    <footer 
      className="py-12 mt-auto"
      style={{ 
        backgroundColor: footerColors.background,
        color: footerColors.text
      }}
    >
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Pizza className="h-8 w-8" style={{ color: footerColors.accent }} />
              <h3 className="text-xl font-bold uppercase" 
                  style={{ fontFamily: 'Anton, sans-serif', color: footerColors.accent }}>
                {config.business.name}
              </h3>
            </div>
            <p className="text-gray-400 uppercase" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {config.texts.heroTitle}
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-4 uppercase" 
                style={{ fontFamily: 'Anton, sans-serif', color: footerColors.accent }}>
              ENLACES
            </h4>
            <ul className="space-y-2 text-gray-400 uppercase" style={{ fontFamily: 'Poppins, sans-serif' }}>
              <li>
                <a href="#" className="hover:text-white transition-colors">MENÚ</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">PROMOCIONES</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">NOSOTROS</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4 uppercase" 
                style={{ fontFamily: 'Anton, sans-serif', color: footerColors.accent }}>
              HORARIO
            </h4>
            <div className="text-gray-400 space-y-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
              <p>LUNES - JUEVES: {config.business.schedule.monday.open} - {config.business.schedule.monday.close}</p>
              <p>VIERNES: {config.business.schedule.friday.open} - {config.business.schedule.friday.close}</p>
              <p>SÁBADO: {config.business.schedule.saturday.open} - {config.business.schedule.saturday.close}</p>
              <p>DOMINGO: {config.business.schedule.sunday.open} - {config.business.schedule.sunday.close}</p>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-4 uppercase" 
                style={{ fontFamily: 'Anton, sans-serif', color: footerColors.accent }}>
              CONTACTO
            </h4>
            <div className="text-gray-400 space-y-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
              <p>{config.business.phone}</p>
              <p>@{config.business.name.toLowerCase()}.pizza</p>
              <p className="mt-3">{config.business.address}</p>
              <p>{config.business.city}</p>
            </div>
          </div>
        </div>
        
        <div 
          className="border-t mt-8 pt-8 text-center text-gray-400"
          style={{ borderColor: footerColors.accent + '33' }}
        >
          <p className="uppercase" style={{ fontFamily: 'Poppins, sans-serif' }}>
            &copy; 2024 PIZZERÍA {config.business.name} - {config.business.city}. TODOS LOS DERECHOS RESERVADOS.
          </p>
        </div>
      </div>
    </footer>
  );
};