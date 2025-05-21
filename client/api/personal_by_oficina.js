import axios from "axios";
import BASE_URL from "./config";

export const fetchPersonalByOficina = async (codigo) => {
  try {

    if (!codigo) {
      throw new Error('Falta codigo de la dependencia.');
    }

    const response = await axios.get(`${BASE_URL}/personales-ofic/${codigo}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener el resumen:", error);
    throw error;
  }
};
