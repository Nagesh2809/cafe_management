import React from 'react';
import { MenuItem } from '../types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Plus, Star, ShoppingBag, Loader } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface MenuItemCardProps {
  item: MenuItem;
  onOpenModal: (item: MenuItem) => void;
  cartQuantity: number;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onOpenModal, cartQuantity }) => {
  const { addToCart } = useCart();
  const { isAdmin } = useAuth();
  const [isAdding, setIsAdding] = React.useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation(); // Stop bubbling to card click
    
    if (isAdmin) {
      toast.error("Admins cannot place orders.");
      return;
    }

    setIsAdding(true);
    
    // Add item with default settings: 1 qty, no add-ons
    addToCart(item, 1, []); 
    
    toast.success((t) => (
      <span className="flex items-center gap-2">
         Added <b>{item.name}</b> to cart!
      </span>
    ), { duration: 2000, position: 'bottom-center' });

    // Tiny visual feedback delay
    setTimeout(() => setIsAdding(false), 500);
  };

  return (
    <div 
      onClick={() => item.is_available && onOpenModal(item)}
      className={`group bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden transition-all duration-300 flex flex-col h-full
        ${item.is_available ? 'hover:shadow-xl hover:-translate-y-1 cursor-pointer' : 'opacity-75 grayscale cursor-not-allowed'}
      `}
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {!item.is_available && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold uppercase tracking-widest z-10">
            Out of Stock
          </div>
        )}
        <div className="absolute top-2 right-2 bg-white/95 backdrop-blur text-brand-brown px-3 py-1 rounded-full text-sm font-bold shadow-sm z-10">
          ₹{item.price}
        </div>
        {item.rating && (
          <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur text-white px-2 py-0.5 rounded-md text-xs font-bold flex items-center gap-1">
            <Star size={10} fill="currentColor" className="text-brand-gold" /> {item.rating}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-grow relative">
        <div className="mb-4 flex-grow">
          <span className="text-xs font-bold text-brand-gold uppercase tracking-wider">{item.category}</span>
          <h3 className="font-serif text-xl font-bold text-brand-brown mt-1 group-hover:text-brand-red transition-colors">
            {item.name}
          </h3>
          <p className="text-gray-500 text-sm mt-2 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Action Button */}
        {item.is_available && !isAdmin ? (
          <button
            onClick={handleQuickAdd}
            disabled={isAdding}
            className={`w-full py-3 rounded-lg font-bold transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden
              ${cartQuantity > 0 
                ? 'bg-brand-brown text-white shadow-md hover:bg-brand-red' 
                : 'bg-brand-cream border border-brand-brown/30 text-brand-brown hover:bg-brand-brown hover:text-white'
              }
            `}
          >
             {isAdding ? (
               <Loader className="animate-spin" size={18} />
             ) : (
                <>
                  {cartQuantity > 0 ? (
                      <>Add More <span className="text-xs bg-white/20 px-1.5 rounded-full ml-1">{cartQuantity}</span></>
                  ) : (
                      <><Plus size={18} /> Quick Add</>
                  )}
                </>
             )}
          </button>
        ) : (
           <div className="h-12 flex items-center justify-center text-xs text-gray-400 font-bold uppercase tracking-widest bg-gray-50 rounded-lg">
             {isAdmin ? 'View Details' : 'Unavailable'}
           </div>
        )}
      </div>
    </div>
  );
};

export default MenuItemCard;