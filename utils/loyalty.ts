import { LoyaltyStatus } from '../types';

export const calculateLoyalty = (joinDateStr: string): LoyaltyStatus => {
  const joinDate = new Date(joinDateStr);
  const now = new Date();
  
  // Calculate difference in months natively
  let monthsActive = (now.getFullYear() - joinDate.getFullYear()) * 12 + (now.getMonth() - joinDate.getMonth());
  // Adjust if current day is before join day in the month
  if (now.getDate() < joinDate.getDate()) {
    monthsActive--;
  }

  let discountPercent = 0;
  let tierName = 'Newcomer';
  let nextTierPercent: number | undefined = 5;
  let monthsToNextTier: number | undefined = 6 - monthsActive;

  if (monthsActive >= 36) {
    discountPercent = 15;
    tierName = 'Royal Patron'; // True loyalist
    nextTierPercent = undefined;
    monthsToNextTier = undefined;
  } else if (monthsActive >= 18) {
    discountPercent = 10;
    tierName = 'Connoisseur';
    nextTierPercent = 15;
    monthsToNextTier = 36 - monthsActive;
  } else if (monthsActive >= 6) {
    discountPercent = 5;
    tierName = 'Regular';
    nextTierPercent = 10;
    monthsToNextTier = 18 - monthsActive;
  }

  // Ensure non-negative countdown
  if (monthsToNextTier && monthsToNextTier < 0) monthsToNextTier = 0;

  return {
    tierName,
    discountPercent,
    monthsActive,
    nextTierPercent,
    monthsToNextTier
  };
};