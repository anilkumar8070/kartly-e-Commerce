import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, Table } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Message from '../components/Message';

const ProfileScreen = () => {
    // --- States for user details ---
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    // --- New states for address and phone ---
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [country, setCountry] = useState('');
    
    // --- Other states for messaging and orders ---
    const [message, setMessage] = useState(null);
    const [success, setSuccess] = useState(false);
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [errorOrders, setErrorOrders] = useState(null);
    
    const navigate = useNavigate();
    const { state, dispatch } = useContext(AuthContext);
    const { userInfo, error, loading } = state;

    useEffect(() => {
        if (!userInfo) {
            navigate('/login');
        } else {
            // Pre-fill all form fields from the userInfo object in our global state
            setName(userInfo.name);
            setEmail(userInfo.email);
            setPhone(userInfo.phone || '');
            if (userInfo.shippingAddress) {
                setAddress(userInfo.shippingAddress.address || '');
                setCity(userInfo.shippingAddress.city || '');
                setPostalCode(userInfo.shippingAddress.postalCode || '');
                setCountry(userInfo.shippingAddress.country || '');
            }
        }
    }, [navigate, userInfo]);
    
    useEffect(() => {
        // This effect runs separately to fetch user's orders
        const fetchMyOrders = async () => {
            try {
                setLoadingOrders(true);
                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                };
                const { data } = await axios.get('/api/orders/myorders', config);
                setOrders(data);
                setLoadingOrders(false);
            } catch (error) {
                setErrorOrders(error.response?.data?.message || error.message);
                setLoadingOrders(false);
            }
        };

        if (userInfo) {
            fetchMyOrders();
        }
    }, [userInfo]);

    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage('Passwords do not match');
            setSuccess(false);
            return;
        }
        
        setMessage(null);
        setSuccess(false);
        dispatch({ type: 'USER_REQUEST' });
        try {
            const config = {
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` },
            };
            const { data } = await axios.put('/api/users/profile', {
                name,
                email,
                password,
                phone,
                shippingAddress: { address, city, postalCode, country },
            }, config);
            dispatch({ type: 'USER_LOGIN_SUCCESS', payload: data });
            setSuccess(true);
        } catch (err) {
            const errorMsg = err.response && err.response.data.message ? err.response.data.message : err.message;
            dispatch({ type: 'USER_LOGIN_FAIL', payload: errorMsg });
        }
    };

    return (
        <Row>
            <Col md={4}>
                <h2>User Profile</h2>
                {message && <Message variant='danger'>{message}</Message>}
                {error && <Message variant='danger'>{error}</Message>}
                {success && <Message variant='success'>Profile Updated Successfully</Message>}
                {loading && <h3>Loading...</h3>}
                <Form onSubmit={submitHandler}>
                    <Form.Group controlId='name' className='mb-3'>
                        <Form.Label>Name</Form.Label>
                        <Form.Control type='text' placeholder='Enter name' value={name} onChange={(e) => setName(e.target.value)}></Form.Control>
                    </Form.Group>
                    <Form.Group controlId='email' className='mb-3'>
                        <Form.Label>Email</Form.Label>
                        <Form.Control type='email' placeholder='Enter email' value={email} onChange={(e) => setEmail(e.target.value)}></Form.Control>
                    </Form.Group>
                    
                    <Form.Group controlId='phone' className='mb-3'>
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control type='text' placeholder='Enter phone number' value={phone} onChange={(e) => setPhone(e.target.value)}></Form.Control>
                    </Form.Group>
                    <hr />
                    <h5>Default Shipping Address</h5>
                    <Form.Group controlId='address' className='mb-3'>
                        <Form.Label>Address</Form.Label>
                        <Form.Control type='text' placeholder='Enter address' value={address} onChange={(e) => setAddress(e.target.value)}></Form.Control>
                    </Form.Group>
                    <Form.Group controlId='city' className='mb-3'>
                        <Form.Label>City</Form.Label>
                        <Form.Control type='text' placeholder='Enter city' value={city} onChange={(e) => setCity(e.target.value)}></Form.Control>
                    </Form.Group>
                    <Form.Group controlId='postalCode' className='mb-3'>
                        <Form.Label>Postal Code</Form.Label>
                        <Form.Control type='text' placeholder='Enter postal code' value={postalCode} onChange={(e) => setPostalCode(e.target.value)}></Form.Control>
                    </Form.Group>
                    <Form.Group controlId='country' className='mb-3'>
                        <Form.Label>Country</Form.Label>
                        <Form.Control type='text' placeholder='Enter country' value={country} onChange={(e) => setCountry(e.target.value)}></Form.Control>
                    </Form.Group>
                    <hr />

                    <Form.Group controlId='password'  className='mb-3'>
                        <Form.Label>New Password</Form.Label>
                        <Form.Control type='password' placeholder='Leave blank to keep same' value={password} onChange={(e) => setPassword(e.target.value)}></Form.Control>
                    </Form.Group>
                    <Form.Group controlId='confirmPassword'  className='mb-3'>
                        <Form.Label>Confirm New Password</Form.Label>
                        <Form.Control type='password' placeholder='Leave blank to keep same' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}></Form.Control>
                    </Form.Group>

                    <Button type='submit' variant='primary' className='mt-3'>Update Profile</Button>
                </Form>
            </Col>
            <Col md={8}>
                <h2>My Orders</h2>
                {loadingOrders ? (
                    <h3>Loading...</h3>
                ) : errorOrders ? (
                    <Message variant='danger'>{errorOrders}</Message>
                ) : (
                    <Table striped bordered hover responsive className='table-sm'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>DATE</th>
                                <th>TOTAL</th>
                                <th>PAID</th>
                                <th>DELIVERED</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order._id}>
                                    <td>{order._id}</td>
                                    <td>{order.createdAt.substring(0, 10)}</td>
                                    <td>${order.totalPrice}</td>
                                    <td>{order.isPaid ? order.paidAt.substring(0, 10) : <i className='fas fa-times' style={{ color: 'red' }}></i>}</td>
                                    <td>{order.isDelivered ? order.deliveredAt.substring(0, 10) : <i className='fas fa-times' style={{ color: 'red' }}></i>}</td>
                                    <td>
                                        <LinkContainer to={`/order/${order._id}`}>
                                            <Button className='btn-sm' variant='light'>Details</Button>
                                        </LinkContainer>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </Col>
        </Row>
    );
};

export default ProfileScreen;