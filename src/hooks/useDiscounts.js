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

    config.discounts.rules.forEach(rule => {
      if (!rule.enabled) return;

      switch (rule.type) {
        case 'buyXgetY': {
          const eligibleItems = cart.filter(item => {
            const hasCategoryCondition = rule.conditions.categories?.length > 0;
            const hasProductCondition = rule.conditions.products?.length > 0;

            if (!hasCategoryCondition && !hasProductCondition) {
              // Si la regla no especifica categorías o productos, no debe aplicar a nada.
              return false;
            }

            let isEligible = false;
            if (hasCategoryCondition) {
              isEligible = item.categories?.some(cat => 
                rule.conditions.categories.includes(cat.id.toString())
              );
            }
            if (!isEligible && hasProductCondition) {
              isEligible = rule.conditions.products.includes(item.id.toString());
            }
            return isEligible;
          });

          if (eligibleItems.length > 0 && eligibleItems.reduce((sum, item) => sum + item.quantity, 0) >= rule.conditions.minQuantity) {
            const totalQuantity = eligibleItems.reduce((sum, item) => sum + item.quantity, 0);
            const setsOfPromo = Math.floor(totalQuantity / rule.conditions.minQuantity);
            const freeItems = setsOfPromo * rule.conditions.getQuantity;
            
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
          let eligibleAmount = 0;
          
          cart.forEach(item => {
            let isEligible = false;
            
            if (rule.conditions.categories?.length > 0) {
              isEligible = item.categories?.some(cat => 
                rule.conditions.categories.includes(cat.id.toString())
              );
            }
            
            if (!isEligible && rule.conditions.products?.length > 0) {
              isEligible = rule.conditions.products.includes(item.id.toString());
            }
            
            if (!rule.conditions.categories?.length && !rule.conditions.products?.length) {
              isEligible = true;
            }
            
            if (isEligible) {
              eligibleAmount += item.price * item.quantity;
            }
          });
          
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
          if (rule.conditions.tiers) {
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

        default:
            break;
      }
    });

    return {
      total: totalDiscount,
      applied: appliedDiscounts,
      pending: []
    };
  };

  return {
    calculateDiscounts
  };
};