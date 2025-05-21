import axios from "axios";
import BASE_URL from "./config";

export const fetchDependencias = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/dependencias`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener las dependencais:", error);
    throw error;
  }
};
