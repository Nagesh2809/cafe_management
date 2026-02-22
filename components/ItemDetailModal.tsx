import React, { useState, useEffect } from 'react';
import { MenuItem, SelectedAddOn } from '../types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { X, Plus, Minus, ShoppingBag, Star, Info, Check, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ItemDetailModalProps {
  item: MenuItem;
  isOpen: boolean;
  onClose: () => void;
}

const ItemDetailModal: React.FC<ItemDetailModalProps> = ({ item, isOpen, onClose }) => {
  const { addToCart } = useCart();
  const { isAdmin } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [selectedAddOns, setSelectedAddOns] = useState<Record<string, number>>({});
  
  // Reset state when item changes
  useEffect(() => {
    if (isOpen) {
        setQuantity(1);
        setSelectedAddOns({});
    }
  }, [isOpen, item]);

  if (!isOpen) return null;

  // Calculate Prices
  const basePrice = item.price;
  
  const addOnsTotal = Object.entries(selectedAddOns).reduce((total, [name, qty]) => {
      const addOn = item.addOns?.find(a => a.name === name);
      return total + (addOn ? addOn.price * (qty as number) : 0);
  }, 0);

  const unitPrice = basePrice + addOnsTotal;
  const finalTotalPrice = unitPrice * quantity;

  const handleAddOnToggle = (addOnName: string, isChecked: boolean) => {
      setSelectedAddOns(prev => {
          const newState = { ...prev };
          if (isChecked) {
              newState[addOnName] = 1;
          } else {
              delete newState[addOnName];
          }
          return newState;
      });
  };

  const handleAddOnQuantity = (addOnName: string, delta: number, max: number = 5) => {
      setSelectedAddOns(prev => {
          const currentQty = prev[addOnName] || 0;
          const newQty = Math.max(0, Math.min(max, currentQty + delta));
          
          const newState = { ...prev };
          if (newQty === 0) {
              delete newState[addOnName];
          } else {
              newState[addOnName] = newQty;
          }
          return newState;
      });
  };

  const handleAddToCart = () => {
    if (isAdmin) {
        toast.error("Admins cannot place orders.");
        return;
    }

    // Construct AddOns Array
    const finalAddOns: SelectedAddOn[] = Object.entries(selectedAddOns).map(([name, qty]) => {
        const originalAddOn = item.addOns?.find(a => a.name === name);
        return {
            name,
            quantity: qty as number,
            price: originalAddOn?.price || 0
        };
    });

    addToCart(item, quantity, finalAddOns);
    
    // Custom Toast with details
    toast.custom((t) => (
      <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <img className="h-10 w-10 rounded-full object-cover" src={item.image} alt="" />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">Added to Cart!</p>
              <p className="mt-1 text-sm text-gray-500">
                {quantity}x {item.name} 
                {finalAddOns.length > 0 && <span className="text-xs block text-brand-gold">with customizations</span>}
              </p>
            </div>
          </div>
        </div>
      </div>
    ), { duration: 2000 });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center sm:p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      {/* Modal Content - Reduced max-width and adjusted heights for compact fit */}
      <div className="bg-brand-cream w-full md:max-w-3xl md:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] relative transform transition-all animate-in slide-in-from-bottom-10 fade-in">
        
        {/* Close Button */}
        <button 
            onClick={onClose}
            className="absolute top-3 right-3 z-10 bg-white/80 p-1.5 rounded-full hover:bg-white text-gray-800 transition shadow-sm"
        >
            <X size={20} />
        </button>
        
        {/* Left Side: Image - Reduced width ratio and height */}
        <div className="md:w-5/12 h-40 md:h-auto relative shrink-0">
            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-16 md:hidden">
                <h2 className="text-white font-serif text-xl font-bold leading-tight">{item.name}</h2>
            </div>
        </div>
        
        {/* Right Side: Details & Customization */}
        <div className="md:w-7/12 flex flex-col h-full bg-brand-cream min-h-0">
            <div className="flex-1 overflow-y-auto p-5 md:p-6 custom-scrollbar">
                
                {/* Header (Desktop) */}
                <div className="hidden md:block mb-3">
                    <div className="flex items-center gap-2 text-xs text-brand-gold font-bold uppercase tracking-wider mb-1">
                        {item.category}
                        {item.isPopular && <span className="bg-brand-red text-white px-1.5 py-0.5 rounded-[4px] text-[10px]">Best Seller</span>}
                        {item.rating && <span className="flex items-center gap-1 text-gray-400 normal-case"><Star size={10} fill="#C5A059" className="text-brand-gold"/> {item.rating}</span>}
                    </div>
                    <h2 className="text-2xl font-serif font-bold text-brand-brown leading-tight">{item.name}</h2>
                </div>

                {/* Price Display */}
                <div className="text-xl font-bold text-brand-red mb-3">
                    ₹{basePrice} <span className="text-xs font-normal text-gray-500">base price</span>
                </div>

                {/* Description - Reduced margins */}
                <p className="text-gray-700 text-sm leading-relaxed mb-4 font-light">
                    {item.longDescription || item.description}
                </p>
                
                {/* Ingredients (Horizontal Layout) */}
                {item.ingredients && (
                    <div className="mb-6">
                        <h4 className="font-bold text-brand-brown mb-2 text-[10px] uppercase tracking-wide flex items-center gap-1.5">
                            <Info size={12} /> Key Ingredients
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                            {item.ingredients.map((ing, i) => (
                                <span 
                                    key={i} 
                                    className="px-2.5 py-1 bg-brand-gold/10 text-brand-brown/80 rounded-full text-[10px] font-semibold border border-brand-gold/20"
                                >
                                    {ing}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
                
                {/* Customizations Section */}
                <div>
                    <h3 className="font-serif text-lg font-bold text-brand-brown mb-3 pb-1 border-b border-brand-gold/20 flex justify-between items-center">
                        <span>Customize</span>
                        {addOnsTotal > 0 && <span className="text-sm font-sans text-brand-gold">+₹{addOnsTotal}</span>}
                    </h3>
                    
                    {!item.addOns || item.addOns.length === 0 ? (
                        <p className="text-gray-400 italic text-sm flex items-center gap-2"><AlertCircle size={14}/> No customizations available.</p>
                    ) : (
                        <div className="space-y-2">
                            {item.addOns.map((addOn, index) => {
                                const currentQty = selectedAddOns[addOn.name] || 0;
                                const isSelected = currentQty > 0;

                                return (
                                    <div key={index} className={`flex items-center justify-between p-2.5 rounded-lg border transition-all ${isSelected ? 'bg-white border-brand-gold shadow-sm' : 'bg-transparent border-gray-200 hover:bg-white'}`}>
                                        <div className="flex-1">
                                            <div className="font-bold text-brand-brown text-sm flex items-center gap-2">
                                                {addOn.name}
                                                {addOn.price > 0 ? (
                                                     <span className="text-xs font-normal text-gray-500">(+₹{addOn.price})</span>
                                                ) : (
                                                    <span className="text-xs font-normal text-green-600 uppercase tracking-wider text-[10px]">Free</span>
                                                )}
                                            </div>
                                        </div>

                                        {addOn.type === 'quantity' ? (
                                            <div className="flex items-center gap-2 bg-gray-100 rounded-md p-0.5">
                                                <button 
                                                    onClick={() => handleAddOnQuantity(addOn.name, -1)}
                                                    className={`w-6 h-6 flex items-center justify-center rounded bg-white text-gray-600 hover:text-brand-red disabled:opacity-50`}
                                                    disabled={currentQty === 0}
                                                >
                                                    <Minus size={12} />
                                                </button>
                                                <span className="w-4 text-center font-bold text-xs">{currentQty}</span>
                                                <button 
                                                    onClick={() => handleAddOnQuantity(addOn.name, 1, addOn.maxQuantity)}
                                                    className="w-6 h-6 flex items-center justify-center rounded bg-white text-gray-600 hover:text-brand-green"
                                                >
                                                    <Plus size={12} />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="relative">
                                                <input 
                                                    type="checkbox" 
                                                    id={`addon-${index}`}
                                                    checked={isSelected}
                                                    onChange={(e) => handleAddOnToggle(addOn.name, e.target.checked)}
                                                    className="peer sr-only"
                                                />
                                                <label 
                                                    htmlFor={`addon-${index}`}
                                                    className="block w-5 h-5 border-2 border-gray-300 rounded cursor-pointer peer-checked:bg-brand-gold peer-checked:border-brand-gold transition-colors relative"
                                                >
                                                    <Check size={14} className="text-white absolute top-0.5 left-0.5 opacity-0 peer-checked:opacity-100" />
                                                </label>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Footer Action Bar - Reduced padding */}
            <div className="p-4 bg-white border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10">
                {item.is_available && !isAdmin ? (
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between md:hidden mb-1">
                             <span className="text-gray-500 font-bold text-sm">Total</span>
                             <span className="text-xl font-bold text-brand-brown">₹{finalTotalPrice}</span>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Quantity Selector */}
                            <div className="flex items-center gap-3 bg-stone-100 rounded-lg px-3 py-2.5 border border-stone-200">
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="hover:text-brand-red transition">
                                    <Minus size={18} />
                                </button>
                                <span className="font-bold text-lg min-w-[20px] text-center">{quantity}</span>
                                <button onClick={() => setQuantity(Math.min(10, quantity + 1))} className="hover:text-green-600 transition">
                                    <Plus size={18} />
                                </button>
                            </div>

                            {/* Add Button */}
                            <button 
                                onClick={handleAddToCart}
                                className="flex-1 bg-brand-brown text-white py-3 rounded-lg font-bold hover:bg-brand-red transition flex items-center justify-between px-6 shadow-lg hover:shadow-xl transform active:scale-95 text-sm md:text-base"
                            >
                                <span className="flex items-center gap-2"><ShoppingBag size={18} /> Add</span>
                                <span className="bg-white/20 px-2 py-0.5 rounded text-xs hidden md:inline-block">₹{finalTotalPrice}</span>
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="w-full bg-gray-100 text-gray-500 py-3 rounded-lg font-bold text-center border border-gray-200 cursor-not-allowed text-sm">
                        {isAdmin ? 'Ordering Disabled for Admins' : 'Currently Unavailable'}
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailModal;