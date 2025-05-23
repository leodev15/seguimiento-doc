import { unionDocs} from "../../services/seguimiento_by_oficina.services.js";

export const listarSeguimientoByOficina = async (req, res) => {

  const { codigoDependencia, codigoPersonal, tipoDocumento, numeroDocumento} = req.params;

  try {
    if (!codigoDependencia || !codigoPersonal || !numeroDocumento ||  !tipoDocumento) {
      return res.status(400).json({ error: 'Faltan parámetros requeridos: dependencia, personal, tipo de documento o numero de documento.' });
    }

    const seguimiento = await unionDocs(codigoDependencia, codigoPersonal, tipoDocumento, numeroDocumento);

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