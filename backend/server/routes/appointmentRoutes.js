import express from 'express';
import { getSlots, bookAppointment } from '../controllers/appointmentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get slots (accessible by both users and admin)
router.get('/slots', protect, getSlots);

// Book appointment (only logged-in users)
router.post('/book', protect, bookAppointment);

export default router;
