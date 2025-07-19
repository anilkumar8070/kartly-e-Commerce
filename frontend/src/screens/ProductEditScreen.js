import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Image } from 'react-bootstrap';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import FormContainer from '../components/FormContainer';
import Message from '../components/Message';

const ProductEditScreen = () => {
    const { id: productId } = useParams();
    const navigate = useNavigate();

    // State for all product fields
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState('');
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState(0);
    const [description, setDescription] = useState('');
    
    // State for the upload process
    const [uploading, setUploading] = useState(false);

    // State for page loading and errors
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { state: authState } = useContext(AuthContext);
    const { userInfo } = authState;

    // Define the fixed list of categories
    const categories = ['Electronics', 'Wearable', 'Clothes', 'Books', 'Home', 'Other'];

    useEffect(() => {
        // Redirect if not a logged-in seller
        if (!userInfo || !userInfo.isSeller) {
            navigate('/login');
            return;
        }
        
        // Function to fetch the product details
        const fetchProductDetails = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get(`/api/products/${productId}`);
                setName(data.name);
                setPrice(data.price);
                setImage(data.image);
                setBrand(data.brand);
                setCategory(data.category);
                setCountInStock(data.countInStock);
                setDescription(data.description);
                setLoading(false);
            } catch (error) {
                setError(error.response?.data?.message || error.message);
                setLoading(false);
            }
        };
        fetchProductDetails();
    }, [productId, navigate, userInfo]);

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            const { data } = await axios.post('/api/upload', formData, config);
            setImage(data.image); 
            setUploading(false);
        } catch (error) {
            console.error('Image upload failed:', error);
            setUploading(false);
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const config = {
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` },
            };
            await axios.put(
                `/api/products/${productId}`,
                { 
                    name, 
                    price, 
                    image, 
                    brand, 
                    category, 
                    countInStock, 
                    description 
                },
                config
            );
            setLoading(false);
            navigate('/seller/productlist');
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            setLoading(false);
        }
    };

    return (
        <>
            <Link to='/seller/productlist' className='btn btn-light my-3'>
                Go Back
            </Link>
            <FormContainer>
                <h1>Edit Product</h1>
                {loading && <h3>Loading...</h3>}
                {error && <Message variant='danger'>{error}</Message>}
                <Form onSubmit={submitHandler}>
                    <Form.Group controlId='name' className='mb-3'>
                        <Form.Label>Name</Form.Label>
                        <Form.Control type='text' placeholder='Enter name' value={name} onChange={(e) => setName(e.target.value)}></Form.Control>
                    </Form.Group>

                    <Form.Group controlId='price' className='mb-3'>
                        <Form.Label>Price</Form.Label>
                        <Form.Control type='number' placeholder='Enter price' value={price} onChange={(e) => setPrice(e.target.value)}></Form.Control>
                    </Form.Group>

                    <Form.Group controlId='image' className='mb-3'>
                        <Form.Label>Image</Form.Label>
                        {image && <Image src={image} alt={name} fluid thumbnail className="mb-2" style={{maxHeight: '150px'}} />}
                        <Form.Control type="file" label="Choose New File" onChange={uploadFileHandler} />
                        {uploading && <h3>Uploading...</h3>}
                    </Form.Group>
                    
                    <Form.Group controlId='brand' className='mb-3'>
                        <Form.Label>Brand</Form.Label>
                        <Form.Control type='text' placeholder='Enter brand' value={brand} onChange={(e) => setBrand(e.target.value)}></Form.Control>
                    </Form.Group>

                    <Form.Group controlId='countInStock' className='mb-3'>
                        <Form.Label>Count In Stock</Form.Label>
                        <Form.Control type='number' placeholder='Enter count in stock' value={countInStock} onChange={(e) => setCountInStock(e.target.value)}></Form.Control>
                    </Form.Group>

                    <Form.Group controlId='category' className='mb-3'>
                        <Form.Label>Category</Form.Label>
                        <Form.Select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="">Select Category</option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group controlId='description' className='mb-3'>
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" rows={3} placeholder='Enter description' value={description} onChange={(e) => setDescription(e.target.value)}></Form.Control>
                    </Form.Group>

                    <Button type='submit' variant='primary' className='mt-3' disabled={loading || uploading}>
                        Update
                    </Button>
                </Form>
            </FormContainer>
        </>
    );
};

export default ProductEditScreen;