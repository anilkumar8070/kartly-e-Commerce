// frontend/src/screens/PlaceOrderScreen.js

import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import Message from '../components/Message';
import CheckoutSteps from '../components/CheckoutSteps';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import Loader from '../components/Loader';

const PlaceOrderScreen = () => {
    const navigate = useNavigate();
    const { state: cartState, dispatch: cartDispatch } = useContext(CartContext);
    const { state: authState } = useContext(AuthContext);
    const { userInfo } = authState;

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // Destructure for stability and easier access
    const { cartItems, shippingAddress } = cartState;

    // Calculations - ensuring cartItems exists before reducing
    const itemsPrice = cartItems ? (Math.round(cartItems.reduce((acc, item) => acc + item.price * item.qty, 0) * 100) / 100).toFixed(2) : '0.00';
    const shippingPrice = (itemsPrice > 100 ? 0 : 10).toFixed(2);
    const taxPrice = (Math.round(Number(0.15 * itemsPrice) * 100) / 100).toFixed(2);
    const totalPrice = (Number(itemsPrice) + Number(shippingPrice) + Number(taxPrice)).toFixed(2);

    useEffect(() => {
        // Use optional chaining for safety. Redirect if address is missing.
        if (!shippingAddress?.address) {
            navigate('/shipping');
        }
    }, [shippingAddress, navigate]);

    const placeOrderHandler = async () => {
        setLoading(true);
        setError(null);
        try {
            const config = { 
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` } 
            };
            
            const payload = {
                orderItems: cartItems,
                shippingAddress: shippingAddress, // Sending the full, correct address object from context
                paymentMethod: 'Cash on Delivery',
                itemsPrice, 
                taxPrice, 
                shippingPrice, 
                totalPrice,
            };

            const { data: createdOrder } = await axios.post('/api/orders', payload, config);
            
            cartDispatch({ type: 'CART_CLEAR_ITEMS' });
            localStorage.removeItem('cartItems');
            navigate(`/order/${createdOrder._id}`);

        } catch (err) {
            // This will now catch the "Shipping address is missing" error from the backend
            setError(err.response?.data?.message || err.message);
            setLoading(false);
        }
    };

    return (
        <>
            <CheckoutSteps step1 step2 step3 />
            {/* Display the error message if the API call fails */}
            {error && <Message variant='danger' className="my-3">{error}</Message>}
            <Row>
                <Col md={8}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Shipping</h2>
                            <p>
                                <strong>Address: </strong>
                                {/* Display the address here to confirm it's correct before sending */}
                                {shippingAddress?.address}, {shippingAddress?.city} {shippingAddress?.postalCode}, {shippingAddress?.country}
                            </p>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <h2>Payment Method</h2>
                            <strong>Method: </strong>Cash on Delivery
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <h2>Order Items</h2>
                            {!cartItems || cartItems.length === 0 ? <Message>Your cart is empty</Message> : (
                                <ListGroup variant='flush'>
                                    {cartItems.map((item, index) => (
                                        <ListGroup.Item key={index}>
                                            <Row className="align-items-center">
                                                <Col xs={2} md={1}><Image src={item.image} alt={item.name} fluid rounded /></Col>
                                                <Col><Link to={`/product/${item.product}`}>{item.name}</Link></Col>
                                                <Col xs={12} md={4} className="mt-2 mt-md-0">{item.qty} x ${item.price.toFixed(2)} = ${(item.qty * item.price).toFixed(2)}</Col>
                                            </Row>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            )}
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
                <Col md={4}>
                    <Card>
                        <ListGroup variant='flush'>
                            <ListGroup.Item><h2>Order Summary</h2></ListGroup.Item>
                            <ListGroup.Item><Row><Col>Items</Col><Col>${itemsPrice}</Col></Row></ListGroup.Item>
                            <ListGroup.Item><Row><Col>Shipping</Col><Col>${shippingPrice}</Col></Row></ListGroup.Item>
                            <ListGroup.Item><Row><Col>Tax</Col><Col>${taxPrice}</Col></Row></ListGroup.Item>
                            <ListGroup.Item><Row><Col><strong>Total</strong></Col><Col><strong>${totalPrice}</strong></Col></Row></ListGroup.Item>
                            {loading && <ListGroup.Item><Loader /></ListGroup.Item>}
                            <ListGroup.Item className="d-grid">
                                <Button type='button' disabled={!cartItems || cartItems.length === 0 || loading} onClick={placeOrderHandler}>Place Order</Button>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default PlaceOrderScreen;