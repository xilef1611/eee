import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    const storedSessionId = localStorage.getItem('cartSessionId');
    if (storedSessionId) {
      setSessionId(storedSessionId);
      fetchCart(storedSessionId);
    }
  }, []);

  const fetchCart = async (sid) => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/cart/${sid}`);
      setCart(data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      const { data } = await axios.post('/api/cart', {
        sessionId,
        productId,
        quantity
      });

      const newSessionId = data.sessionId;
      setSessionId(newSessionId);
      localStorage.setItem('cartSessionId', newSessionId);
      
      await fetchCart(newSessionId);
      toast.success('Produkt zum Warenkorb hinzugefügt!');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Fehler beim Hinzufügen');
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (!sessionId) return;
    
    try {
      await axios.put(`/api/cart/${sessionId}/items/${productId}`, { quantity });
      await fetchCart(sessionId);
      toast.success('Menge aktualisiert');
    } catch (error) {
      toast.error('Fehler beim Aktualisieren');
    }
  };

  const removeFromCart = async (productId) => {
    if (!sessionId) return;
    
    try {
      await axios.delete(`/api/cart/${sessionId}/items/${productId}`);
      await fetchCart(sessionId);
      toast.success('Artikel entfernt');
    } catch (error) {
      toast.error('Fehler beim Entfernen');
    }
  };

  const clearCart = async () => {
    if (!sessionId) return;
    
    try {
      await axios.delete(`/api/cart/${sessionId}`);
      setCart({ items: [], total: 0 });
      localStorage.removeItem('cartSessionId');
      setSessionId(null);
      toast.success('Warenkorb geleert');
    } catch (error) {
      toast.error('Fehler beim Leeren');
    }
  };

  const getItemCount = () => {
    return cart.items.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        sessionId,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getItemCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
