import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, ShoppingBag, Users, Edit2, Trash2, Plus, Loader } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';

const API_URL = 'http://127.0.0.1:8000';

const AdminDashboard: React.FC = () => {
  const { user, isAdmin, token } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'menu' | 'users' | 'orders'>('overview');
  
  // Data States
  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      if (isAdmin && token) {
          fetchData();
      }
  }, [isAdmin, token]);

  const fetchData = async () => {
      setLoading(true);
      try {
          const headers = { Authorization: `Bearer ${token}` };
          
          // Parallel fetch for overview
          const [statsRes, menuRes, ordersRes] = await Promise.all([
              fetch(`${API_URL}/admin/stats`, { headers }),
              fetch(`${API_URL}/menu`, { headers }),
              fetch(`${API_URL}/admin/orders`, { headers })
          ]);

          if (statsRes.ok) setStats(await statsRes.json());
          if (menuRes.ok) setMenuItems(await menuRes.json());
          if (ordersRes.ok) setOrders(await ordersRes.json());
          
      } catch (error) {
          console.error("Failed to load admin data", error);
      } finally {
          setLoading(false);
      }
  };

  const updateOrderStatus = async (orderId: number, status: string) => {
      try {
          await fetch(`${API_URL}/admin/orders/${orderId}/status`, {
              method: 'PUT',
              headers: { 
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`
              },
              body: JSON.stringify({ status })
          });
          toast.success("Status Updated");
          // Update local state
          setOrders(prev => prev.map(o => o.id === orderId ? {...o, status} : o));
      } catch (err) {
          toast.error("Failed to update");
      }
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const method = editingItem.id ? 'PUT' : 'POST';
        const url = editingItem.id ? `${API_URL}/menu/${editingItem.id}` : `${API_URL}/menu`;
        
        const res = await fetch(url, {
            method,
            headers: { 
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(editingItem)
        });

        if (res.ok) {
            toast.success("Menu item saved");
            setEditingItem(null);
            setIsAdding(false);
            // Reload menu
            const menuRes = await fetch(`${API_URL}/menu`);
            setMenuItems(await menuRes.json());
        }
    } catch (err) {
        toast.error("Failed to save item");
    }
  };

  const handleDeleteItem = async (id: number) => {
    if(!window.confirm("Are you sure?")) return;
    try {
        await fetch(`${API_URL}/menu/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        });
        setMenuItems(prev => prev.filter(i => i.id !== id));
        toast.success("Item deleted");
    } catch (err) {
        toast.error("Failed to delete");
    }
  };

  if (!user || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
      return <div className="h-screen flex items-center justify-center"><Loader className="animate-spin" /></div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen">
        <Toaster />
        <div className="bg-brand-brown text-white p-6 shadow-md">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-serif font-bold">Admin Dashboard</h1>
                <div className="space-x-4 text-sm font-bold">
                    <button onClick={() => setActiveTab('overview')} className={`px-4 py-2 rounded-md transition ${activeTab === 'overview' ? 'bg-brand-gold text-brand-brown' : 'hover:bg-white/10'}`}>Overview</button>
                    <button onClick={() => setActiveTab('orders')} className={`px-4 py-2 rounded-md transition ${activeTab === 'orders' ? 'bg-brand-gold text-brand-brown' : 'hover:bg-white/10'}`}>Orders</button>
                    <button onClick={() => setActiveTab('menu')} className={`px-4 py-2 rounded-md transition ${activeTab === 'menu' ? 'bg-brand-gold text-brand-brown' : 'hover:bg-white/10'}`}>Menu</button>
                </div>
            </div>
        </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && stats && (
            <div className="space-y-8 animate-in fade-in">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <div className="flex justify-between mb-2">
                            <h3 className="text-gray-500 text-xs font-bold uppercase">Revenue</h3>
                            <DollarSign className="text-green-500" size={20} />
                        </div>
                        <p className="text-3xl font-bold">₹{stats.revenue?.toLocaleString() || 0}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <div className="flex justify-between mb-2">
                            <h3 className="text-gray-500 text-xs font-bold uppercase">Orders</h3>
                            <ShoppingBag className="text-blue-500" size={20} />
                        </div>
                        <p className="text-3xl font-bold">{stats.orders || 0}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <div className="flex justify-between mb-2">
                            <h3 className="text-gray-500 text-xs font-bold uppercase">Users</h3>
                            <Users className="text-purple-500" size={20} />
                        </div>
                        <p className="text-3xl font-bold">{stats.users || 0}</p>
                    </div>
                </div>

                {/* Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="font-bold text-gray-700 mb-6">Sales Trend</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={stats.sales_history || []}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="sales" stroke="#C5A059" strokeWidth={3} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        )}

        {/* MENU MANAGEMENT TAB */}
        {activeTab === 'menu' && (
            <div className="animate-in fade-in">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Menu Items</h2>
                    <button 
                        onClick={() => { setEditingItem({ name: '', price: 0, category: 'Chai', isAvailable: true, description: '', ingredients: [], add_ons: [] }); setIsAdding(true); }}
                        className="bg-brand-brown text-white px-4 py-2 rounded-md font-bold flex items-center gap-2 hover:bg-brand-red"
                    >
                        <Plus size={18} /> Add New Item
                    </button>
                </div>

                {/* Edit/Add Form Modal/Inline */}
                {(editingItem || isAdding) && (
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-brand-gold/30 mb-8">
                        <h3 className="font-bold text-lg mb-4">{editingItem?.id ? 'Edit Item' : 'Add New Item'}</h3>
                        <form onSubmit={handleSaveItem} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700">Name</label>
                                <input type="text" className="w-full border p-2 rounded" value={editingItem.name} onChange={e => setEditingItem({...editingItem, name: e.target.value})} required />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700">Category</label>
                                <select className="w-full border p-2 rounded" value={editingItem.category} onChange={e => setEditingItem({...editingItem, category: e.target.value})}>
                                    <option>Chai</option><option>Bakery</option><option>Snacks</option><option>Beverages</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700">Price (₹)</label>
                                <input type="number" className="w-full border p-2 rounded" value={editingItem.price} onChange={e => setEditingItem({...editingItem, price: parseFloat(e.target.value)})} required />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700">Image URL</label>
                                <input type="text" className="w-full border p-2 rounded" value={editingItem.image} onChange={e => setEditingItem({...editingItem, image: e.target.value})} />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gray-700">Description</label>
                                <textarea className="w-full border p-2 rounded" value={editingItem.description} onChange={e => setEditingItem({...editingItem, description: e.target.value})} />
                            </div>
                            <div className="md:col-span-2 flex justify-end gap-2">
                                <button type="button" onClick={() => { setEditingItem(null); setIsAdding(false); }} className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-brand-green bg-green-600 text-white rounded font-bold hover:bg-green-700">Save Item</button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Items Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 uppercase">
                            <tr>
                                <th className="px-6 py-3">Name</th>
                                <th className="px-6 py-3">Category</th>
                                <th className="px-6 py-3">Price</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {menuItems.map(item => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-bold">{item.name}</td>
                                    <td className="px-6 py-4">{item.category}</td>
                                    <td className="px-6 py-4">₹{item.price}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${item.is_available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {item.is_available ? 'Available' : 'Unavailable'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button onClick={() => setEditingItem(item)} className="p-1 hover:text-brand-gold"><Edit2 size={18} /></button>
                                        <button onClick={() => handleDeleteItem(item.id)} className="p-1 hover:text-red-600"><Trash2 size={18} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-in fade-in">
                 <div className="p-6 border-b flex justify-between">
                     <h2 className="font-bold text-lg">All Orders</h2>
                 </div>
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 uppercase">
                            <tr>
                                <th className="px-6 py-3">Order ID</th>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Total</th>
                                <th className="px-6 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-mono font-medium">#{order.id}</td>
                                    <td className="px-6 py-4 text-gray-500">{new Date(order.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 font-bold">₹{order.total}</td>
                                    <td className="px-6 py-4">
                                        <select 
                                            value={order.status}
                                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                            className={`border rounded px-2 py-1 text-xs font-bold ${
                                                order.status === 'Completed' ? 'text-green-700 bg-green-100 border-green-200' : 'text-yellow-700 bg-yellow-100 border-yellow-200'
                                            }`}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Processing">Processing</option>
                                            <option value="Completed">Completed</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
