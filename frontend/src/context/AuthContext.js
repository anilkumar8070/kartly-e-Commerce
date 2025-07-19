// src/context/AuthContext.js
import React, { useReducer, createContext } from 'react';

// --- Initial State ---
// Check localStorage to see if a user is already logged in
const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

const initialState = {
  userInfo: userInfoFromStorage,
  loading: false,
  error: null,
};

// --- Reducer Function ---
const authReducer = (state, action) => {
  switch (action.type) {
    case 'USER_REQUEST':
      return { ...state, loading: true, error: null };
    case 'USER_LOGIN_SUCCESS':
      // Also save to localStorage
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
      return { loading: false, error: null, userInfo: action.payload };
    case 'USER_LOGIN_FAIL':
      return { loading: false, error: action.payload, userInfo: null };
    case 'USER_LOGOUT':
      // Remove from localStorage
      localStorage.removeItem('userInfo');
      return { ...state, userInfo: null };
    default:
      return state;
  }
};

// --- Create and Export Context ---
export const AuthContext = createContext();

// --- Provider Component ---
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};