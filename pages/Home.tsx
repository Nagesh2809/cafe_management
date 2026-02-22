import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { MenuItem } from '../types';
import { MapPin, Quote, ArrowRight, Star, Loader } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import MenuItemCard from '../components/MenuItemCard';
import ItemDetailModal from '../components/ItemDetailModal';

const API_URL = 'http://127.0.0.1:8000';

const Home: React.FC = () => {
  const { cart } = useCart();
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [featuredItems, setFeaturedItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/menu/popular`)
      .then(res => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then(data => {
        setFeaturedItems(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch popular items", err);
        setLoading(false);
      });
  }, []);

  const getItemCartQuantity = (id: string) => {
    return cart
      .filter(i => i.id === id)
      .reduce((acc, i) => acc + i.quantity, 0);
  };

  return (
    <div className="space-y-20 pb-12">
      <Toaster position="bottom-center" />
      
      {selectedItem && (
        <ItemDetailModal 
            item={selectedItem} 
            isOpen={!!selectedItem} 
            onClose={() => setSelectedItem(null)} 
        />
      )}

      {/* Hero Section */}
      <section className="relative h-[85vh] w-full flex items-center justify-center bg-brand-brown overflow-hidden">
        <div className="absolute inset-0 z-0">
           <img 
            src="https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=2142&auto=format&fit=crop" 
            alt="Cafe Ambience" 
            className="w-full h-full object-cover opacity-50"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-brand-brown via-brand-brown/40 to-black/30"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto flex flex-col items-center">
          <div className="bg-brand-gold/20 backdrop-blur-sm border border-brand-gold/30 px-6 py-2 rounded-full mb-8 animate-fade-in-up">
            <span className="text-brand-cream text-sm font-bold tracking-widest uppercase">Since 1978 • Red Hills, Hyderabad</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white mb-6 drop-shadow-2xl leading-tight">
            The Art of <br/> <span className="text-brand-gold italic">Irani Chai</span>
          </h1>
          
          <p className="text-white/90 text-lg md:text-2xl mb-12 max-w-3xl mx-auto font-light leading-relaxed">
            Where conversations brew over steaming cups and Osmania biscuits. Experience the timeless tradition of Hyderabad's favorite cafe.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6 w-full sm:w-auto">
            <Link to="/menu" className="bg-brand-gold text-brand-brown px-10 py-4 rounded font-bold text-lg hover:bg-white transition duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1">
              Order Now
            </Link>
            <Link to="/about" className="group border-2 border-white/30 backdrop-blur-sm text-white px-10 py-4 rounded font-bold text-lg hover:bg-white hover:text-brand-brown transition duration-300 flex items-center justify-center gap-2">
              Our Legacy <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Picks */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-brand-red text-sm font-bold tracking-widest uppercase mb-2">Crowd Favorites</h2>
            <h3 className="font-serif text-4xl text-brand-brown font-bold">Most Loved Items</h3>
          </div>
          <Link to="/menu" className="hidden md:flex items-center gap-2 text-brand-brown font-bold hover:text-brand-red transition">
            View Full Menu <ArrowRight size={18} />
          </Link>
        </div>

        {loading ? (
            <div className="flex justify-center py-12">
                <div className="flex flex-col items-center">
                    <Loader className="animate-spin text-brand-brown mb-2" />
                    <span className="text-gray-500 text-sm">Loading specials...</span>
                </div>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredItems.map((item) => (
                <MenuItemCard 
                    key={item.id} 
                    item={item} 
                    onOpenModal={setSelectedItem}
                    cartQuantity={getItemCartQuantity(item.id)}
                />
            ))}
            </div>
        )}
        
        <div className="mt-8 md:hidden text-center">
            <Link to="/menu" className="inline-flex items-center gap-2 text-brand-brown font-bold border-b-2 border-brand-gold pb-1">
                View Full Menu <ArrowRight size={18} />
            </Link>
        </div>
      </section>

      <section className="bg-brand-cream border-y border-brand-gold/10 py-20 relative overflow-hidden">
        <Quote className="absolute top-10 left-10 text-brand-gold/10 w-64 h-64" />
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
            <h2 className="font-serif text-3xl font-bold text-brand-brown mb-12">What Hyderabad Says</h2>
            <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-xl shadow-sm text-left">
                    <div className="flex gap-1 text-brand-gold mb-4"><Star fill="currentColor" size={16}/><Star fill="currentColor" size={16}/><Star fill="currentColor" size={16}/><Star fill="currentColor" size={16}/><Star fill="currentColor" size={16}/></div>
                    <p className="text-gray-600 italic mb-6">"My morning isn't complete without Niloufer's Chai and Bun Maska. The consistency of taste for the last 10 years is unbelievable."</p>
                    <div className="font-bold text-brand-brown">- Rajesh Kumar, IT Professional</div>
                </div>
                <div className="bg-white p-8 rounded-xl shadow-sm text-left">
                    <div className="flex gap-1 text-brand-gold mb-4"><Star fill="currentColor" size={16}/><Star fill="currentColor" size={16}/><Star fill="currentColor" size={16}/><Star fill="currentColor" size={16}/><Star fill="currentColor" size={16}/></div>
                    <p className="text-gray-600 italic mb-6">"Best Osmania biscuits in the world. I pack kilos of them whenever I fly back to the US. A true taste of home."</p>
                    <div className="font-bold text-brand-brown">- Sarah Khan, Expat</div>
                </div>
            </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-brand-brown rounded-2xl p-8 md:p-16 flex flex-col md:flex-row items-center justify-between text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-gold rounded-full filter blur-[100px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="relative z-10 md:w-2/3">
            <h2 className="font-serif text-3xl md:text-5xl font-bold mb-6">Join the Niloufer Family</h2>
            <p className="text-white/80 mb-8 text-lg leading-relaxed">
              Our loyalty program rewards your love for Chai. The longer you stay with us, the more you save.
              Get up to <span className="text-brand-gold font-bold text-2xl">15% OFF</span> on every order, automatically applied!
            </p>
          </div>
          <div className="relative z-10">
            <Link to="/register" className="bg-white text-brand-brown px-10 py-4 rounded-full font-bold hover:bg-brand-gold hover:text-white transition shadow-lg inline-block text-lg">
              Start Saving Today
            </Link>
          </div>
        </div>
      </section>
      
      <section className="text-center py-10">
        <div className="flex items-center justify-center gap-2 text-brand-brown opacity-60 mb-2">
            <MapPin size={20} />
            <span className="font-bold tracking-widest uppercase">Visit Us</span>
        </div>
        <p className="text-2xl font-serif font-bold text-brand-brown">Red Hills, Lakdikapul, Hyderabad</p>
      </section>
    </div>
  );
};

export default Home;
