import { Router } from 'express';
import { login } from './login.js';
const adminRoutes = Router();

adminRoutes.post('/login', login);

export default adminRoutes;
