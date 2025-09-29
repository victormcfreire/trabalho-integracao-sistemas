import express from 'express';
import { getClima } from '../controllers/clima.controller.js';


const router = express.Router();


router.get('/clima', getClima);


export default router;