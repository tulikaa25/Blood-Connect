import express from 'express';
import authRoutes from './server/routes/authRoutes.js';
import appointmentRoutes from './server/routes/appointmentRoutes.js';

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Define a basic route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Mount the authentication routes
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);

export default app;
