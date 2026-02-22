import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Order } from '../types';
import { toast } from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, joinDate?: string) => Promise<void>;
  logout: () => void;
  orders: Order[];
  fetchOrders: () => Promise<void>;
  addOrder: (order: any) => Promise<void>;
  updateOrderStatus: (orderId: string, status: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Use 127.0.0.1 to avoid localhost resolution issues on some systems
const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  // We do NOT load from localStorage. Data persists only in memory (Refresh = Logout)
  
  const fetchUser = async (accessToken: string) => {
    try {
        const res = await fetch(`${API_URL}/users/me`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        if (res.ok) {
            const userData = await res.json();
            setUser(userData);
        }
    } catch (err) {
        console.error("Failed to fetch user");
    }
  };

  const login = async (email: string, password: string) => {
    try {
        const res = await fetch(`${API_URL}/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (!res.ok) throw new Error("Invalid credentials");
        
        const data = await res.json();
        setToken(data.access_token);
        await fetchUser(data.access_token);
        toast.success("Welcome back!");
    } catch (err: any) {
        toast.error(err.message || "Login failed");
        throw err;
    }
  };

  const register = async (name: string, email: string, password: string, joinDate?: string) => {
    try {
        const res = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, join_date: joinDate })
        });
        
        if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData.detail || "Registration failed");
        }
        
        // Auto login after register
        await login(email, password);
    } catch (err: any) {
        toast.error(err.message);
        throw err;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setOrders([]);
    toast.success("Logged out");
  };

  const fetchOrders = async () => {
    if (!token) return;
    try {
        const endpoint = user?.role === 'admin' ? '/admin/orders' : '/orders/me';
        const res = await fetch(`${API_URL}${endpoint}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
            const data = await res.json();
            setOrders(data);
        }
    } catch (err) {
        console.error("Failed to fetch orders");
    }
  };

  const addOrder = async (orderData: any) => {
      if (!token) return;
      try {
          const res = await fetch(`${API_URL}/orders`, {
              method: 'POST',
              headers: { 
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`
              },
              body: JSON.stringify(orderData)
          });
          if (!res.ok) throw new Error("Order failed");
          await fetchOrders(); 
      } catch (err) {
          console.error(err);
          throw err;
      }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
      if (!token || user?.role !== 'admin') return;
      try {
          await fetch(`${API_URL}/admin/orders/${orderId}/status`, {
              method: 'PUT',
              headers: { 
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`
              },
              body: JSON.stringify({ status })
          });
          await fetchOrders();
      } catch (err) {
          toast.error("Failed to update status");
      }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token,
      isAuthenticated: !!user, 
      isAdmin: user?.role === 'admin',
      login, 
      register,
      logout, 
      orders, 
      fetchOrders,
      addOrder,
      updateOrderStatus
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
