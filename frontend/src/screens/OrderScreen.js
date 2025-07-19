// frontend/src/screens/OrderScreen.js

import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { AuthContext } from '../context/AuthContext';

const OrderScreen = () => {
    const { id: orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deliveryDate, setDeliveryDate] = useState('');
    const { state: authState } = useContext(AuthContext);
    const { userInfo } = authState;

    const fetchOrderDetails = async () => {
        if (!userInfo) return;
        try {
            setLoading(true);
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const { data } = await axios.get(`/api/orders/${orderId}`, config);
            setOrder(data);

            if (data && !data.isCancelled && !data.isDelivered) {
                const createdAt = new Date(data.createdAt);
                const randomDays = Math.floor(Math.random() * 5) + 3;
                const delivery = new Date(createdAt.setDate(createdAt.getDate() + randomDays));
                setDeliveryDate(delivery.toDateString());
            }
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrderDetails();
    // eslint-disable-next-line
    }, [orderId, userInfo]);

    const cancelOrderHandler = async () => {
        if (window.confirm('Are you sure you want to cancel this order?')) {
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                await axios.put(`/api/orders/${orderId}/cancel`, {}, config);
                fetchOrderDetails(); 
            } catch (error) {
                alert('Error cancelling order: ' + (error.response?.data?.message || error.message));
            }
        }
    };

    if (loading) return <Loader />;
    if (error) return <Message variant='danger'>{error}</Message>;
    if (!order) return <Message variant='info'>Order not found.</Message>;

    return (
        <>
            <h1 className="mb-4"><i className="fas fa-receipt"></i> Order #{order._id}</h1>
            <Row>
                <Col md={8}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item className="p-3">
                            <h2 className="mb-3">Shipping Details</h2>
                            <p><strong>Name:</strong> {order.user?.name}</p>
                            <p><strong>Email:</strong> <a href={`mailto:${order.user?.email}`}>{order.user?.email}</a></p>
                            <p><strong>Address:</strong>
                                {order.shippingAddress && order.shippingAddress.address ?
                                    ` ${order.shippingAddress.address}, ${order.shippingAddress.city} ${order.shippingAddress.postalCode}, ${order.shippingAddress.country}`
                                    : <span className="text-muted">No address provided.</span>
                                }
                            </p>
                            {order.isCancelled ? <Message variant='danger'>Cancelled on {new Date(order.cancelledAt).toLocaleDateString()}</Message>
                            : order.isDelivered ? <Message variant='success'>Delivered on {new Date(order.deliveredAt).toLocaleDateString()}</Message>
                            : <Message variant='warning'>Estimated Delivery: {deliveryDate}</Message>}
                        </ListGroup.Item>

                        <ListGroup.Item className="p-3">
                            <h2 className="mb-3">Payment</h2>
                            <p><strong>Method:</strong> {order.paymentMethod}</p>
                            
                            {/* --- THE CORRECTED LOGIC --- */}
                            {order.isPaid ? 
                                <Message variant='success'>Paid on {new Date(order.paidAt).toLocaleDateString()}</Message>
                            : order.paymentMethod === 'Cash on Delivery' ? 
                                <Message variant='info'>Payment to be made upon delivery.</Message>
                            : 
                                <Message variant='danger'>Not Paid</Message>
                            }
                        </ListGroup.Item>

                        <ListGroup.Item className="p-3">
                            <h2 className="mb-3">Order Items</h2>
                            <ListGroup variant='flush'>
                                {order.orderItems.map((item, index) => (
                                    <ListGroup.Item key={index}><Row className="align-items-center"><Col xs={2} md={1}><Image src={item.image} alt={item.name} fluid rounded /></Col><Col><Link to={`/product/${item.product}`}>{item.name}</Link></Col><Col xs={12} md={4} className="mt-2 mt-md-0 text-md-end">{item.qty} x ${item.price.toFixed(2)} = <strong>${(item.qty * item.price).toFixed(2)}</strong></Col></Row></ListGroup.Item>
                                ))}
                            </ListGroup>
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
                <Col md={4}>
                    <Card>
                        <Card.Header as="h2" className="text-center">Order Summary</Card.Header>
                        <ListGroup variant='flush'>
                            <ListGroup.Item><Row><Col>Items</Col><Col>${order.itemsPrice}</Col></Row></ListGroup.Item>
                            <ListGroup.Item><Row><Col>Shipping</Col><Col>${order.shippingPrice}</Col></Row></ListGroup.Item>
                            <ListGroup.Item><Row><Col>Tax</Col><Col>${order.taxPrice}</Col></Row></ListGroup.Item>
                            <ListGroup.Item><Row><Col><strong>Total</strong></Col><Col><strong>${order.totalPrice}</strong></Col></Row></ListGroup.Item>
                            {userInfo && order.user && userInfo._id === order.user._id && !order.isPaid && !order.isDelivered && !order.isCancelled && (
                                <ListGroup.Item className="d-grid"><Button type='button' variant='danger' onClick={cancelOrderHandler}>Cancel Order</Button></ListGroup.Item>
                            )}
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default OrderScreen;