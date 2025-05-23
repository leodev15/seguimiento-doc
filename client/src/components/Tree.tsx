import { useEffect, useState } from "react";
import ReactModal from "react-modal";
import { fetchResumenPorExpediente } from "../../api/remitos";
import { fetchResumenSinExpediente } from "../../api/Seguimiento_SinExp";
import { Busqueda } from "../models/busqueda.model";
import { FaLongArrowAltRight } from "react-icons/fa";
import { SiGoogledocs } from "react-icons/si";
import { fetchResumenOficinaSinExpediente } from "../../api/seguimiento_by_oficina";


interface TreeProps {
  expediente: string;
  dni: string;
  tipoDoc: string;
  numDoc: string;
  busquedaOficina: Busqueda;
}

interface DatosResumenExpediente {
  nu_emi: string,
  co_dep_emi: string,
  oficina_remitente: string,
  empleado_remitente: string,
  fecha_emision: string,
  estado_emisor: string,
  co_dep_des: string,
  oficina_destino: string,
  empleado_destinatario: string,
  fecha_recepcion: string,
  estado_destino: string,
  nu_doc_emi: string,
  tipo_documento: string
}

interface DatosResumenSinExpediente {
  nu_emi: string,
  co_dep_emi: string,
  oficina_remitente: string,
  empleado_remitente: string,
  fecha_emision: string,
  estado_emisor: string,
  co_dep_des: string,
  oficina_destino: string,
  empleado_destinatario: string,
  fecha_recepcion: string | null,
  estado_destino: string,
  nu_doc_emi: string,
  tipo_documento: string
}

export default function Tree({ expediente, dni, tipoDoc, numDoc, busquedaOficina }: TreeProps) {
  const [datosExpediente, setDatosExpediente] = useState<DatosResumenExpediente[]>([]);
  const [datosSinExpediente, setDatosSinExpediente] = useState<DatosResumenSinExpediente[]>([]);
  const [cargando, setCargando] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [numeroExpedienteModal, setNumeroExpedienteModal] = useState<string | null>(null);
  const [mostrarModal, setMostrarModal] = useState<boolean>(false);


  useEffect(() => {
    const obtenerDatos = async () => {
      setCargando(true);
      setError(null);

      try {

        if (expediente) {
          const response = await fetchResumenPorExpediente(expediente);
          setDatosExpediente(response);
          setDatosSinExpediente([]);
        } else if (dni && tipoDoc && numDoc) {
          const response = await fetchResumenSinExpediente(dni, tipoDoc, numDoc);
          setDatosSinExpediente(response.listaDocumentos);
          setDatosExpediente([]);
          setNumeroExpedienteModal(response.numeroExpediente || null);
          setMostrarModal(true);

        } else if (busquedaOficina.codDependencia && busquedaOficina.codPersonal && busquedaOficina.codTipodoc, busquedaOficina.numDocumento) {

          const response = await fetchResumenOficinaSinExpediente(busquedaOficina);

          setDatosSinExpediente(response.listaDocumentos);
          setDatosExpediente([]);
          setNumeroExpedienteModal(response.numeroExpediente || null);

          setMostrarModal(true);

        } else {
          setDatosExpediente([]);
          setDatosSinExpediente([]);
          setError('Por favor, proporcione un expediente o los parámetros de DNI, tipo de documento y número de documento.');
        }


      } catch (error: unknown) {
        let errorMessage = 'Ocurrió un error al obtener los datos.';
        if (error instanceof Error) {
          if (error.message.includes('Documento no encontrado') || error.message.includes('No se encontraron datos')) {
            errorMessage = 'Documento no encontrado.';
          } else if (error.message.includes('Parámetros inválidos')) {
            errorMessage = 'Los parámetros proporcionados son inválidos.';
          } else if (error.message.includes('Error interno del servidor')) {
            errorMessage = 'Error interno del servidor. Por favor, intenta de nuevo más tarde.';
          }
        }
        setError(errorMessage);
        setDatosExpediente([]);
        setDatosSinExpediente([]);
      } finally {
        setCargando(false);
      }
    };

    obtenerDatos();
  }, [expediente, dni, tipoDoc, numDoc, busquedaOficina]);

  const formatearFechaHora = (fechaISO?: string) => {
    if (!fechaISO) return "Fecha no disponible";
    const fecha = new Date(fechaISO);
    return fecha.toLocaleString("es-PE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="w-full">
      {/* Modal de número de expediente */}
      <ReactModal
        isOpen={mostrarModal}
        onRequestClose={() => setMostrarModal(false)}
        className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-lg max-w-md mx-auto mt-24 text-center outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
        ariaHideApp={false}
      >
        {numeroExpedienteModal ? (
          <h2 className="text-3xl font-bold text-black dark:text-white">
            Número de Expediente: <br /> {numeroExpedienteModal}
          </h2>
        ) : (
          <p className="text-base text-gray-700 dark:text-gray-300">
            El documento aún no tiene expediente.
          </p>
        )}
        <button
          onClick={() => setMostrarModal(false)}
          className="mt-6 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
        >
          Cerrar
        </button>
      </ReactModal>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        {cargando ? (
          <p className="text-center text-black dark:text-white">Cargando datos...</p>
        ) : error ? (
          <p className="text-center text-red-500 dark:text-red-400">❌ {error}</p>
        ) : datosExpediente.length === 0 && datosSinExpediente.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-300">❌ Registro no encontrado.</p>
        ) : expediente && datosExpediente.length > 0 ? (
          <ul className="space-y-6 pl-6 text-left text-black dark:text-white max-h-96 overflow-y-auto pr-2 custom-scroll">
            {datosExpediente.map((item, index) => (
              <li key={index} className="flex items-start space-x-4">
                <div className="border border-gray-200 px-3 py-4 rounded-2xl shadow-lg" style={{ borderColor: index === (datosExpediente.length - 1) ? "red" : "gray" }}>
                  <div className="font-semibold">
                    {/*index === 0 ? "Dependencia de Inicio:" : "Derivado a:"*/}

                  </div>

                  {/*<div>{index === 0 ? item.co_dep_emi_ref || "MESA DE PARTES" : item.ti_emi_des || "CIUDADANO"}</div>
                  <div className="text-sm font-normal">
                    Responsable: {item.co_emp_des || "Sin responsable"}
                  </div>
                  <div className="text-sm font-normal">
                    Documento: {"MEMORANDO N° 000000"}
                  </div>
                  {item.nu_expediente && (
                    <div className="text-sm font-normal">
                      Número de Expediente: {item.nu_expediente}
                    </div>
                  )}
                  <div className="text-sm font-normal">
                    Estado: {item.estado_doc || "Sin estado"}
                  </div>
                  <div className="text-sm font-normal">
                    Fecha: {formatearFechaHora(item.fecha)}
                  </div>*/}

                  <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-8 items-start">
                    {/* DESTINATARIO */}
                    <div className="order-1 md:order-3">
                      <p className="text-lg font-semibold">DESTINATARIO</p>
                      <div className="border border-gray-200 px-3 py-4 rounded-2xl">
                        <p><span className="font-semibold">{item.oficina_destino}</span></p>
                        <p>Receptor: <span className="font-semibold">{item.empleado_destinatario}</span></p>
                        <p>Fecha Recepción: <span className="font-semibold">{formatearFechaHora(item.fecha_recepcion)}</span></p>
                        <p>Estado: <span className="font-semibold">{item.estado_destino}</span></p>
                      </div>
                    </div>

                    {/* ÍCONOS Y TEXTO */}

                    <div className="order-2 flex flex-col items-center justify-center h-full space-y-2">
                      <div className="flex md:flex-col">
                        {/* Icono de documento */}
                        <SiGoogledocs size={48} />

                        {/* Flecha arriba en mobile, horizontal en md */}
                        <FaLongArrowAltRight
                          size={38}
                          className="-rotate-90 md:rotate-0"
                        />
                      </div>

                      {/* Texto del documento */}
                      <span className="font-semibold text-center">
                        {item.tipo_documento} N° {item.co_dep_emi}
                      </span>
                    </div>

                    {/* REMITENTE */}
                    <div className="order-3 md:order-1">
                      <p className="text-lg font-semibold">REMITENTE</p>
                      <div className="border border-gray-200 px-3 py-4 rounded-2xl">
                        <p><span className="font-semibold">{item.oficina_remitente}</span></p>
                        <p>Emisor: <span className="font-semibold">{item.empleado_remitente}</span></p>
                        <p>Fecha Emisión: <span className="font-semibold">{formatearFechaHora(item.fecha_emision)}</span></p>
                        <p>Estado: <span className="font-semibold">{item.estado_emisor}</span></p>
                      </div>
                    </div>
                  </div>

                </div>
              </li>
            ))}

          </ul>
        ) : datosSinExpediente.length > 0 ? (
          <>
            <div className={`${numeroExpedienteModal? "bg-green-400":"bg-gray-400"}  rounded-md py-3 mb-4`}>
              <p className="font-semibold text-lg">{numeroExpedienteModal? (`N°: ${numeroExpedienteModal}`): "El documento aun no tiene un expediente."}</p>
            </div>
            <ul className="space-y-6 pl-6 text-left text-black dark:text-white max-h-96 overflow-y-auto pr-2 custom-scroll">
              {datosSinExpediente.map((item, index) => (
                <li key={index} className="flex items-start">
                  <div className="border border-gray-200 px-3 py-4 rounded-2xl shadow-lg" style={{ borderColor: index === (datosExpediente.length - 1) ? "red" : "gray" }}>

                    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-8 items-start">
                      {/* DESTINATARIO */}
                      <div className="order-1 md:order-3">
                        <p className="text-lg font-semibold">DESTINATARIO</p>
                        <div className="border border-gray-200 px-3 py-4 rounded-2xl">
                          <p><span className="font-semibold">{item.oficina_destino}</span></p>
                          <p>Receptor: <span className="font-semibold">{item.empleado_destinatario}</span></p>
                          <p>Fecha Recepción: <span className="font-semibold">{item.fecha_recepcion ? formatearFechaHora(item.fecha_recepcion) : "FECHA NO DISPONIBLE"}</span></p>
                          <p>Estado: <span className="font-semibold">{item.estado_destino}</span></p>
                        </div>
                      </div>

                      {/* ÍCONOS Y TEXTO */}

                      <div className="order-2 flex flex-col items-center justify-center h-full space-y-2">
                        <div className="flex md:flex-col">
                          {/* Icono de documento */}
                          <SiGoogledocs size={48} />

                          {/* Flecha arriba en mobile, horizontal en md */}
                          <FaLongArrowAltRight
                            size={38}
                            className="-rotate-90 md:rotate-0"
                          />
                        </div>

                        {/* Texto del documento */}
                        <span className="font-semibold text-center">
                          {item.tipo_documento} N° {item.co_dep_emi}
                        </span>
                      </div>

                      {/* REMITENTE */}
                      <div className="order-3 md:order-1">
                        <p className="text-lg font-semibold">REMITENTE</p>
                        <div className="border border-gray-200 px-3 py-4 rounded-2xl">
                          <p><span className="font-semibold">{item.oficina_remitente}</span></p>
                          <p>Emisor: <span className="font-semibold">{item.empleado_remitente}</span></p>
                          <p>Fecha Emisión: <span className="font-semibold">{formatearFechaHora(item.fecha_emision)}</span></p>
                          <p>Estado: <span className="font-semibold">{item.estado_emisor}</span></p>
                        </div>
                      </div>
                    </div>

                  </div>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-300">❌ Registro no encontrado.</p>
        )}
      </div>
    </div>
  );
}
