import express from 'express';
import { getResumenPorExpediente } from '../controllers/remitidos/remitidos.controller.js';
import { validateExpediente } from '../middleware/remitidos/remitidios.middleware.js';

const router = express.Router();

router.get('/remitos/resumen/:expediente', validateExpediente, getResumenPorExpediente);

export default router;
