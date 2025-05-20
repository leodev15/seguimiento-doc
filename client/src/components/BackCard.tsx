import React, { useState, useEffect } from "react";
import { fetchTiposDocumento } from "../../api/nom_doc"; // API para obtener tipos de documentos

interface BackCardProps {
  dni: string; // Valor del DNI (en lugar de query, para claridad)
  onDniChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // Maneja cambios en DNI
  onSearch: (dni: string, tipoDoc: string, numDoc: string) => void; // Función para enviar los tres parámetros
}

interface TipoDocumento {
  cdoc_desdoc: string;
  cdoc_tipdoc: string;
}

const BackCard: React.FC<BackCardProps> = ({ dni, onDniChange, onSearch }) => {
  const [tiposDocumento, setTiposDocumento] = useState<TipoDocumento[]>([]);
  const [cargando, setCargando] = useState<boolean>(false);
  const [tipoSeleccionado, setTipoSeleccionado] = useState<string>("");
  const [numeroDocumento, setNumeroDocumento] = useState<string>("");

  useEffect(() => {
    const obtenerTiposDocumento = async () => {
      setCargando(true);
      try {
        const documentos: TipoDocumento[] = await fetchTiposDocumento();
        setTiposDocumento(documentos);
      } catch (error) {
        console.error("Error al obtener los tipos de documento:", error);
      } finally {
        setCargando(false);
      }
    };

    obtenerTiposDocumento();
  }, []);
  
  const handleTipoSeleccionado = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTipoSeleccionado(event.target.value);
  };

  const handleNumeroDocumentoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNumeroDocumento(event.target.value);
  };

  const handleSubmit = () => {
    // Llamamos a onSearch con los tres parámetros
    onSearch(dni, tipoSeleccionado, numeroDocumento);
  };

  return (
    <div className="text-center text-black dark:text-white p-6">
      <h1 className="text-2xl font-semibold mb-4">Seguimiento de trámites profesionales</h1>

      <div className="space-y-4">
        <div className="flex justify-center space-x-4">
          <div className="flex-1">
            <input
              type="text"
              value={dni}
              onChange={onDniChange}
              placeholder="DNI"
              className="w-full py-3 px-4 text-lg bg-white dark:bg-neutral-800 text-black dark:text-white rounded-xl shadow-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex-1">
            <select
              value={tipoSeleccionado}
              onChange={handleTipoSeleccionado}
              className="w-full py-3 px-4 text-lg bg-white dark:bg-neutral-800 text-black dark:text-white rounded-xl shadow-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>Seleccionar opción</option>
              {cargando ? (
                <option value="">Cargando...</option>
              ) : (
                tiposDocumento.map((tipo) => (
                  <option key={tipo.cdoc_tipdoc} value={tipo.cdoc_tipdoc}>
                    {tipo.cdoc_desdoc}
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="flex-1">
            <input
              type="text"
              value={numeroDocumento}
              onChange={handleNumeroDocumentoChange}
              placeholder="N° de documento"
              className="w-full py-3 px-4 text-lg bg-white dark:bg-neutral-800 text-black dark:text-white rounded-xl shadow-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <button
            onClick={handleSubmit}
            className="bg-red-500 dark:bg-red-600 text-white py-3 px-6 rounded-xl hover:bg-red-600 dark:hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
          >
            Buscar
          </button>
        </div>
      </div>
    </div>
  );
};

export default BackCard;