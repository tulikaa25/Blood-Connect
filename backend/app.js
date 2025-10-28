import express from 'express';
import authRoutes from './server/routes/authRoutes.js';
import appointmentRoutes from './server/routes/appointmentRoutes.js';
import screeningRoutes from './server/routes/screeningRoutes.js';
import settingsRoutes from './server/routes/settingsRoutes.js';
import userRoutes from './server/routes/userRoutes.js';

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
app.use('/api/screening', screeningRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/users', userRoutes);

export default app;
