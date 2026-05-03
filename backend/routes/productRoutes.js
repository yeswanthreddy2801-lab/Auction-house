import express from 'express';
import {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    placeBid,
    getHomeProducts
} from '../controllers/productController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validateProduct } from '../middleware/validator.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.get('/home', getHomeProducts);
router.get('/', getProducts);
router.get('/:id', getProduct);

router.post('/', protect, authorize('seller', 'admin'), upload.array('images', 5), validateProduct, createProduct);
router.put('/:id', protect, authorize('seller', 'admin'), upload.array('images', 5), updateProduct);
router.delete('/:id', protect, authorize('seller', 'admin'), deleteProduct);
router.post('/:id/bid', protect, placeBid);

export default router;
