import { useState, useEffect } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { fetchTiposDocumento } from "../../api/nom_doc";

interface SearchProps {
  onSearch: (query: string) => void;
  onBackSearch: (dni: string, tipoDoc: string, numDoc: string) => void;
  frontQuery: string; // Número de expediente (cara frontal)
  backQuery: string; // DNI (cara trasera)
  onFrontChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBackChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface TipoDocumento {
  cdoc_desdoc: string;
  cdoc_tipdoc: string;
}

export default function Search({
  onSearch,
  onBackSearch,
  frontQuery,
  backQuery,
  onFrontChange,
  onBackChange,
}: SearchProps) {
  const [rotated, setRotated] = useState(false);
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

  const handleSearch = () => {
    if (onSearch) {
      onSearch(frontQuery); // Búsqueda por expediente
    }
  };

  const handleBackSearch = () => {
    if (onBackSearch) {
      onBackSearch(backQuery, tipoSeleccionado, numeroDocumento); // Búsqueda con tres parámetros
      
      /**Agregado por LD */
      setNumeroDocumento("")
      setTipoSeleccionado("")

    }
  };

  const handleRotateRight = () => setRotated(true);
  const handleRotateLeft = () => setRotated(false);

  return (
    <div className="w-full flex flex-col items-center justify-start gap-8 px-4 sm:px-6 md:px-8 pt-10 sm:pt-12 md:pt-16">
      <div className="relative w-full max-w-4xl min-h-[350px] perspective-[1200px]">
        {/* Flechas */}
        <button
          onClick={handleRotateLeft}
          className="absolute left-[-40px] top-1/2 transform -translate-y-1/2 z-20"
        >
          <ChevronLeftIcon className="h-8 w-8 text-sky-500 hover:text-sky-700 transition" />
        </button>
        <button
          onClick={handleRotateRight}
          className="absolute right-[-40px] top-1/2 transform -translate-y-1/2 z-20"
        >
          <ChevronRightIcon className="h-8 w-8 text-sky-500 hover:text-sky-700 transition" />
        </button>

        {/* Contenedor giratorio */}
        <div
          className="relative w-full transition-transform duration-700"
          style={{
            transformStyle: "preserve-3d",
            transform: rotated ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* Cara Frontal (búsqueda por expediente) */}
          <div
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(0deg)",
            }}
            className={`absolute w-full top-0 left-0 p-6 rounded-2xl transition-opacity duration-500 ${
              rotated ? "pointer-events-none opacity-0" : "pointer-events-auto opacity-100"
            } bg-white dark:bg-neutral-800 shadow-md`}
          >
            <h1 className="text-2xl sm:text-3xl font-bold text-center text-black dark:text-white mb-4">
              Seguimiento de trámites
            </h1>

            <div className="w-full flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center w-full bg-white dark:bg-neutral-800 rounded-xl shadow-md border border-gray-300 dark:border-gray-600">
                <div className="px-4 py-2">
                  <MagnifyingGlassIcon className="w-5 h-5 text-gray-500 dark:text-white" />
                </div>
                <input
                  type="text"
                  value={frontQuery}
                  onChange={onFrontChange}
                  placeholder="N° expediente Ejm (2025001234)"
                  className="w-full py-3 px-4 text-base sm:text-lg bg-white dark:bg-neutral-800 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border-none focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <button
                onClick={handleSearch}
                className="bg-red-500 dark:bg-red-600 text-white py-3 px-6 rounded-xl hover:bg-red-600 dark:hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
              >
                Buscar
              </button>
            </div>
          </div>

          {/* Cara Trasera (búsqueda por DNI, tipoDoc, numDoc) */}
          <div
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
            className={`absolute w-full top-0 left-0 p-6 rounded-2xl transition-opacity duration-500 ${
              rotated ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
            } bg-white dark:bg-neutral-800 shadow-md`}
          >
            <h1 className="text-2xl font-semibold mb-4">Seguimiento de trámites profesionales</h1>

            <div className="space-y-4">
              <div className="flex justify-center space-x-4">
                <div className="flex-1">
                  <input
                    type="text"
                    value={backQuery}
                    onChange={onBackChange}
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
                  onClick={handleBackSearch}
                  className="bg-red-500 dark:bg-red-600 text-white py-3 px-6 rounded-xl hover:bg-red-600 dark:hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                >
                  Buscar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}