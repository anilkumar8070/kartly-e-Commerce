// frontend/src/screens/HomeScreen.js

import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import axios from 'axios';
import { Row, Col } from 'react-bootstrap';
import Product from '../components/Product';
import Message from '../components/Message';
import CategoryMenu from '../components/CategoryMenu';
import Loader from '../components/Loader';

const HomeScreen = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('');
    
    const categories = ['Electronics', 'Wearable', 'Clothes', 'Books', 'Home', 'Other'];
    const productsRowRef = useRef(null); // Create a ref to attach to our products row

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get('/api/products');
                setProducts(data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const filteredProducts = selectedCategory
        ? products.filter((product) => product.category === selectedCategory)
        : products;

    // --- THIS IS THE JAVASCRIPT FIX ---
    useLayoutEffect(() => {
        // This function will run after the component renders AND after filteredProducts changes
        const equalizeTitleHeights = () => {
            if (productsRowRef.current && filteredProducts.length > 0) {
                const titleElements = productsRowRef.current.querySelectorAll('.product-title');
                
                if (titleElements.length === 0) return;

                // First, reset all heights to auto to measure their natural height
                titleElements.forEach(title => {
                    title.style.height = 'auto';
                });

                // Then, find the maximum height
                let maxHeight = 0;
                titleElements.forEach(title => {
                    if (title.offsetHeight > maxHeight) {
                        maxHeight = title.offsetHeight;
                    }
                });
                
                // Finally, set all titles to the maximum height
                titleElements.forEach(title => {
                    // We add a little extra padding at the bottom for spacing
                    title.style.height = `${maxHeight + 10}px`; 
                });
            }
        };

        // Run the function. A small timeout can help ensure all images are loaded.
        const timer = setTimeout(equalizeTitleHeights, 100);

        // Add a resize listener to re-calculate on window resize
        window.addEventListener('resize', equalizeTitleHeights);
        
        // Cleanup function to remove the listener when the component unmounts
        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', equalizeTitleHeights);
        };

    }, [filteredProducts, loading]); // Rerun this effect when the list of products changes or loading finishes

    return (
        <>
            <CategoryMenu categories={categories} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
            <h1>Latest Products</h1>

            {loading ? (
                <Loader />
            ) : error ? (
                <Message variant='danger'>{error}</Message>
            ) : (
                // Attach the ref to the <Row> so we can query its children
                <Row ref={productsRowRef}>
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                            <Col key={product._id} sm={12} md={6} lg={4} xl={3} className="mb-4">
                                <Product product={product} />
                            </Col>
                        ))
                    ) : (
                        <Message variant="info">No products found in this category.</Message>
                    )}
                </Row>
            )}
        </>
    );
};

export default HomeScreen;