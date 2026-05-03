import express from 'express';
import {
    getSellerRequests,
    approveSeller,
    rejectSeller
} from '../controllers/sellerController.js';
import {
    getUsers,
    toggleBlockUser,
    approveProduct,
    getStats
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/users', getUsers);
router.patch('/toggle-block/:id', toggleBlockUser);
router.get('/seller-requests', getSellerRequests);
router.patch('/approve-seller/:id', approveSeller);
router.patch('/reject-seller/:id', rejectSeller);
router.patch('/approve-product/:id', approveProduct);
router.get('/stats', getStats);

export default router;
