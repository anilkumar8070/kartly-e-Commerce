// backend/routes/userRoutes.js

import express from 'express';
const router = express.Router();
import {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile, // <-- IMPORT
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js'; // <-- IMPORT

router.post('/login', authUser);
router.route('/').post(registerUser);

// Add the protected profile route
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

export default router;