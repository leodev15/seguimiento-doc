export function validateExpediente(req, res, next) {
    const { expediente } = req.params;

    if (!expediente) {
        return res.status(400).json({ error: 'Falta el parámetro "expediente"' });
    }

    const sanitizedExpediente = expediente.trim();
    if (!/^[A-Za-z0-9\-]+$/.test(sanitizedExpediente)) {
        return res
        .status(400)
        .json({ error: "El expediente contiene caracteres no válidos" });
    }

    req.sanitizedExpediente = sanitizedExpediente;
    next();
}
