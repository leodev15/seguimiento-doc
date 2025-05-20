import { unionDoc } from '../../services/seguimiento_NumDoc.services.js';

export const listarSeguimiento = async (req, res) => {
  const { numeroDocumento, usuario, tipoDocumento } = req.params;

  try {
    if (!numeroDocumento || !usuario || !tipoDocumento) {
      return res.status(400).json({ error: 'Faltan parámetros requeridos: número de documento, usuario o tipo de documento.' });
    }

    const seguimiento = await unionDoc(numeroDocumento, usuario, tipoDocumento);

    if (Array.isArray(seguimiento)) {
      return res.status(200).json({
        expediente: null,
        documentos: seguimiento
      });
    }
    return res.status(200).json(seguimiento);
  } catch (error) {
    console.error('Error en listarSeguimiento:', error.message, error.stack);
    if (error.message.includes('No se pudo obtener el número de expediente')) {
      return res.status(404).json({ error: 'No se encontró el expediente para los parámetros proporcionados.' });
    }
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};