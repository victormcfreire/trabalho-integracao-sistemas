import express from "express";
import { getPontosColeta } from "../controllers/pontosColeta.controller.js";

const router = express.Router();

router.get("/pontos-coleta", getPontosColeta);

export default router;
