import { query } from "../db/db.js";

export async function obtenerResumenPorExpediente(nuDocEmi, coUseCre, coTipDocAdm) {
  const sql = `WITH DocumentoInicial AS (
    SELECT
        r.nu_emi,
        dep_des.de_dependencia AS ti_emi_des,
        u.cdes_user AS co_emp_des,
        d.fe_rec_doc AS hora_recepcion,
        est.de_est AS estado_documento,
        r.nu_doc_emi,
        doc_tipo.cdoc_desdoc AS tipo_documento,
        r.nu_ann_exp,
        r.nu_sec_exp
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
        AND r.co_use_mod  = $2
        AND r.co_tip_doc_adm = $3
)
	
SELECT 
	COALESCE(rem.nu_emi, doc.nu_emi) AS nu_emi,
    COALESCE(rem.co_dep_emi, 'INICIO') AS co_dep_emi_ref, 
    COALESCE(dep_destino.de_dependencia, doc.ti_emi_des) AS ti_emi_des,
    COALESCE(u1.cdes_user, doc.co_emp_des) AS co_emp_des,
    COALESCE(d.fe_rec_doc, doc.hora_recepcion) AS hora_recepcion,
    COALESCE(e.de_est, doc.estado_documento) AS estado_documento,
    COALESCE(rem.nu_doc_emi, doc.nu_doc_emi) AS nu_doc_emi,
    COALESCE(doc_tipo_rem.cdoc_desdoc, doc.tipo_documento) AS tipo_documento,
    COALESCE(exp.nu_expediente, exp_doc.nu_expediente) AS nu_expediente
FROM 
    DocumentoInicial doc
LEFT JOIN 
    "IDOSGD_GRA".idosgd.tdtc_expediente exp_doc 
    ON exp_doc.nu_ann_exp = doc.nu_ann_exp AND exp_doc.nu_sec_exp = doc.nu_sec_exp
LEFT JOIN 
    "IDOSGD_GRA".idosgd.tdtr_referencia ref 
    ON ref.nu_emi = doc.nu_emi OR ref.nu_emi_ref = doc.nu_emi
LEFT JOIN 
    "IDOSGD_GRA".idosgd.tdtv_remitos rem 
    ON rem.nu_emi = ref.nu_emi OR rem.nu_emi = ref.nu_emi_ref
LEFT JOIN 
    "IDOSGD_GRA".idosgd.tdtc_expediente exp 
    ON exp.nu_ann_exp = rem.nu_ann_exp AND exp.nu_sec_exp = rem.nu_sec_exp
LEFT JOIN 
    "IDOSGD_GRA".idosgd.tdtv_destinos d 
    ON rem.nu_emi = d.nu_emi
LEFT JOIN 
    "IDOSGD_GRA".idosgd.seg_usuarios1 u1 
    ON d.co_emp_des = u1.cemp_codemp
LEFT JOIN 
    "IDOSGD_GRA".idosgd.rhtm_dependencia dep_emisora 
    ON rem.co_dep_emi = dep_emisora.co_dependencia
LEFT JOIN 
    "IDOSGD_GRA".idosgd.rhtm_dependencia dep_destino 
    ON d.co_dep_des = dep_destino.co_dependencia
LEFT JOIN 
    "IDOSGD_GRA".idosgd.si_mae_tipo_doc doc_tipo_rem 
    ON rem.co_tip_doc_adm = doc_tipo_rem.cdoc_tipdoc
LEFT JOIN 
    "IDOSGD_GRA".idosgd.tdtr_estados e 
    ON e.co_est = d.es_doc_rec AND e.de_tab = 'TDTV_DESTINOS' order by d.fe_rec_doc desc;`

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
