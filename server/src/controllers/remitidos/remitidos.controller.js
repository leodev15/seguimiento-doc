import { obtenerResumenPorExpediente } from '../../services/remitidos.services.js';

export async function getResumenPorExpediente(req, res) {
  const { sanitizedExpediente } = req;

  try {
    const resumen = await obtenerResumenPorExpediente(sanitizedExpediente);
    res.status(200).json(resumen);
  } catch (err) {
    console.error('Error al obtener resumen:', err);
    res.status(500).json({ error: 'Error al obtener resumen de remitos' });
  }
}
