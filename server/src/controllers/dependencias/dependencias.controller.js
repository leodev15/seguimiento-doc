import { obtenerDependencias } from "../../services/dependencias.services.js";

export const listarDependencias = async (req, res) => {
  try {
    const dependencias = await obtenerDependencias();
    res.json(dependencias);
  } catch (error) {
    console.error("Error al obtener las dependencias:", error);
    res.status(500).json({ error: "Error al obtener las dependencias" });
  }
};
