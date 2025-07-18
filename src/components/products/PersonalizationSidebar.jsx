import React, { useState, useEffect } from 'react';
import { X, Check, Pizza, Minus, Plus, Info } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';

export const PersonalizationSidebar = ({ product, config, isOpen, onClose, onConfirm }) => {
  const [selectedSize, setSelectedSize] = useState(null);
  const [removedIngredients, setRemovedIngredients] = useState([]);
  const [addedIngredients, setAddedIngredients] = useState([]);
  
  // --- INICIO DE LA CORRECCIÓN ---
  // Obtener configuración de personalización directamente desde el producto.
  const sizes = product.personalization?.sizes || [];
  const productIngredients = product.personalization?.ingredients || { base: [], extras: [] };
  const extraIngredientPrice = config.personalization?.extraIngredientPrice || 1500;
  // --- FIN DE LA CORRECCIÓN ---
  
  useEffect(() => {
    // Seleccionar el primer tamaño por defecto si existe y no hay uno seleccionado
    if (sizes.length > 0 && !selectedSize) {
      setSelectedSize(sizes[0]);
    }
    // Si no hay tamaños, asegurarse de que no haya ninguno seleccionado
    if (sizes.length === 0) {
      setSelectedSize(null);
    }
  }, [product, sizes, selectedSize]); // Se agrega 'product' como dependencia por si cambia

  const handleIngredientToggle = (ingredient, type) => {
    if (type === 'remove') {
      if (removedIngredients.includes(ingredient)) {
        setRemovedIngredients(removedIngredients.filter(i => i !== ingredient));
      } else {
        setRemovedIngredients([...removedIngredients, ingredient]);
      }
    } else if (type === 'add') {
      if (addedIngredients.includes(ingredient)) {
        setAddedIngredients(addedIngredients.filter(i => i !== ingredient));
      } else {
        setAddedIngredients([...addedIngredients, ingredient]);
      }
    }
  };

  const calculateTotal = () => {
    let total = product.price;
    
    // Agregar modificador de tamaño
    if (selectedSize) {
      total += selectedSize.priceModifier;
    }
    
    // Agregar costo de ingredientes extras
    total += addedIngredients.length * extraIngredientPrice;
    
    return total;
  };

  const handleConfirm = () => {
    const modifications = {
      size: selectedSize,
      removed: removedIngredients,
      added: addedIngredients,
      totalPrice: calculateTotal()
    };
    
    // Se agrega un nombre personalizado para mostrar en el carrito
    const customName = `${product.name} ${selectedSize ? `(${selectedSize.name})` : ''}`;

    onConfirm({
      ...product,
      name: customName, // Usamos el nombre personalizado
      modifications,
      price: calculateTotal()
    });
    
    // Resetear estado
    setRemovedIngredients([]);
    setAddedIngredients([]);
    onClose();
  };

  // Resetea el estado del sidebar cuando se cierra
  useEffect(() => {
      if (!isOpen) {
          setSelectedSize(sizes.length > 0 ? sizes[0] : null);
          setRemovedIngredients([]);
          setAddedIngredients([]);
      }
  }, [isOpen, sizes]);


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
                Ajusta el tamaño e ingredientes a tu gusto
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* Imagen del producto */}
            <div className="mb-6">
              <img 
                src={product.images?.[0]?.src || '/api/placeholder/400/300'} 
                alt={product.name}
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>

            {/* Selección de tamaño */}
            {sizes.length > 0 && (
              <div className="mb-6">
                <h3 className="font-bold text-lg mb-3 uppercase" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  <Pizza className="inline-block h-5 w-5 mr-2" />
                  TAMAÑO
                </h3>
                <div className="space-y-2">
                  {sizes.map(size => (
                    <button
                      key={size.name} // Usar un key más robusto si es posible
                      onClick={() => setSelectedSize(size)}
                      className={`w-full p-3 rounded-lg border-2 transition-all ${
                        selectedSize?.name === size.name
                          ? 'border-pink-500 bg-pink-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{size.name}</span>
                        <span className="text-sm">
                          {size.priceModifier > 0 ? `+${formatPrice(size.priceModifier)}` : 'Precio base'}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Ingredientes base */}
            {productIngredients.base?.length > 0 && (
              <div className="mb-6">
                <h3 className="font-bold text-lg mb-3 uppercase" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  <Minus className="inline-block h-5 w-5 mr-2" />
                  QUITAR INGREDIENTES
                </h3>
                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <p className="text-sm text-gray-600 flex items-start">
                    <Info className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
                    Puedes quitar los ingredientes que no desees sin costo adicional
                  </p>
                </div>
                <div className="space-y-2">
                  {productIngredients.base.map(ingredient => (
                    <label
                      key={ingredient}
                      className="flex items-center p-3 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={removedIngredients.includes(ingredient)}
                        onChange={() => handleIngredientToggle(ingredient, 'remove')}
                        className="mr-3 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      />
                      <span className={removedIngredients.includes(ingredient) ? 'line-through text-gray-400' : ''}>
                        {ingredient}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Ingredientes extras */}
            {productIngredients.extras?.length > 0 && (
              <div className="mb-6">
                <h3 className="font-bold text-lg mb-3 uppercase" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  <Plus className="inline-block h-5 w-5 mr-2" />
                  AGREGAR EXTRAS
                </h3>
                <div className="bg-blue-50 rounded-lg p-3 mb-3">
                  <p className="text-sm text-blue-800">
                    <strong>{formatPrice(extraIngredientPrice)}</strong> por cada ingrediente extra
                  </p>
                </div>
                <div className="space-y-2">
                  {productIngredients.extras.map(ingredient => (
                    <label
                      key={ingredient}
                      className="flex items-center justify-between p-3 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={addedIngredients.includes(ingredient)}
                          onChange={() => handleIngredientToggle(ingredient, 'add')}
                          className="mr-3 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <span>{ingredient}</span>
                      </div>
                      <span className="text-sm text-gray-600">+{formatPrice(extraIngredientPrice)}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t bg-gray-50">
            {/* Resumen de personalización */}
            {(selectedSize || removedIngredients.length > 0 || addedIngredients.length > 0) && (
              <div className="bg-white rounded-lg p-3 mb-4 text-sm space-y-1">
                {selectedSize && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tamaño {selectedSize.name}:</span>
                    <span className="font-medium">
                      {selectedSize.priceModifier > 0 ? `+${formatPrice(selectedSize.priceModifier)}` : 'Incluido'}
                    </span>
                  </div>
                )}
                {removedIngredients.length > 0 && (
                  <div className="text-red-600">
                    <span className="font-medium">Sin:</span> {removedIngredients.join(', ')}
                  </div>
                )}
                {addedIngredients.length > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>
                      <span className="font-medium">Extra:</span> {addedIngredients.join(', ')}
                    </span>
                    <span className="font-medium">
                      +{formatPrice(addedIngredients.length * extraIngredientPrice)}
                    </span>
                  </div>
                )}
              </div>
            )}
            
            <div className="mb-4 text-center">
              <p className="text-sm text-gray-600">Precio total:</p>
              <p className="text-2xl font-bold" style={{ color: config.colors.primary }}>
                {formatPrice(calculateTotal())}
              </p>
            </div>
            
            <button
              onClick={handleConfirm}
              className="w-full px-6 py-3 rounded-lg font-bold transition-colors uppercase text-white flex items-center justify-center space-x-2"
              style={{ 
                fontFamily: 'Poppins, sans-serif',
                backgroundColor: config.colors.buttons?.primary || config.colors.primary
              }}
            >
              <Check className="h-5 w-5" />
              <span>AGREGAR AL CARRITO</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};