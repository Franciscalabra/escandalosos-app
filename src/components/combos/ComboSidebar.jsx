import React, { useState, useEffect } from 'react';
import { X, Check, Package, ChevronRight, ChevronLeft } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';
import { useWooCommerce } from '../../hooks/useWooCommerce';

export const ComboSidebar = ({ product, config, isOpen, onClose, onConfirm }) => {
  const { products } = useWooCommerce();
  const [selections, setSelections] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  
  // Obtener configuración del combo
  const comboConfig = config.combos?.categories?.[product.categories[0]?.id];
  
  // Preparar pasos basados en subcategorías
  const steps = Object.entries(comboConfig?.subcategories || {}).map(([id, config]) => ({
    id,
    ...config
  }));
  
  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;
  
  useEffect(() => {
    // Inicializar selecciones vacías
    if (comboConfig?.subcategories) {
      const initialSelections = {};
      Object.keys(comboConfig.subcategories).forEach(subcatId => {
        initialSelections[subcatId] = [];
      });
      setSelections(initialSelections);
    }
  }, [comboConfig]);

  const handleProductToggle = (subcategoryId, product) => {
    const currentSelections = selections[subcategoryId] || [];
    const maxSelection = comboConfig.subcategories[subcategoryId].maxSelection;
    const isSelected = currentSelections.some(p => p.id === product.id);
    
    if (isSelected) {
      // Deseleccionar
      setSelections({
        ...selections,
        [subcategoryId]: currentSelections.filter(p => p.id !== product.id)
      });
    } else {
      // Seleccionar (respetando el máximo)
      if (currentSelections.length < maxSelection) {
        setSelections({
          ...selections,
          [subcategoryId]: [...currentSelections, product]
        });
      } else if (maxSelection === 1) {
        // Si es selección única, reemplazar
        setSelections({
          ...selections,
          [subcategoryId]: [product]
        });
      }
    }
  };

  const isStepValid = (stepIndex) => {
    const step = steps[stepIndex];
    const stepSelections = selections[step.id] || [];
    return stepSelections.length >= step.minSelection && 
           stepSelections.length <= step.maxSelection;
  };

  const isValidSelection = () => {
    if (!comboConfig?.subcategories) return false;
    
    return Object.entries(comboConfig.subcategories).every(([subcatId, subcatConfig]) => {
      const selected = selections[subcatId] || [];
      return selected.length >= subcatConfig.minSelection && 
             selected.length <= subcatConfig.maxSelection;
    });
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1 && isStepValid(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleConfirm = () => {
    if (isValidSelection()) {
      onConfirm(selections);
      onClose();
    }
  };

  if (!comboConfig || !comboConfig.enabled) {
    return null;
  }

  const subcategoryProducts = products.filter(p => 
    p.categories.some(cat => cat.id.toString() === currentStepData?.id)
  );

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? 'visible' : 'invisible'}`}>
      {/* Overlay */}
      <div 
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          isOpen ? 'opacity-50' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-gray-50">
            <div>
              <h2 className="text-xl font-bold uppercase" style={{ fontFamily: 'Anton, sans-serif' }}>
                PERSONALIZA TU {product.name}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Paso {currentStep + 1} de {steps.length}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Progress bar */}
          <div className="px-4 py-3 bg-gray-100">
            <div className="flex space-x-2">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`flex-1 h-2 rounded-full transition-colors ${
                    index <= currentStep 
                      ? 'bg-gradient-to-r from-pink-500 to-pink-600' 
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="mb-4">
              <h3 className="font-bold text-lg uppercase" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {currentStepData?.name}
              </h3>
              <p className="text-sm text-gray-600">
                Selecciona {currentStepData?.minSelection === currentStepData?.maxSelection 
                  ? currentStepData?.minSelection
                  : `entre ${currentStepData?.minSelection} y ${currentStepData?.maxSelection}`
                } {currentStepData?.maxSelection === 1 ? 'opción' : 'opciones'}
              </p>
              
              {/* Progress indicator for current step */}
              <div className="mt-2">
                <div className="bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all"
                    style={{ 
                      width: `${((selections[currentStepData?.id] || []).length / currentStepData?.maxSelection) * 100}%`,
                      backgroundColor: isStepValid(currentStep) ? '#10b981' : config.colors.primary
                    }}
                  />
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {(selections[currentStepData?.id] || []).length} de {currentStepData?.maxSelection} seleccionado{(selections[currentStepData?.id] || []).length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {subcategoryProducts.map(subProduct => {
                const isSelected = selections[currentStepData?.id]?.some(p => p.id === subProduct.id);
                const canSelect = (selections[currentStepData?.id] || []).length < currentStepData?.maxSelection || isSelected;
                
                return (
                  <div
                    key={subProduct.id}
                    onClick={() => canSelect && handleProductToggle(currentStepData?.id, subProduct)}
                    className={`border rounded-lg p-3 transition-all ${
                      isSelected 
                        ? 'border-2 bg-opacity-10' 
                        : 'border-gray-200 hover:border-gray-300'
                    } ${canSelect ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
                    style={{
                      borderColor: isSelected ? config.colors.primary : undefined,
                      backgroundColor: isSelected ? `${config.colors.primary}10` : undefined
                    }}
                  >
                    <div className="flex items-start space-x-3">
                      <img 
                        src={subProduct.images?.[0]?.src || '/api/placeholder/60/60'} 
                        alt={subProduct.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm uppercase truncate" 
                            style={{ fontFamily: 'Poppins, sans-serif' }}>
                          {subProduct.name}
                        </h4>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                          {subProduct.description || 'Deliciosa opción para tu combo'}
                        </p>
                      </div>
                      <div className={`rounded-full p-1 ${
                        isSelected ? 'text-white' : 'border-2 border-gray-300'
                      }`}
                      style={{
                        backgroundColor: isSelected ? config.colors.primary : undefined
                      }}>
                        {isSelected && <Check className="h-4 w-4" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t bg-gray-50">
            <div className="mb-4 text-center">
              <p className="text-sm text-gray-600">Precio del combo:</p>
              <p className="text-2xl font-bold" style={{ color: config.colors.primary }}>
                {formatPrice(product.price)}
              </p>
            </div>
            
            <div className="flex space-x-3">
              {!isFirstStep && (
                <button
                  onClick={handlePrevious}
                  className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-lg transition-colors uppercase flex items-center justify-center"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  <ChevronLeft className="h-5 w-5 mr-1" />
                  ANTERIOR
                </button>
              )}
              
              {!isLastStep ? (
                <button
                  onClick={handleNext}
                  disabled={!isStepValid(currentStep)}
                  className={`flex-1 px-4 py-3 rounded-lg font-bold transition-colors uppercase text-white flex items-center justify-center ${
                    !isStepValid(currentStep) 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'hover:opacity-90'
                  }`}
                  style={{ 
                    fontFamily: 'Poppins, sans-serif',
                    backgroundColor: !isStepValid(currentStep) 
                      ? undefined 
                      : config.colors.primary
                  }}
                >
                  SIGUIENTE
                  <ChevronRight className="h-5 w-5 ml-1" />
                </button>
              ) : (
                <button
                  onClick={handleConfirm}
                  disabled={!isValidSelection()}
                  className={`flex-1 px-6 py-3 rounded-lg font-bold transition-colors uppercase text-white flex items-center justify-center space-x-2 ${
                    !isValidSelection() ? 'bg-gray-400 cursor-not-allowed' : 'hover:opacity-90'
                  }`}
                  style={{ 
                    fontFamily: 'Poppins, sans-serif',
                    backgroundColor: isValidSelection() ? config.colors.primary : undefined
                  }}
                >
                  <Package className="h-5 w-5" />
                  <span>AGREGAR COMBO</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};