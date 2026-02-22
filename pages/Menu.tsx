import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { MenuItem } from '../types';
import { Search, Loader } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import ItemDetailModal from '../components/ItemDetailModal';
import MenuItemCard from '../components/MenuItemCard';

const CATEGORIES = ['All', 'Chai', 'Bakery', 'Snacks', 'Beverages'];
const API_URL = 'http://127.0.0.1:8000';

const Menu: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { cart } = useCart();

  useEffect(() => {
    fetch(`${API_URL}/menu`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then(data => {
        setMenuItems(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch menu", err);
        setLoading(false);
      });
  }, []);

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getItemCartQuantity = (id: string) => {
    return cart
      .filter(i => i.id === id)
      .reduce((acc, i) => acc + i.quantity, 0);
  };

  return (
    <div className="min-h-screen bg-brand-cream pb-20">
      <Toaster position="bottom-center" />
      
      {selectedItem && (
          <ItemDetailModal 
            item={selectedItem} 
            isOpen={!!selectedItem} 
            onClose={() => setSelectedItem(null)} 
          />
      )}

      <div className="bg-brand-brown text-white py-12 text-center relative overflow-hidden">
         <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <h1 className="font-serif text-4xl font-bold mb-2 relative z-10">Our Menu</h1>
        <p className="opacity-80 relative z-10">Freshly prepared, authentically brewed.</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10 sticky top-24 z-30 bg-brand-cream/95 p-4 rounded-lg shadow-sm border border-stone-200 backdrop-blur-sm transition-all">
          <div className="flex overflow-x-auto pb-2 md:pb-0 gap-2 w-full md:w-auto no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 ${
                  activeCategory === cat
                    ? 'bg-brand-red text-white shadow-md'
                    : 'bg-white text-brand-brown border border-stone-200 hover:border-brand-red'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="w-full md:w-64 relative">
            <input
              type="text"
              placeholder="Search cravings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-stone-300 focus:outline-none focus:ring-2 focus:ring-brand-gold bg-white shadow-sm focus:shadow-md transition-shadow"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
        </div>

        {loading ? (
           <div className="flex justify-center py-20">
             <div className="flex flex-col items-center">
                <Loader className="animate-spin text-brand-gold mb-2" size={40} />
                <span className="text-gray-500">Loading menu...</span>
             </div>
           </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <MenuItemCard 
                    key={item.id} 
                    item={item} 
                    onOpenModal={setSelectedItem}
                    cartQuantity={getItemCartQuantity(item.id)}
                />
              ))}
            </div>
        )}
        
        {!loading && filteredItems.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-xl">No items found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;
