// src/screens/ProductScreen.js (updated)

import React, { useState, useEffect, useContext } from 'react'; // import useContext
import { Link, useParams, useNavigate } from 'react-router-dom'; // import useNavigate
import { Row, Col, Image, ListGroup, Card, Button, Form } from 'react-bootstrap'; // import Form
import axios from 'axios';
import Rating from '../components/Rating';
import { CartContext } from '../context/CartContext'; // <-- IMPORT CART CONTEXT

const ProductScreen = () => {
  const [product, setProduct] = useState({});
  const [qty, setQty] = useState(1); // <-- ADD QTY STATE, default to 1

  const { id: productId } = useParams();
  const navigate = useNavigate(); // <-- INITIALIZE NAVIGATE

  const { dispatch } = useContext(CartContext); // <-- GET DISPATCH FROM CONTEXT

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await axios.get(`/api/products/${productId}`);
      setProduct(data);
    };
    fetchProduct();
  }, [productId]);

  // Handler for the add to cart button
  const addToCartHandler = () => {
    dispatch({
      type: 'CART_ADD_ITEM',
      payload: {
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        countInStock: product.countInStock,
        qty,
      },
    });
    navigate('/cart'); // Redirect to cart page
  };

  return (
    <>
      <Link className='btn btn-light my-3' to='/'>
        Go Back
      </Link>
      <Row>
        {/* ... The first two columns are unchanged ... */}
        <Col md={5}>
            <Image src={product.image} alt={product.name} fluid />
        </Col>
        <Col md={4}>
            <ListGroup variant='flush'>
                <ListGroup.Item><h3>{product.name}</h3></ListGroup.Item>
                <ListGroup.Item><Rating value={product.rating} text={`${product.numReviews} reviews`} /></ListGroup.Item>
                <ListGroup.Item>Price: ${product.price}</ListGroup.Item>
                <ListGroup.Item>Description: {product.description}</ListGroup.Item>
            </ListGroup>
        </Col>
        <Col md={3}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <Row>
                  <Col>Price:</Col>
                  <Col><strong>${product.price}</strong></Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Status:</Col>
                  <Col>{product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}</Col>
                </Row>
              </ListGroup.Item>

              {/*  ADD QUANTITY SELECTOR IF ITEM IS IN STOCK */}
              {product.countInStock > 0 && (
                <ListGroup.Item>
                  <Row>
                    <Col>Qty</Col>
                    <Col>
                      <Form.Control
                        as='select'
                        value={qty}
                        onChange={(e) => setQty(Number(e.target.value))}
                      >
                        {[...Array(product.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </Form.Control>
                    </Col>
                  </Row>
                </ListGroup.Item>
              )}

              <ListGroup.Item className='d-grid'>
                <Button
                  onClick={addToCartHandler} // <-- ADD ONCLICK HANDLER
                  className='btn-block'
                  type='button'
                  disabled={product.countInStock === 0}
                >
                  Add To Cart
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ProductScreen;