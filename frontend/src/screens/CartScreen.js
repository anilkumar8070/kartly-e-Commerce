// src/screens/CartScreen.js
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ListGroup, Row, Col, Image, Form, Button, Card } from 'react-bootstrap';
import { CartContext } from '../context/CartContext';
import Message from '../components/Message'; // We'll create this simple component

const CartScreen = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useContext(CartContext);
  const { cartItems } = state;

  const removeFromCartHandler = (id) => {
    dispatch({ type: 'CART_REMOVE_ITEM', payload: id });
  };

  const checkoutHandler = () => {
    // Later, this will go to a shipping/payment page
    navigate('/shipping');
  };

  return (
    <Row>
      <Col md={8}>
        <h1>Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <Message>
            Your cart is empty <Link to='/'>Go Back</Link>
          </Message>
        ) : (
          <ListGroup variant='flush'>
            {cartItems.map((item) => (
              <ListGroup.Item key={item.product}>
                <Row className="align-items-center">
                  <Col md={2}>
                    <Image src={item.image} alt={item.name} fluid rounded />
                  </Col>
                  <Col md={3}>
                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                  </Col>
                  <Col md={2}>${item.price}</Col>
                  <Col md={2}>
                    {/* We'll add quantity change logic later */}
                    <Form.Control as='select' value={item.qty} disabled>
                        <option>{item.qty}</option>
                    </Form.Control>
                  </Col>
                  <Col md={2}>
                    {/* We'll add remove logic later */}
                    <Button type='button' variant='light' onClick={() => removeFromCartHandler(item.product)}>
                      <i className='fas fa-trash'></i>
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>
      <Col md={4}>
        <Card>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>
                Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
                items
              </h2>
              $
              {cartItems
                .reduce((acc, item) => acc + item.qty * item.price, 0)
                .toFixed(2)}
            </ListGroup.Item>
            <ListGroup.Item className="d-grid">
              <Button
                type='button'
                className='btn-block'
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
              >
                Proceed To Checkout
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
};

export default CartScreen;