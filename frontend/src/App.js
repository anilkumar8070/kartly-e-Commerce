import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ProfileScreen from './screens/ProfileScreen';
import ShippingScreen from './screens/ShippingScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import ProductListScreen from './screens/ProductListScreen';
import ProductEditScreen from './screens/ProductEditScreen';
import SellerOrderListScreen from './screens/SellerOrderListScreen';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <Router>
      <Header />
      <main className='py-3'>
        <Container>
          <Routes>
            {/* Public Routes */}
            <Route path='/' element={<HomeScreen />} />
            <Route path='/product/:id' element={<ProductScreen />} />
            <Route path='/cart' element={<CartScreen />} />
            <Route path='/login' element={<LoginScreen />} />
            <Route path='/register' element={<RegisterScreen />} />
            
            {/* Protected Customer & General Routes */}
            <Route path='/shipping' element={<ProtectedRoute><ShippingScreen /></ProtectedRoute>} />
            <Route path='/placeorder' element={<ProtectedRoute><PlaceOrderScreen /></ProtectedRoute>} />
            <Route path='/profile' element={<ProtectedRoute><ProfileScreen /></ProtectedRoute>} />
            <Route path='/order/:id' element={<ProtectedRoute><OrderScreen /></ProtectedRoute>} />
            
            {/* Protected Seller Routes */}
            <Route path='/seller/productlist' element={<ProtectedRoute><ProductListScreen /></ProtectedRoute>} />
            <Route path='/seller/product/:id/edit' element={<ProtectedRoute><ProductEditScreen /></ProtectedRoute>} />
            <Route path='/seller/orders' element={<ProtectedRoute><SellerOrderListScreen /></ProtectedRoute>} />
          </Routes>
        </Container>
      </main>
      <Footer />
    </Router>
  );
};

export default App;