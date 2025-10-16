import express from 'express';
import { submitScreeningForm } from '../controllers/screeningController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/submit', protect, submitScreeningForm);

export default router;
