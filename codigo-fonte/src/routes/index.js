import express from 'express';
import pontosRoutes from './pontosColeta.routes.js';
import turnosRoutes from './turnosColeta.routes.js';
import climaRoutes from './clima.routes.js';
import qualidadeArRoutes from './qualidadeAr.routes.js';
import authRoutes from './auth.routes.js';


const router = express.Router();


router.use('/', pontosRoutes);
router.use('/', turnosRoutes);
router.use('/', climaRoutes);
router.use('/', qualidadeArRoutes);
router.use('/', authRoutes);


export default router;