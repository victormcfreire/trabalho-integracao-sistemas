import express from 'express';
import { getTurnosColeta } from '../controllers/turnosColeta.controller.js';


const router = express.Router();

router.get('/turnos-coleta', getTurnosColeta);


export default router;