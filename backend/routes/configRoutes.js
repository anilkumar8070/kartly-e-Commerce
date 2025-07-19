// backend/routes/configRoutes.js
import express from 'express';
const router = express.Router();

// @desc    Get Razorpay Key ID
// @route   GET /api/config/razorpay
// @access  Public
router.get('/razorpay', (req, res) => {
    res.send(process.env.RAZORPAY_KEY_ID);
});

export default router;