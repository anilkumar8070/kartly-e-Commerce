// backend/routes/orderRoutes.js
import express from 'express';
const router = express.Router();
import {
    addOrderItems,
    getOrderById,
    getMyOrders,
    cancelOrder, // <-- IMPORT
    getSellerOrders,
    updateOrderToPaid,
} from '../controllers/orderController.js';
import { protect, seller } from '../middleware/authMiddleware.js';


router.route('/').post(protect, addOrderItems);
router.route('/myorders').get(protect, getMyOrders);
router.route('/seller').get(protect, seller, getSellerOrders); // <-- ADD ROUTE
router.route('/:id').get(protect, getOrderById);
router.route('/:id/cancel').put(protect, cancelOrder);
router.route('/:id/pay').put(protect, updateOrderToPaid); 
export default router;