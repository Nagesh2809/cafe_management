export type Role = 'user' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  joinDate: string; // ISO Date string
  phone?: string;
  role: Role;
}

export interface AddOn {
  name: string;
  price: number;
  type: 'toggle' | 'quantity'; // toggle = checkbox, quantity = counter
  maxQuantity?: number; // for 'quantity' type
}

export interface MenuItem {
  id: string;
  name: string;
  category: 'Chai' | 'Bakery' | 'Snacks' | 'Beverages' | 'Merchandise';
  price: number;
  description: string;
  longDescription?: string;
  ingredients?: string[];
  image: string;
  isPopular?: boolean;
  isAvailable: boolean;
  rating?: number;
  reviewsCount?: number;
  addOns?: AddOn[]; // Available add-ons for this item
}

export interface SelectedAddOn {
  name: string;
  price: number;
  quantity: number;
}

export interface CartItem extends MenuItem {
  cartItemId: string; // Unique ID for cart entry (combines itemId + options)
  quantity: number;
  selectedAddOns?: SelectedAddOn[];
}

export interface Order {
  id: string;
  userId?: string;
  userName?: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  discountPercentage: number;
  total: number;
  status: 'Pending' | 'Processing' | 'Completed' | 'Cancelled';
}

export interface LoyaltyStatus {
  tierName: string;
  discountPercent: number;
  monthsActive: number;
  nextTierPercent?: number;
  monthsToNextTier?: number;
}