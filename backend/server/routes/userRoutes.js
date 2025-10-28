// view/search/filter donors (admin only)
import express from 'express';
import { getDonors } from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();


// @route   GET /api/users
// @access  Private/Admin
router.get('/', protect, admin, getDonors);

export default router
