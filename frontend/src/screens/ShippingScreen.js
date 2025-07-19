// frontend/src/screens/ShippingScreen.js

import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const ShippingScreen = () => {
    const { state: cartState, dispatch: cartDispatch } = useContext(CartContext);
    const { shippingAddress: cartShippingAddress } = cartState;
    const { state: authState } = useContext(AuthContext);
    const { userInfo } = authState;
    const navigate = useNavigate();

    // Prioritize profile address, then context address, then empty
    const [address, setAddress] = useState(userInfo?.shippingAddress?.address || cartShippingAddress.address || '');
    const [city, setCity] = useState(userInfo?.shippingAddress?.city || cartShippingAddress.city || '');
    const [postalCode, setPostalCode] = useState(userInfo?.shippingAddress?.postalCode || cartShippingAddress.postalCode || '');
    const [country, setCountry] = useState(userInfo?.shippingAddress?.country || cartShippingAddress.country || '');

    useEffect(() => { if (!userInfo) { navigate('/login?redirect=/shipping'); } }, [userInfo, navigate]);

    const submitHandler = (e) => {
        e.preventDefault();
        // Dispatch the address to the cart context. This is a critical step.
        cartDispatch({
            type: 'CART_SAVE_SHIPPING_ADDRESS',
            payload: { address, city, postalCode, country },
        });
        navigate('/placeorder');
    };

    return (
        <FormContainer>
            <CheckoutSteps step1 step2 />
            <h1>Shipping Address</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group controlId='address' className='mb-3'><Form.Label>Address</Form.Label><Form.Control type='text' placeholder='Enter address' required value={address} onChange={(e) => setAddress(e.target.value)}></Form.Control></Form.Group>
                <Form.Group controlId='city' className='mb-3'><Form.Label>City</Form.Label><Form.Control type='text' placeholder='Enter city' required value={city} onChange={(e) => setCity(e.target.value)}></Form.Control></Form.Group>
                <Form.Group controlId='postalCode' className='mb-3'><Form.Label>Postal Code</Form.Label><Form.Control type='text' placeholder='Enter postal code' required value={postalCode} onChange={(e) => setPostalCode(e.target.value)}></Form.Control></Form.Group>
                <Form.Group controlId='country' className='mb-3'><Form.Label>Country</Form.Label><Form.Control type='text' placeholder='Enter country' required value={country} onChange={(e) => setCountry(e.target.value)}></Form.Control></Form.Group>
                <Button type='submit' variant='primary' className='mt-3'>Continue</Button>
            </Form>
        </FormContainer>
    );
};

export default ShippingScreen;