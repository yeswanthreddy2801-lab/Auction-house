import express from 'express';
import { register, login, getMe, logout, refreshToken } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validateRegister, validateLogin } from '../middleware/validator.js';

const router = express.Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.get('/logout', logout);
router.post('/refresh-token', refreshToken);
router.get('/me', protect, getMe);

export default router;
