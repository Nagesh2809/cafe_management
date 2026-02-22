import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { calculateLoyalty } from '../utils/loyalty';
import { Navigate } from 'react-router-dom';
import { Package, Calendar, Award, User as UserIcon, Star } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

const Profile: React.FC = () => {
  const { user, orders, fetchOrders } = useAuth();
  
  useEffect(() => {
    if (user) {
        fetchOrders();
    }
  }, [user]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const loyalty = calculateLoyalty(user.joinDate);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Toaster />
      
      {/* Header */}
      <div className="mb-10">
        <h1 className="font-serif text-3xl font-bold text-brand-brown">Welcome back, {user.name}</h1>
        <p className="text-gray-500">Member since {new Date(user.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Col: Stats */}
        <div className="space-y-6">
          {/* Loyalty Card */}
          <div className="bg-gradient-to-br from-brand-brown to-brand-red text-white p-6 rounded-2xl shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
            
            <div className="flex items-center gap-2 mb-2 opacity-80">
              <Award size={20} />
              <span className="uppercase tracking-widest text-xs font-bold">Loyalty Status</span>
            </div>
            <h2 className="text-3xl font-serif font-bold mb-1 text-brand-gold">{loyalty.tierName}</h2>
            <div className="text-4xl font-bold mb-4">{loyalty.discountPercent}% OFF</div>
            
            {loyalty.monthsToNextTier !== undefined && (
               <div className="mt-4 pt-4 border-t border-white/20">
                 <p className="text-sm opacity-90">
                   {loyalty.monthsToNextTier} months until <br/>
                   <span className="font-bold text-brand-gold">{loyalty.nextTierPercent}% Discount</span>
                 </p>
                 <div className="w-full bg-black/30 h-1.5 rounded-full mt-2">
                   <div 
                    className="bg-brand-gold h-1.5 rounded-full" 
                    style={{ width: `${(loyalty.monthsActive / (loyalty.monthsActive + loyalty.monthsToNextTier)) * 100}%`}}
                   ></div>
                 </div>
               </div>
            )}
          </div>

          {/* Personal Details */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
             <h3 className="font-bold text-brand-brown mb-4 flex items-center gap-2">
               <UserIcon size={18} /> Account Details
             </h3>
             <div className="space-y-3 text-sm">
               <div>
                 <span className="block text-gray-400 text-xs">Email</span>
                 <span className="text-gray-700">{user.email}</span>
               </div>
               <div>
                 <span className="block text-gray-400 text-xs">Role</span>
                 <span className="uppercase text-xs font-bold bg-gray-100 px-2 py-0.5 rounded">{user.role}</span>
               </div>
             </div>
          </div>
        </div>

        {/* Right Col: Orders */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
            <div className="p-6 border-b border-stone-100 flex justify-between items-center">
              <h3 className="font-bold text-brand-brown flex items-center gap-2">
                <Package size={18} /> Order History
              </h3>
              <span className="text-xs bg-brand-cream text-brand-brown px-2 py-1 rounded-full font-bold">
                {orders.length} Orders
              </span>
            </div>
            
            <div className="divide-y divide-stone-100">
              {orders.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                   No orders found. Time for some Chai?
                </div>
              ) : (
                orders.map(order => (
                  <div key={order.id} className="p-6 hover:bg-stone-50 transition">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="font-bold text-brand-brown block">#{order.id}</span>
                        <span className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <Calendar size={12} /> {new Date(order.date).toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' })}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="block font-bold text-brand-red">₹{order.total}</span>
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                            order.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                            {order.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm text-gray-600 bg-white border border-stone-100 p-2 rounded">
                          <span>{item.quantity}x {item.name}</span>
                          {/* Add-ons visualization could go here if available in model */}
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;