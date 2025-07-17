import { useMemo } from 'react';
import { useConfig } from '../context/ConfigContext';

export const useDiscounts = () => {
  const { config } = useConfig();

  const calculateDiscounts = (cart, subtotal) => {
    if (!config.discounts?.enabled || !config.discounts?.rules) {
      return {
        total: 0,
        applied: []
      };
    }

    const appliedDiscounts = [];
    let totalDiscount = 0;

    // Revisar cada regla de descuento
    config.discounts.rules.forEach(rule => {
      if (!rule.enabled) return;

      switch (rule.type) {
        case 'buyXgetY': {
          // Lógica para promociones tipo 2x1, 3x2, etc.
          const eligibleItems = cart.filter(item => {
            // Verificar si el producto está en las categorías de la regla
            if (rule.conditions.categories?.length > 0) {
              return item.categories?.some(cat => 
                rule.conditions.categories.includes(cat.id.toString())
              );
            }
            // Verificar si es un producto específico
            if (rule.conditions.products?.length > 0) {
              return rule.conditions.products.includes(item.id.toString());
            }
            return false;
          });

          if (eligibleItems.length >= rule.conditions.minQuantity) {
            // Calcular cuántos productos gratis corresponden
            const totalQuantity = eligibleItems.reduce((sum, item) => sum + item.quantity, 0);
            const setsOfPromo = Math.floor(totalQuantity / rule.conditions.minQuantity);
            const freeItems = setsOfPromo * rule.conditions.getQuantity;
            
            // Ordenar por precio para dar gratis los más baratos
            const sortedItems = [...eligibleItems].sort((a, b) => a.price - b.price);
            
            let freeItemsCount = 0;
            let discount = 0;
            
            for (const item of sortedItems) {
              if (freeItemsCount >= freeItems) break;
              
              const itemsToDiscount = Math.min(item.quantity, freeItems - freeItemsCount);
              discount += item.price * itemsToDiscount * (rule.value / 100);
              freeItemsCount += itemsToDiscount;
            }
            
            if (discount > 0) {
              appliedDiscounts.push({
                ruleId: rule.id,
                type: rule.type,
                description: rule.name,
                amount: discount
              });
              totalDiscount += discount;
            }
          }
          break;
        }

        case 'percentage': {
          // Descuento porcentual sobre categorías o productos
          let eligibleAmount = 0;
          
          cart.forEach(item => {
            let isEligible = false;
            
            // Verificar categorías
            if (rule.conditions.categories?.length > 0) {
              isEligible = item.categories?.some(cat => 
                rule.conditions.categories.includes(cat.id.toString())
              );
            }
            
            // Verificar productos específicos
            if (!isEligible && rule.conditions.products?.length > 0) {
              isEligible = rule.conditions.products.includes(item.id.toString());
            }
            
            // Si no hay condiciones específicas, aplicar a todo
            if (!rule.conditions.categories?.length && !rule.conditions.products?.length) {
              isEligible = true;
            }
            
            if (isEligible) {
              eligibleAmount += item.price * item.quantity;
            }
          });
          
          // Verificar monto mínimo
          if (rule.conditions.minAmount && subtotal < rule.conditions.minAmount) {
            return;
          }
          
          const discount = eligibleAmount * (rule.value / 100);
          
          if (discount > 0) {
            appliedDiscounts.push({
              ruleId: rule.id,
              type: rule.type,
              description: rule.name,
              amount: discount
            });
            totalDiscount += discount;
          }
          break;
        }

        case 'fixed': {
          // Descuento fijo
          // Verificar monto mínimo
          if (rule.conditions.minAmount && subtotal < rule.conditions.minAmount) {
            return;
          }
          
          appliedDiscounts.push({
            ruleId: rule.id,
            type: rule.type,
            description: rule.name,
            amount: rule.value
          });
          totalDiscount += rule.value;
          break;
        }

        case 'progressive': {
          // Descuento progresivo basado en monto de compra
          if (rule.conditions.tiers) {
            // Encontrar el tier aplicable
            let applicableTier = null;
            
            rule.conditions.tiers.forEach(tier => {
              if (subtotal >= tier.minAmount && (!applicableTier || tier.minAmount > applicableTier.minAmount)) {
                applicableTier = tier;
              }
            });
            
            if (applicableTier) {
              const discount = applicableTier.type === 'percentage' 
                ? subtotal * (applicableTier.value / 100)
                : applicableTier.value;
                
              appliedDiscounts.push({
                ruleId: rule.id,
                type: rule.type,
                description: `${rule.name} (${applicableTier.type === 'percentage' ? applicableTier.value + '%' : '$' + applicableTier.value})`,
                amount: discount
              });
              totalDiscount += discount;
            }
          }
          break;
        }
      }
    });

    return {
      total: totalDiscount,
      applied: appliedDiscounts,
      pending: [] // Por ahora vacío, la lógica está en PendingDiscounts
    };
  };

  return {
    calculateDiscounts
  };
};