import express from "express";
import { listarSeguimiento } from "../controllers/seguimiento_NumDoc/seguimiento_numDoc.controller.js";
import { validarSeguimientoParams } from "../middleware/seguimientoNumDoc/seguimiento_NumDoc.middleware.js"; 
import { ddosProtection } from "../middleware/SecuriyDDoS.js"; 

const router = express.Router();

router.get(
    "/seguimiento/:numeroDocumento/:usuario/:tipoDocumento",
    ddosProtection, 
    validarSeguimientoParams, 
    listarSeguimiento 
);

export default router;