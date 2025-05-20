import 'dotenv/config';
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Rutas de la API
import remitoRoutes from "./routes/remitido.route.js";
import tiposDocumentosRoutes from "./routes/tipos_documentos.routes.js";
import seguimientoRoutes from "./routes/seguimiento_numDoc.routes.js";

// Middleware y seguridad
import { ddosProtection } from "./middleware/SecuriyDDoS.js";
import { query } from "./db/db.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use(ddosProtection);

// Rutas API
app.get("/api/db-test", async (req, res) => {
  try {
    const result = await query('SELECT NOW()');
    res.json({ success: true, time: result[0].now });
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
    res.status(500).json({ success: false, error: "Error conectando a la base de datos" });
  }
});

// Rutas de la API (IMPORTANTE: estas deben estar antes del catch-all)
app.use("/api", remitoRoutes);  
app.use("/api", tiposDocumentosRoutes);  
app.use("/api", seguimientoRoutes);  

const distPath = path.join(__dirname, "../../client/dist");
console.log("Ruta distPath:", distPath); 
app.use(express.static(distPath));

app.get(/(.*)/, (req, res) => {
  console.log("Intentando enviar archivo desde:", path.join(distPath, "index.html"));
  res.sendFile(path.join(distPath, "index.html"));
});

// Servidor
const PORT = 3001;
app.listen(PORT, '0.0.0.0',() => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
