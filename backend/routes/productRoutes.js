// backend/routes/productRoutes.js

import express from 'express';
const router = express.Router();
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct, // <-- IMPORT
  deleteProduct, 
} from '../controllers/productController.js';
import { protect, seller } from '../middleware/authMiddleware.js';

router.route('/').get(getProducts).post(protect, seller, createProduct);

// Add the PUT route for updating
router
  .route('/:id')
  .get(getProductById)
  .put(protect, seller, updateProduct) // <-- ADDED
  .delete(protect, seller, deleteProduct);

export default router;