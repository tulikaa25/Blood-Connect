import express from 'express';
import { registerUser, loginUser, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', registerUser);

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', loginUser);

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, getMe);

export default router;
