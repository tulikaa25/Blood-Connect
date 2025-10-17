import express from 'express';
import {getSlots} from '../controllers/appointmentController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/slots', protect, getSlots);  // protect middleware ensures req.user is available

export default router;
