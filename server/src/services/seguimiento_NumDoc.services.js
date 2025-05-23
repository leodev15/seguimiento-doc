import { query } from "../db/db.js";

export async function obtenerResumenPorExpediente(nuDocEmi, coUseCre, coTipDocAdm) {
  const sql = `SELECT 
    rem.nu_emi,
    rem.co_dep_emi,
    dep_emi.de_dependencia AS oficina_remitente,
    CONCAT(emp_emi.cemp_apepat, ' ', emp_emi.cemp_apemat, ' ', emp_emi.cemp_denom) AS empleado_remitente,
    rem.fe_emi AS fecha_emision,
    est_emi.de_est AS estado_emisor,
    des.co_dep_des,
    dep_des.de_dependencia AS oficina_destino,
    CONCAT(emp_des.cemp_apepat, ' ', emp_des.cemp_apemat, ' ', emp_des.cemp_denom) AS empleado_destinatario,
    des.fe_rec_doc AS fecha_recepcion,
    est_dest.de_est AS estado_destino,
    rem.nu_doc_emi,
    doc.cdoc_desdoc AS tipo_documento
FROM 
    idosgd.tdtv_remitos rem
INNER JOIN 
    idosgd.tdtv_destinos des ON rem.nu_emi = des.nu_emi
INNER JOIN 
    idosgd.rhtm_per_empleados emp_emi ON rem.co_emp_emi = emp_emi.cemp_codemp
INNER JOIN 
    idosgd.rhtm_dependencia dep_emi ON rem.co_dep_emi = dep_emi.co_dependencia
INNER JOIN 
    idosgd.si_mae_tipo_doc doc ON rem.co_tip_doc_adm = doc.cdoc_tipdoc
INNER JOIN 
    idosgd.tdtr_estados est_emi ON est_emi.co_est = rem.es_doc_emi AND est_emi.de_tab = 'TDTV_REMITOS'
LEFT JOIN 
    idosgd.rhtm_per_empleados emp_des ON des.co_emp_des = emp_des.cemp_codemp
LEFT JOIN 
    idosgd.rhtm_dependencia dep_des ON des.co_dep_des = dep_des.co_dependencia
LEFT JOIN 
    idosgd.tdtr_estados est_dest ON est_dest.co_est = des.es_doc_rec AND est_dest.de_tab = 'TDTV_DESTINOS'
WHERE 
    rem.nu_doc_emi = $1
    AND rem.co_use_mod = $2
    AND rem.co_tip_doc_adm = $3
    AND rem.es_doc_emi != '9'
ORDER BY 
    rem.nu_emi DESC;`

  try {
    const result = await query(sql, [nuDocEmi, coUseCre, coTipDocAdm]);

    // Si no hay resultados en la consulta, devolver un mensaje amigable
    if (result.length === 0) {
      return { message: "Archivo no encuentra ningún registro." };
    }

    let expediente = result[0]?.nu_expediente || result[1]?.nu_expediente;

    if (!expediente) {
      expediente = "documento aun en proyecto";
    }

    return {
      expediente,
      documentos: result,
    };
  } catch (error) {
    console.error("Error en el servicio de remitos:", error.message, error.stack);
    throw new Error("Error en la base de datos");
  }
}

export async function unionDoc(nuDocEmi, coUseCre, coTipDocAdm) {
  try {
    // Validar los parámetros
    if (!nuDocEmi || !coUseCre || !coTipDocAdm) {
      throw new Error("Parámetros inválidos: nuDocEmi, coUseCre, coTipDocAdm");
    }

    const resumen = await obtenerResumenPorExpediente(nuDocEmi, coUseCre, coTipDocAdm);
    // Si la respuesta es un mensaje de no encontrar registros, devolver ese mensaje
    if (resumen.message) {
      return resumen;
    }

    const documentos = resumen.documentos;
    const nuExpediente = resumen.expediente !== "documento aun en proyecto" ? resumen.expediente : null;

    // Si no hay expediente, devolver solo documentos
    if (documentos.length === 1 && !nuExpediente) {
      return documentos;
    }

    if (!nuExpediente) {
      throw new Error("No se pudo obtener el número de expediente");
    }

    // Segunda consulta si existe un expediente
    const sql = `
      SELECT
          r.nu_emi AS nu_emi,
          'INICIO' AS co_dep_emi_ref,
          dep_des.de_dependencia AS ti_emi_des,
          u.cdes_user AS co_emp_des,
          r.fe_use_mod AS hora_recepcion,
          est.de_est AS estado_documento,
          r.nu_doc_emi,
          doc_tipo.cdoc_desdoc AS tipo_documento
      FROM
          "IDOSGD_GRA".idosgd.tdtv_remitos r
      JOIN
          "IDOSGD_GRA".idosgd.tdtv_destinos d ON r.nu_emi = d.nu_emi
      LEFT JOIN
          "IDOSGD_GRA".idosgd.rhtm_dependencia dep_des ON d.co_dep_des = dep_des.co_dependencia
      LEFT JOIN
          "IDOSGD_GRA".idosgd.seg_usuarios1 u ON d.co_emp_rec = u.cemp_codemp
      LEFT JOIN
          "IDOSGD_GRA".idosgd.tdtr_estados est ON d.es_doc_rec = est.co_est AND est.de_tab = 'TDTV_DESTINOS'
      LEFT JOIN
          "IDOSGD_GRA".idosgd.si_mae_tipo_doc doc_tipo ON r.co_tip_doc_adm = doc_tipo.cdoc_tipdoc
      WHERE
          r.nu_doc_emi = $1
          AND r.co_use_mod = $2
          AND r.co_tip_doc_adm = $3

      UNION ALL

      SELECT 
          r.nu_emi,
          dep_emisora.de_dependencia AS co_dep_emi_ref,
          dep_destino.de_dependencia AS ti_emi_des,
          u1.cdes_user AS co_emp_des,
          rem.fe_use_cre AS hora_recepcion,
          (
              SELECT 
                  e.de_est
              FROM 
                  idosgd.tdtr_estados e
              WHERE 
                  e.co_est = rem.es_doc_emi
                  AND e.de_tab = 'TDTV_DESTINOS'
          ) AS estado_documento,
          rem.nu_doc_emi,
          doc_tipo.cdoc_desdoc AS tipo_documento
      FROM 
          "IDOSGD_GRA".idosgd.tdtx_remitos_resumen r
      LEFT JOIN 
          "IDOSGD_GRA".idosgd.tdtv_remitos rem ON r.nu_emi = rem.nu_emi
      LEFT JOIN 
          "IDOSGD_GRA".idosgd.tdtv_destinos d ON r.nu_emi = d.nu_emi
      LEFT JOIN 
          "IDOSGD_GRA".idosgd.seg_usuarios1 u1 ON d.co_emp_des = u1.cemp_codemp
      LEFT JOIN 
          "IDOSGD_GRA".idosgd.rhtm_dependencia dep_emisora ON dep_emisora.co_dependencia = r.co_dep_emi_ref
      LEFT JOIN 
          "IDOSGD_GRA".idosgd.rhtm_dependencia dep_destino ON dep_destino.co_dependencia = r.ti_emi_des
      LEFT JOIN 
          "IDOSGD_GRA".idosgd.si_mae_tipo_doc doc_tipo ON rem.co_tip_doc_adm = doc_tipo.cdoc_tipdoc
      WHERE 
          r.nu_expediente = $4 ;
    `;

    const result = await query(sql, [
      nuDocEmi,
      coUseCre,
      coTipDocAdm,
      nuExpediente,
    ]);

    return {
      expediente: nuExpediente,
      documentos: result,
    };
  } catch (error) {
    console.error("Error en el método unionDoc:", error.message, error.stack);
    throw new Error("Error en la base de datos");
  }
}
