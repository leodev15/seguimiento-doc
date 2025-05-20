import { obtenerTiposDocumento } from "../../services/tipos_documentos.services.js";

export const listarTiposDocumento = async (req, res) => {
  try {
    const tipos = await obtenerTiposDocumento();
    res.json(tipos);
  } catch (error) {
    console.error("Error al obtener tipos de documento:", error);
    res.status(500).json({ error: "Error al obtener tipos de documento" });
  }
};
