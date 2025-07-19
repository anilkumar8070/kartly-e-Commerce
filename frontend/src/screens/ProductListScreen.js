// src/screens/ProductListScreen.js
import React, { useEffect, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const ProductListScreen = () => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();
    const { state: authState } = useContext(AuthContext);
    const { userInfo } = authState;

    const fetchProducts = async () => {
        try {
            const { data } = await axios.get('/api/products');
            const sellerProducts = data.filter(p => p.user === userInfo._id);
            setProducts(sellerProducts);
        } catch (error) {
            console.error('Could not fetch products', error);
        }
    };

    useEffect(() => {
        if (!userInfo || !userInfo.isSeller) {
            navigate('/login');
        } else {
            fetchProducts();
        }
    // eslint-disable-next-line
    }, [navigate, userInfo]);

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                };
                await axios.delete(`/api/products/${id}`, config);
                // Refetch products after deletion
                fetchProducts();
            } catch (error) {
                console.error('Could not delete product', error);
                alert('Product could not be deleted.');
            }
        }
    };

    const createProductHandler = async () => {
    if (window.confirm('Are you sure you want to create a new product?')) {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            const { data } = await axios.post('/api/products', {}, config);
            navigate(`/seller/product/${data._id}/edit`);
        } catch (error) {
            console.error('Could not create product', error); // This is where the error is likely happening
        }
    }
};

    return (
        <>
            <Row className='align-items-center'>
                <Col><h1>My Products</h1></Col>
                <Col className='text-end'>
                    <Button className='my-3' onClick={createProductHandler}>
                        <i className='fas fa-plus'></i> Create Product
                    </Button>
                </Col>
            </Row>
            <Table striped bordered hover responsive className='table-sm'>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>NAME</th>
                        <th>PRICE</th>
                        <th>CATEGORY</th>
                        <th>BRAND</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product._id}>
                            <td>{product._id}</td>
                            <td>{product.name}</td>
                            <td>${product.price}</td>
                            <td>{product.category}</td>
                            <td>{product.brand}</td>
                            <td>
                                <LinkContainer to={`/seller/product/${product._id}/edit`}>
                                    <Button variant='light' className='btn-sm mx-2'>
                                        <i className='fas fa-edit'></i>
                                    </Button>
                                </LinkContainer>
                                {/* --- DELETE BUTTON --- */}
                                <Button
                                    variant='danger'
                                    className='btn-sm'
                                    onClick={() => deleteHandler(product._id)}
                                >
                                    <i className='fas fa-trash'></i>
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    );
};

export default ProductListScreen;