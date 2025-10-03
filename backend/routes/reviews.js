import express from 'express';
import authMiddleware from '../middleware/auth.js';
import {
  createReview,
  updateReview,
  deleteReview,
  getUserReviews
} from '../controllers/reviewController.js';

const router = express.Router();

router.post('/', authMiddleware, createReview);
router.put('/:id', authMiddleware, updateReview);
router.delete('/:id', authMiddleware, deleteReview);
router.get('/user/:userId', getUserReviews);

export default router;
