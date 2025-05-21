import express from "express";
import { listarTiposDocumento } from "../controllers/tipos_docs/tipos_docmuentos.controller.js";
import { ddosProtection } from "../middleware/SecuriyDDoS.js";
import { listarDependencias } from "../controllers/dependencias/dependencias.controller.js";

const router = express.Router();

router.get("/dependencias", ddosProtection, listarDependencias);

export default router;