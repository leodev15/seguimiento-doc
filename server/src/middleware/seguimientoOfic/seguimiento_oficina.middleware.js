// middleware/validarSeguimientoParams.js
export function validarSeguimientoByOficinaParams(req, res, next) {
  const { codigoDependencia, codigoPersonal, tipoDocumento, numeroDocumento} = req.params;

  if (!codigoDependencia) {
    return res.status(400).json({ error: 'Falta el parámetro "codigoDependencia".' });
  }

  if (!codigoPersonal) {
    return res.status(400).json({ error: 'Falta el parámetro "codigoPersonal".' });
  }

  if (!tipoDocumento) {
    return res.status(400).json({ error: 'Falta el parámetro "tipoDocumento".' });
  }
  if (!numeroDocumento) {
    return res.status(400).json({ error: 'Falta el parámetro "numeroDocumento".' });
  }

  req.sanitizedParams = {
      codigoDependencia: codigoDependencia.trim(),
      codigoPersonal: codigoPersonal.trim(),
      tipoDocumento: tipoDocumento.trim(),
      numeroDocumento: numeroDocumento.trim(),
  };

  next();
}