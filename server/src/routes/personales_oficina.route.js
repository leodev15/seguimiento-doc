import express from "express";
import { ddosProtection } from "../middleware/SecuriyDDoS.js";
import { listarPersonalByOficina } from "../controllers/personal/personal-oficina.controller.js";

const router = express.Router();

router.get("/personales-ofic/:codigo", ddosProtection, listarPersonalByOficina);

export default router;