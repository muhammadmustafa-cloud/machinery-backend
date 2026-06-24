import express from 'express';
import { signIn, registerUser, signOut } from '../controllers/authController.js';

const router = express.Router();

router.post('/signin', signIn);
router.post('/register', registerUser);
router.post('/signout', signOut);

export default router;
