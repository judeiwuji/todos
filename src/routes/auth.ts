import { Router } from 'express';
import AuthController from '../controllers/AuthController';

const authRoutes = Router();
authRoutes.get('/login', AuthController.getLoginPage);
authRoutes.get('/login/auth/ssmsa', AuthController.getAuthLoginPage);
authRoutes.get('/login/auth/', AuthController.login);
authRoutes.post('/logout', AuthController.logout);
export default authRoutes;
