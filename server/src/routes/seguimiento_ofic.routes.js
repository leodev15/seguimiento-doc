import express from "express";
import { ddosProtection } from "../middleware/SecuriyDDoS.js"; 
import { listarSeguimientoByOficina } from "../controllers/seguimiento_oficina/seguimiento_oficina.controller.js";
import { validarSeguimientoByOficinaParams } from "../middleware/seguimientoOfic/seguimiento_oficina.middleware.js";

const router = express.Router();

router.get(
    "/seguimiento/oficina/:codigoDependencia/:codigoPersonal/:tipoDocumento/:numeroDocumento",
    ddosProtection, 
    validarSeguimientoByOficinaParams, 
    listarSeguimientoByOficina 
);

export default router;