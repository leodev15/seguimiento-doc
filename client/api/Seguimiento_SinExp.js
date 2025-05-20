import axios from 'axios';
import BASE_URL from "./config";

export const fetchResumenSinExpediente = async (dni, tipoDoc, numDoc) => {
  try {
    if (!dni || !tipoDoc || !numDoc) {
      throw new Error('Faltan parámetros requeridos: DNI, tipo de documento o número de documento.');
    }

    const response = await axios.get(`${BASE_URL}/seguimiento/${numDoc}/${dni}/${tipoDoc}`);
    const data = response.data;

    if (!data.documentos || data.documentos.length === 0) {
      throw new Error('Documento no encontrado.');
    }

    return {
      numeroExpediente: data.expediente,
      listaDocumentos: data.documentos
    };
  } catch (error) {
    let errorMessage = 'Error al obtener el resumen';
    if (error.response?.status === 400) {
      errorMessage = error.response.data.error || 'Parámetros inválidos proporcionados.';
    } else if (error.response?.status === 404) {
      errorMessage = error.response.data.error || 'No se encontraron datos para los parámetros proporcionados.';
    } else if (error.response?.status === 500) {
      errorMessage = error.response.data.error || 'Error interno del servidor.';
    } else {
      errorMessage = error.message || 'Error desconocido';
    }
    throw new Error(errorMessage);
  }
};