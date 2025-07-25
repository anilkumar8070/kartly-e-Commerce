// backend/models/productModel.js
import mongoose from 'mongoose';

const productSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    name: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    brand: { type: String, required: true },
    // --- CATEGORY MODIFICATION ---
    category: {
      type: String,
      required: true,
      enum: ['Electronics', 'Wearable', 'Clothes', 'Books', 'Home', 'Other'], // Only these values are allowed
    },
    price: { type: Number, required: true, default: 0 },
    countInStock: { type: Number, required: true, default: 0 },
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);

export default Product;