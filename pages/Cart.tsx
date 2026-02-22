import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { calculateLoyalty } from '../utils/loyalty';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';

const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const { user, addOrder } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  // Loyalty Calculation
  const loyaltyStatus = user ? calculateLoyalty(user.joinDate) : { discountPercent: 0, tierName: 'Guest' };
  const discountAmount = Math.round((cartTotal * loyaltyStatus.discountPercent) / 100);
  const finalTotal = cartTotal - discountAmount;

  const handleCheckout = async () => {
    if (!user) {
      toast.error("Please login to place an order");
      navigate('/login');
      return;
    }
    
    setIsProcessing(true);
    
    // Construct Order Payload
    const orderData = {
        subtotal: cartTotal,
        discount_amount: discountAmount,
        total: finalTotal,
        items: cart.map(item => ({
            menu_item_id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            selected_options: item.selectedAddOns || []
        }))
    };

    try {
        await addOrder(orderData);
        clearCart();
        toast.success("Order placed successfully!");
        navigate('/profile');
    } catch (err) {
        toast.error("Failed to place order. Try again.");
    } finally {
        setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <div className="bg-brand-gold/10 p-6 rounded-full mb-6">
          <Trash2 size={48} className="text-brand-brown opacity-50" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-brand-brown mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added any treats yet.</p>
        <Link to="/menu" className="bg-brand-brown text-white px-8 py-3 rounded-md font-bold hover:bg-brand-red transition">
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Toaster />
      <h1 className="font-serif text-3xl font-bold text-brand-brown mb-8 border-b border-stone-200 pb-4">Your Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-6">
          {cart.map((item) => {
             const addOnsCost = item.selectedAddOns?.reduce((acc, a) => acc + (a.price * a.quantity), 0) || 0;
             const unitPrice = item.price + addOnsCost;

             return (
                <div key={item.cartItemId} className="flex items-start gap-4 bg-white p-4 rounded-lg shadow-sm border border-stone-100">
                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
                
                <div className="flex-grow">
                    <h3 className="font-serif font-bold text-brand-brown">{item.name}</h3>
                    <p className="text-gray-500 text-sm">Base: ₹{item.price}</p>
                    {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                        <div className="mt-2 text-xs text-gray-600 bg-brand-cream p-2 rounded">
                            {item.selectedAddOns.map((addon, i) => (
                                <div key={i} className="flex justify-between">
                                    <span>{addon.quantity > 1 ? `${addon.quantity}x ` : ''}{addon.name}</span>
                                    <span>{addon.price > 0 ? `+₹${addon.price * addon.quantity}` : 'Free'}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-3 bg-stone-100 rounded-md px-2 py-1">
                        <button 
                        onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                        className="p-1 hover:text-brand-red transition"
                        >
                        <Minus size={16} />
                        </button>
                        <span className="font-bold w-4 text-center">{item.quantity}</span>
                        <button 
                        onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                        className="p-1 hover:text-brand-green transition"
                        >
                        <Plus size={16} />
                        </button>
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-brand-brown text-lg">₹{unitPrice * item.quantity}</p>
                    </div>
                    <button 
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="text-gray-400 hover:text-red-500 transition text-xs flex items-center gap-1"
                    >
                        <Trash2 size={12} /> Remove
                    </button>
                </div>
                </div>
             );
          })}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-brand-gold/20 sticky top-24">
            <h2 className="font-serif text-xl font-bold text-brand-brown mb-6">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{cartTotal}</span>
              </div>
              
              <div className="flex justify-between items-center text-brand-gold">
                <div className="flex flex-col">
                  <span>Loyalty Discount</span>
                  <span className="text-xs text-gray-400">
                    {user ? `Tier: ${loyaltyStatus.tierName} (${loyaltyStatus.discountPercent}%)` : 'Login to save'}
                  </span>
                </div>
                <span>- ₹{discountAmount}</span>
              </div>
              
              <div className="border-t border-dashed border-gray-300 pt-3 flex justify-between font-bold text-xl text-brand-brown">
                <span>Total</span>
                <span>₹{finalTotal}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full bg-brand-brown text-white py-4 rounded-lg font-bold hover:bg-brand-red transition flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Processing...' : (
                <>Place Order <ArrowRight size={20} /></>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
