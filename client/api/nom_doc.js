import axios from "axios";
import BASE_URL from "./config";

export const fetchTiposDocumento = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/tipos-doc`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener los tipos de documento:", error);
    throw error;
  }
};
