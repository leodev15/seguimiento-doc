import { query } from '../db/db.js';  

export async function obtenerResumenPorExpediente(expediente) {
  const sql = `
    SELECT 
        r.nu_emi,
        dep_emisora.de_dependencia AS co_dep_emi_ref,
        dep_destino.de_dependencia AS ti_emi_des,
        u1.cdes_user AS co_emp_des,
        u2.cdes_user AS co_emp_emi,
        rem.fe_use_cre AS fecha,  
        (
            SELECT 
                 e.de_est
            FROM 
                idosgd.tdtr_estados e
            WHERE 
                e.co_est = rem.es_doc_emi
                AND e.de_tab = 'TDTV_REMITOS'
        ) AS estado_doc
    FROM "IDOSGD_GRA".idosgd.tdtx_remitos_resumen r
    LEFT JOIN "IDOSGD_GRA".idosgd.tdtv_remitos rem ON r.nu_emi = rem.nu_emi  
    LEFT JOIN "IDOSGD_GRA".idosgd.tdtv_destinos d ON r.nu_emi = d.nu_emi
    LEFT JOIN "IDOSGD_GRA".idosgd.seg_usuarios1 u1 ON d.co_emp_des = u1.cemp_codemp
    LEFT JOIN "IDOSGD_GRA".idosgd.seg_usuarios1 u2 ON r.co_emp_emi = u2.cemp_codemp
    LEFT JOIN "IDOSGD_GRA".idosgd.rhtm_dependencia dep_emisora 
      ON dep_emisora.co_dependencia = r.co_dep_emi_ref
    LEFT JOIN "IDOSGD_GRA".idosgd.rhtm_dependencia dep_destino 
      ON dep_destino.co_dependencia = r.ti_emi_des
    WHERE r.nu_expediente = $1
    `;

  try {
    const result = await query(sql, [expediente]); 
    return result; 
  } catch (error) {
    console.error('Error en el servicio de remitos:', error);
    throw new Error('Error en la base de datos');
  }
}
