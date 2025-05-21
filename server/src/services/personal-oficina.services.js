import { query } from '../db/db.js';

export const getPersonalByOficina = async (codigo) => {
  const queryStr = `
  SELECT  concat(cemp_denom,' ',cemp_apepat, ' ',cemp_apemat) as personal, cemp_codemp as codigo from idosgd.rhtm_per_empleados rpe WHERE  rpe.co_dependencia = $1 AND rpe.cemp_indbaj ='1' ORDER BY rpe.cemp_denom;
  `;
  try {
    const result = await query(queryStr,[codigo]);
    return result;
  } catch (error) {
    console.error("Error al obtener los personales de oficina:", error);
    throw new Error("Error al obtener los personales de oficina");
  }
};
