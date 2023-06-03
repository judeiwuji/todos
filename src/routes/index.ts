import { Router } from 'express';
import IndexController from '../controllers/IndexController';

const indexRoutes = Router();

indexRoutes.get('/', IndexController.getHomePage);
export default indexRoutes;
