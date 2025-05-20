// middleware/validarSeguimientoParams.js
export function validarSeguimientoParams(req, res, next) {
  const { numeroDocumento, usuario, tipoDocumento } = req.params;

  if (!numeroDocumento) {
    return res.status(400).json({ error: 'Falta el parámetro "numeroDocumento".' });
  }

  if (!usuario) {
    return res.status(400).json({ error: 'Falta el parámetro "usuario".' });
  }

  if (!tipoDocumento) {
    return res.status(400).json({ error: 'Falta el parámetro "tipoDocumento".' });
  }

  req.sanitizedParams = {
    numeroDocumento: numeroDocumento.trim(),
    usuario: usuario.trim(),
    tipoDocumento: tipoDocumento.trim(),
  };

  next();
}