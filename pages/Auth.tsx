import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        await login(email, password);
        navigate('/');
    } catch (err) {
        // Error handled in context
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-brand-cream px-4">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md border border-brand-gold/20">
        <h2 className="text-3xl font-serif font-bold text-center text-brand-brown mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-gold focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-gold focus:outline-none"
            />
          </div>
          <button type="submit" className="w-full bg-brand-brown text-white py-3 rounded-md font-bold hover:bg-brand-red transition">
            Sign In
          </button>
        </form>
        <p className="text-center mt-4 text-sm">
          Don't have an account? <a href="/register" className="text-brand-red font-bold">Register</a>
        </p>
      </div>
    </div>
  );
};

export const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password');
  const [simulatedTime, setSimulatedTime] = useState('now');
  const { register } = useAuth();
  const navigate = useNavigate();

  // Helper to subtract months natively
  const subMonths = (date: Date, months: number): Date => {
    const d = new Date(date);
    d.setMonth(d.getMonth() - months);
    return d;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let joinDate = new Date().toISOString();
    
    // DEMO FEATURE: Simulate join date to test loyalty system
    if (simulatedTime === '7months') {
      joinDate = subMonths(new Date(), 7).toISOString();
    } else if (simulatedTime === '20months') {
      joinDate = subMonths(new Date(), 20).toISOString();
    } else if (simulatedTime === '40months') {
      joinDate = subMonths(new Date(), 40).toISOString();
    }

    try {
        await register(name, email, password, joinDate);
        navigate('/profile');
    } catch (err) {
        // Handled in context
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-brand-cream px-4">
      <Toaster />
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md border border-brand-gold/20">
        <h2 className="text-3xl font-serif font-bold text-center text-brand-brown mb-6">Join Family</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-gold focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-gold focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-gold focus:outline-none"
            />
          </div>

          <div className="bg-brand-cream p-3 rounded-md border border-brand-gold/50">
            <label className="block text-xs font-bold text-brand-red mb-1 uppercase tracking-wider">Demo: Simulate Join Date</label>
            <select 
              value={simulatedTime} 
              onChange={e => setSimulatedTime(e.target.value)}
              className="w-full p-2 text-sm border rounded bg-white"
            >
              <option value="now">Just Now (0% Off)</option>
              <option value="7months">7 Months Ago (5% Off)</option>
              <option value="20months">20 Months Ago (10% Off)</option>
              <option value="40months">3+ Years Ago (15% Off)</option>
            </select>
          </div>

          <button type="submit" className="w-full bg-brand-brown text-white py-3 rounded-md font-bold hover:bg-brand-red transition">
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
};