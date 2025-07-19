// frontend/src/context/CartContext.js

import React, { createContext, useReducer, useEffect } from 'react';

export const CartContext = createContext();

// A safer way to get initial state from localStorage
const getInitialState = () => {
  try {
    const cartItemsFromStorage = localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [];
    const shippingAddressFromStorage = localStorage.getItem('shippingAddress') ? JSON.parse(localStorage.getItem('shippingAddress')) : {};
    
    return {
      cartItems: cartItemsFromStorage,
      shippingAddress: shippingAddressFromStorage,
    };
  } catch (error) {
    console.error("Failed to parse localStorage data, resetting.", error);
    // Return a clean state if localStorage is corrupted
    return { cartItems: [], shippingAddress: {} };
  }
};

const initialState = getInitialState();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'CART_ADD_ITEM':
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x.product === item.product);
      if (existItem) {
        return { ...state, cartItems: state.cartItems.map((x) => x.product === existItem.product ? item : x) };
      } else {
        return { ...state, cartItems: [...state.cartItems, item] };
      }
    case 'CART_REMOVE_ITEM':
      return { ...state, cartItems: state.cartItems.filter((x) => x.product !== action.payload) };
    case 'CART_SAVE_SHIPPING_ADDRESS':
      return { ...state, shippingAddress: action.payload };
    case 'CART_CLEAR_ITEMS':
      // We keep the shipping address even when the cart is cleared
      return { ...state, cartItems: [] };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // This useEffect reliably saves the state to localStorage whenever it changes.
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    localStorage.setItem('shippingAddress', JSON.stringify(state.shippingAddress));
  }, [state.cartItems, state.shippingAddress]);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};