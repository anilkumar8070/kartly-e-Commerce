import path from 'path';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import configRoutes from './routes/configRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

// Initialize Express app
const app = express();

// Enable CORS
app.use(cors());

// Body parser middleware to accept JSON data
app.use(express.json());

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/config', configRoutes);


// --- Static Folder Configuration ---
// This is needed to replicate the __dirname functionality in ES Modules
const __dirname = path.resolve(); 

// Make the 'uploads' folder accessible publicly
// Any request to '/uploads' will serve files from the '/uploads' directory
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));


// --- DEPLOYMENT CONFIGURATION ---
// This block of code will only run when the application is in production mode
if (process.env.NODE_ENV === 'production') {
    // Set the frontend/build folder as the static folder
    app.use(express.static(path.join(__dirname, '/frontend/build')));

    // For any route that is not one of our API routes,
    // we will serve the main index.html file from the frontend build folder.
    // This allows React Router to handle the client-side routing.
    app.get('*', (req, res) =>
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
    );
} else {
    // In development mode, we can have a simple root route for testing the API
    app.get('/', (req, res) => {
        res.send('Welcome to the Kartly API! (Development Mode)');
    });
}
// --- END DEPLOYMENT CONFIGURATION ---


// Custom Error Handling Middleware (must be last)
app.use(notFound);
app.use(errorHandler);

// Define the port the server will run on
const PORT = process.env.PORT || 5001;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});