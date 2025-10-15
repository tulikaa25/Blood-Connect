import express from 'express';
import {
    getAvailableSlots,
    bookAppointment,
    getMyAppointments,
    getAllAppointments,
    updateAppointmentStatus,
} from '../controllers/appointmentController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/slots', getAvailableSlots);
router.post('/book', protect, bookAppointment);
router.get('/my', protect, getMyAppointments);
router.get('/all', protect, admin, getAllAppointments);
router.put('/:id/status', protect, admin, updateAppointmentStatus);

export default router;
