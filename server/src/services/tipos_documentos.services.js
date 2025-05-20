import { query } from '../db/db.js';  

export const obtenerTiposDocumento = async () => {
  const queryStr = `
  SELECT cdoc_desdoc, cdoc_tipdoc 
      FROM idosgd.si_mae_tipo_doc
      ORDER BY cdoc_desdoc ASC
  `;
  try {
    const result = await query(queryStr);
    return result; 
  } catch (error) {
    console.error("Error al obtener tipos de documentos:", error);
    throw new Error("Error al obtener los tipos de documentos");
  }
};
