import { useEffect, useState } from "react";
import ReactModal from "react-modal";
import { fetchResumenPorExpediente } from "../../api/remitos";
import { fetchResumenSinExpediente } from "../../api/Seguimiento_SinExp";

interface TreeProps {
  expediente: string;
  dni: string;
  tipoDoc: string;
  numDoc: string;
}

interface DatoResumenExpediente {
  co_dep_emi_ref?: string;
  ti_emi_des?: string;
  co_emp_emi?: string;
  co_emp_des?: string;
  fecha?: string;
  estado_doc?: string;
  nu_expediente?: string;
}

interface DatoResumenSinExpediente {
  co_dep_emi_ref?: string;
  ti_emi_des?: string;
  co_emp_emi?: string;
  co_emp_des?: string;
  hora_recepcion?: string;
  estado_documento?: string;
  nu_expediente?: string;
}

export default function Tree({ expediente, dni, tipoDoc, numDoc }: TreeProps) {
  const [datosExpediente, setDatosExpediente] = useState<DatoResumenExpediente[]>([]);
  const [datosSinExpediente, setDatosSinExpediente] = useState<DatoResumenSinExpediente[]>([]);
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
  }, [expediente, dni, tipoDoc, numDoc]);

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
                <div className="border-l-4 pl-4" style={{ borderColor: index === (datosExpediente.length - 1) ? "red" : "blue" }}>
                  <div className="font-semibold">
                    {/*index === 0 ? "Dependencia de Inicio:" : "Derivado a:"*/}
                    {index === (datosExpediente.length - 1) ? "Dependencia de Inicio:" : "Derivado a:"}
                  </div>
                  <div>{index === 0 ? item.co_dep_emi_ref || "MESA DE PARTES" : item.ti_emi_des || "CIUDADANO"}</div>
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
                  </div> 
                </div>
              </li>
            ))}
          </ul>
        ) : datosSinExpediente.length > 0 ? (
          <ul className="space-y-6 pl-6 text-left text-black dark:text-white max-h-96 overflow-y-auto pr-2 custom-scroll">
            {datosSinExpediente.map((item, index) => (
              <li key={index} className="flex items-start space-x-4">
                <div className="border-l-4 pl-4" style={{ borderColor: index === 0 ? "red" : "blue" }}>
                  <div className="font-semibold">
                    {index === 0 ? "Dependencia de Inicio:" : "Derivado a:"}
                  </div>
                  <div>{index === 0 ? item.co_dep_emi_ref || "MESA DE PARTES" : item.ti_emi_des || "CIUDADANO"}</div>
                  <div className="text-sm font-normal">
                    Responsable: {item.co_emp_des || "Sin responsable"}
                  </div>
                  {item.nu_expediente && (
                    <div className="text-sm font-normal">
                      Número de Expediente: {item.nu_expediente}
                    </div>
                  )}
                  <div className="text-sm font-normal">
                    Estado: {item.estado_documento || "Sin estado"}
                  </div>
                  <div className="text-sm font-normal">
                    Fecha: {formatearFechaHora(item.hora_recepcion)}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-300">❌ Registro no encontrado.</p>
        )}
      </div>
    </div>
  );
}
