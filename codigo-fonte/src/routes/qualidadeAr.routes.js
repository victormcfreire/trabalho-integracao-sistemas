import express from 'express';
import { getQualidadeAr } from '../controllers/qualidadeAr.controller.js';


const router = express.Router();

router.get('/qualidade-ar', getQualidadeAr);


export default router;