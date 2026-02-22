import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingBag, User as UserIcon, Menu as MenuIcon, X, LayoutDashboard, LogOut, Package, ArrowRight, ChevronRight } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout, isAdmin } = useAuth();
  const { cart, cartTotal } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const isActive = (path: string) => location.pathname === path ? "text-brand-red font-bold" : "text-brand-brown hover:text-brand-red";

  // Hide banner on admin pages, cart page, or login/register
  const shouldShowBanner = !isAdmin && cartCount > 0 && !['/cart', '/login', '/register', '/admin'].includes(location.pathname);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileRef]);

  return (
    <div className="flex flex-col min-h-screen font-sans">
      <nav className="sticky top-0 z-50 bg-brand-cream border-b border-brand-gold/30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex flex-col items-center group">
              <h1 className="font-serif text-2xl font-bold text-brand-red tracking-wide group-hover:scale-105 transition-transform">CAFE NILOUFER</h1>
              <span className="text-xs text-brand-gold tracking-widest uppercase">Since 1978</span>
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex space-x-8 items-center">
              <Link to="/" className={isActive('/')}>Home</Link>
              <Link to="/menu" className={isActive('/menu')}>Menu</Link>
              <Link to="/about" className={isActive('/about')}>About</Link>
              
              {/* Only show Cart if NOT admin */}
              {!isAdmin && (
                <Link to="/cart" className="relative p-2 text-brand-brown hover:text-brand-red group">
                  <ShoppingBag size={24} className="group-hover:fill-current/10" />
                  {cartCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-brand-red rounded-full shadow-sm">
                      {cartCount}
                    </span>
                  )}
                </Link>
              )}

              {user ? (
                <div className="relative" ref={profileRef}>
                  <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 text-brand-brown hover:text-brand-red font-medium focus:outline-none"
                  >
                    <div className="w-8 h-8 rounded-full bg-brand-gold/20 flex items-center justify-center border border-brand-gold/50">
                      <span className="text-xs font-bold">{user.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <span className="max-w-[100px] truncate">Hi, {user.name.split(' ')[0]}</span>
                    {isAdmin && <span className="bg-brand-red text-white text-[10px] px-1 rounded uppercase">Admin</span>}
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-lg shadow-xl py-2 border border-stone-100 animate-in fade-in slide-in-from-top-2">
                       <div className="px-4 py-2 border-b border-stone-100 mb-2">
                         <p className="text-xs text-gray-500">Signed in as</p>
                         <p className="font-bold text-brand-brown truncate">{user.email}</p>
                       </div>
                       
                       {isAdmin && (
                         <Link to="/admin" className="flex items-center px-4 py-2 text-brand-brown hover:bg-stone-50 hover:text-brand-red">
                           <LayoutDashboard size={16} className="mr-3" /> Dashboard
                         </Link>
                       )}
                       
                       <Link to="/profile" className="flex items-center px-4 py-2 text-brand-brown hover:bg-stone-50 hover:text-brand-red">
                         <Package size={16} className="mr-3" /> My Orders
                       </Link>
                       
                       <button onClick={logout} className="w-full text-left flex items-center px-4 py-2 text-red-600 hover:bg-red-50">
                         <LogOut size={16} className="mr-3" /> Logout
                       </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="flex items-center space-x-1 bg-brand-brown text-white px-4 py-2 rounded-md font-semibold hover:bg-brand-red transition shadow-sm">
                  <UserIcon size={18} />
                  <span>Login</span>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-4">
              {!isAdmin && (
                <Link to="/cart" className="relative text-brand-brown">
                  <ShoppingBag size={24} />
                  {cartCount > 0 && (
                    <span className="absolute top-0 right-0 -mt-1 -mr-1 px-1.5 py-0.5 text-xs bg-brand-red text-white rounded-full">
                      {cartCount}
                    </span>
                  )}
                </Link>
              )}
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-brand-brown">
                {isMenuOpen ? <X size={28} /> : <MenuIcon size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-brand-cream border-t border-brand-gold/30 px-4 py-4 space-y-4 shadow-lg">
            {user && <div className="px-2 text-brand-gold font-bold">Hi, {user.name}</div>}
            <Link to="/" className="block text-brand-brown font-medium p-2 hover:bg-white rounded" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link to="/menu" className="block text-brand-brown font-medium p-2 hover:bg-white rounded" onClick={() => setIsMenuOpen(false)}>Menu</Link>
            <Link to="/about" className="block text-brand-brown font-medium p-2 hover:bg-white rounded" onClick={() => setIsMenuOpen(false)}>About Us</Link>
            
            {user ? (
              <>
                 <Link to="/profile" className="block text-brand-brown font-medium p-2 hover:bg-white rounded" onClick={() => setIsMenuOpen(false)}>My Profile</Link>
                 {isAdmin && <Link to="/admin" className="block text-brand-brown font-medium p-2 hover:bg-white rounded" onClick={() => setIsMenuOpen(false)}>Admin Dashboard</Link>}
                 <button onClick={() => { logout(); setIsMenuOpen(false); }} className="block w-full text-left text-brand-red font-medium p-2 hover:bg-red-50 rounded">Logout</button>
              </>
            ) : (
              <Link to="/login" className="block text-brand-brown font-medium bg-brand-gold/10 p-2 rounded text-center" onClick={() => setIsMenuOpen(false)}>Login / Register</Link>
            )}
          </div>
        )}
      </nav>

      <main className="flex-grow">
        {children}
      </main>

      {/* STICKY CART CHECKOUT BANNER */}
      {shouldShowBanner && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-brand-gold/30 shadow-[0_-5px_15px_rgba(0,0,0,0.1)] p-4 z-40 animate-slide-up">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
             <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{cartCount} items in cart</span>
                <span className="text-xl font-bold text-brand-brown">₹{cartTotal} <span className="text-xs font-normal text-gray-400">plus taxes</span></span>
             </div>
             <Link to="/cart" className="bg-brand-red text-white px-6 py-3 rounded-lg font-bold shadow-lg hover:bg-brand-brown transition flex items-center gap-2 group">
                Checkout <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
             </Link>
          </div>
        </div>
      )}

      <footer className={`bg-brand-brown text-brand-cream py-10 mt-12 border-t-4 border-brand-gold ${shouldShowBanner ? 'mb-20' : ''}`}>
         <div className="max-w-7xl mx-auto px-4 text-center text-sm opacity-50">© 2024 Cafe Niloufer Tribute</div>
      </footer>
    </div>
  );
};