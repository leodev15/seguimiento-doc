import { query } from "../db/db.js";

export async function obtenerExpedientePorOficina(coDep, coPer, coTipDocAdm, numDoc) {
  const sql = `SELECT 
    trr.nu_expediente
FROM 
    idosgd.tdtx_remitos_resumen trr
WHERE 
    trr.nu_emi = (
        SELECT rem.nu_emi
        FROM idosgd.tdtv_remitos rem
        WHERE 
            rem.co_dep_emi = $1
  			AND rem.co_emp_emi = $2
    		AND rem.co_tip_doc_adm = $3
    		AND rem.nu_doc_emi = $4
            AND rem.es_doc_emi != '9'
        ORDER BY rem.fe_emi DESC
        LIMIT 1
    );`

  try {
    const result = await query(sql, [coDep, coPer, coTipDocAdm, numDoc]);
    // Si no hay resultados en la consulta, devolver un mensaje amigable
    if (result.length === 0) {
      return { message: "Archivo no encuentra ningún registro." };
    }

    let expediente = result[0]?.nu_expediente || result[1]?.nu_expediente;

    if (!expediente) {
      expediente = "documento aun no tiene expediente";
    }

    return {
      expediente,
      documentos: result,
    };
  } catch (error) {
    console.error("Error en el servicio de expediente:", error.message, error.stack);
    throw new Error("Error en la base de datos");
  }
}


export async function obtenerResumenPorOficina(coDep, coPer, coTipDocAdm, numDoc) {
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
    rem.co_dep_emi = $1
    AND rem.co_emp_emi = $2
    AND rem.co_tip_doc_adm = $3
    AND rem.nu_doc_emi = $4
    AND rem.es_doc_emi != '9'
ORDER BY 
    rem.fe_emi DESC;`

  try {
    const result = await query(sql, [coDep, coPer, coTipDocAdm, numDoc]);

    console.log(result)

    // Si no hay resultados en la consulta, devolver un mensaje amigable
    if (result.length === 0) {
      return { message: "Archivo no encuentra ningún registro." };
    }

    let expediente = result[0]?.nu_expediente || result[1]?.nu_expediente;

    if (!expediente) {
      expediente = "documento aun no tiene expediente";
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


export async function unionDocs(codigoDependencia, codigoPersonal, tipoDocumento, numeroDocumento) {
  try {

    // Validar los parámetros
    if (!codigoDependencia || !codigoPersonal || !tipoDocumento || !numeroDocumento) {
      throw new Error("Parámetros inválidos: codigoDependencia, codigoPersonal, coTipDocAdm,numeroDocumento");
    }

    const resExpediente = await obtenerExpedientePorOficina(codigoDependencia, codigoPersonal, tipoDocumento, numeroDocumento);
    // Si la respuesta es un mensaje de no encontrar registros, devolver ese mensaje
    if (resExpediente.message) {
      return resExpediente;
    }

    console.log(resExpediente.expediente)

    {/*const expedientes = await obtenerResumenPorExpediente(nroExpediente);
    // Si la respuesta es un mensaje de no encontrar registros, devolver ese mensaje
    if (expedientes.message) {
      return expedientes;
    }

    console.log(expedientes);*/}

    const resumen = await obtenerResumenPorOficina(codigoDependencia, codigoPersonal, tipoDocumento, numeroDocumento);
    // Si la respuesta es un mensaje de no encontrar registros, devolver ese mensaje
    if (resumen.message) {
      return resumen;
    }

    console.log(resumen);

    const documentos = resumen.documentos;

    const nuExpediente = resExpediente.expediente !== "documento aun no tiene expediente" ? resExpediente.expediente : null;

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
    idosgd.tdtx_remitos_resumen trr ON trr.nu_emi = rem.nu_emi
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
    trr.nu_expediente = $1
    AND rem.es_doc_emi != '9'
ORDER BY 
    rem.nu_emi DESC;
    `;

    const result = await query(sql, [
      nuExpediente
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
