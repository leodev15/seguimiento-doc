import { getPersonalByOficina } from "../../services/personal-oficina.services.js";

export const listarPersonalByOficina = async (req, res) => {
  const {codigo} = req.params;

  try {
    const personales = await getPersonalByOficina(codigo);
    res.json(personales);
  } catch (error) {
    console.error("Error al obtener los personales de la oficina:", error);
    res.status(500).json({ error: "Error al obtener los personales de la oficina" });
  }
};