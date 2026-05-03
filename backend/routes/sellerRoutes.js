import express from 'express';
import { requestSellerStatus } from '../controllers/sellerController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/request', protect, requestSellerStatus);

export default router;
