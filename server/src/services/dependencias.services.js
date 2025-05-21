import { query } from '../db/db.js';  

export const obtenerDependencias = async () => {
  const queryStr = `
      SELECT rd.co_dependencia as codigo , concat( rd.de_corta_depen,'-',rd.titulo_dep) as dependencia FROM idosgd.rhtm_dependencia rd WHERE in_baja='0' ORDER BY rd.titulo_dep ASC ;
  `;
  try {
    const result = await query(queryStr);
    return result; 
  } catch (error) {
    console.error("Error al obtener las dependencias:", error);
    throw new Error("Error al obtener las dependencias");
  }
};
