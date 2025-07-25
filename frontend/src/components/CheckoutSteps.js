// src/components/CheckoutSteps.js
import React from 'react';
import { Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

// The new flow has only 3 steps we care about showing
const CheckoutSteps = ({ step1, step2, step3 }) => {
  return (
    <Nav className='justify-content-center mb-4'>
      <Nav.Item>
        {step1 ? (<LinkContainer to='/login'><Nav.Link>Sign In</Nav.Link></LinkContainer>) : (<Nav.Link disabled>Sign In</Nav.Link>)}
      </Nav.Item>
      <Nav.Item>
        {step2 ? (<LinkContainer to='/shipping'><Nav.Link>Shipping</Nav.Link></LinkContainer>) : (<Nav.Link disabled>Shipping</Nav.Link>)}
      </Nav.Item>
      {/* Step 3 is now "Place Order" */}
      <Nav.Item>
        {step3 ? (<LinkContainer to='/placeorder'><Nav.Link>Place Order</Nav.Link></LinkContainer>) : (<Nav.Link disabled>Place Order</Nav.Link>)}
      </Nav.Item>
    </Nav>
  );
};

export default CheckoutSteps;