// frontend/src/components/Product.js

import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import Rating from './Rating';

const Product = ({ product }) => {
  return (
    // The main card structure
    <Card className='my-3 p-3 rounded h-100'>
      <Link to={`/product/${product._id}`}>
        {/* --- THIS IS THE NEW IMAGE CONTAINER --- */}
        <div className="product-image-wrapper">
          <Card.Img src={product.image} variant='top' className="product-image" />
        </div>
      </Link>

      <Card.Body className="d-flex flex-column">
        <Link to={`/product/${product._id}`}>
          <Card.Title as='div' className='product-title'>
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>

        {/* This div pushes the rating and price to the bottom */}
        <div className="mt-auto">
            <Card.Text as='div' className='my-2'>
              <Rating value={product.rating} text={`${product.numReviews} reviews`} />
            </Card.Text>

            <Card.Text as='h3'>
                ${product.price}
            </Card.Text>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Product;