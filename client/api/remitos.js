import axios from "axios";
import BASE_URL from "./config";

export const fetchResumenPorExpediente = async (expediente) => {
  try {
    const response = await axios.get(`${BASE_URL}/remitos/resumen/${expediente}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener el resumen:", error);
    throw error;
  }
};
