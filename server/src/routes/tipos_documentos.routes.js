import express from "express";
import { listarTiposDocumento } from "../controllers/tipos_docs/tipos_docmuentos.controller.js";
import { ddosProtection } from "../middleware/SecuriyDDoS.js";

const router = express.Router();

router.get("/tipos-doc", ddosProtection, listarTiposDocumento);

export default router;