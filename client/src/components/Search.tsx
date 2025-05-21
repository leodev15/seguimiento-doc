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

  {/**Agregando el tab LD */ }
  const [open, setOpen] = useState("home");
  const handleTabOpen = (tabCategory: string) => {
    setOpen(tabCategory);
  };


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
    <div className="w-full flex flex-col items-center justify-start gap-6 px-4 sm:px-6 md:px-8 pt-10 sm:pt-12 md:pt-16">

      <section className="py-10 dark:bg-gray-800 rounded dark:border lg:pt-16 bg-white">

        <div className="container">

          <div className=" flex flex-wrap">

            <div className="w-full px-4">
              <div className="w-full">
                <div className="flex flex-col flex-wrap rounded-lg border border-[#E4E4E4] px-4 py-3 dark:border-dark-3 sm:flex-row">
                  <a
                    onClick={() => handleTabOpen("home")}
                    className={`cursor-pointer rounded-md px-4 py-3 text-sm font-medium md:text-base lg:px-6 ${open === "home"
                      ? "bg-primary text-red-500"
                      : "text-body-color hover:bg-primary hover:text-red-600 dark:text-dark-6 dark:hover:text-white"
                      }`}
                  >
                    SEGUIMIENTO POR EXPEDIENTE
                  </a>
                  <a
                    onClick={() => handleTabOpen("about")}
                    className={`cursor-pointer rounded-md px-4 py-3 text-sm font-medium md:text-base lg:px-6 ${open === "about"
                      ? "bg-primary text-red-500"
                      : "text-gray-800 hover:bg-primary hover:text-red-600 dark:text-dark-6 dark:hover:text-white"
                      }`}
                  >
                    SEGUIMIENTO AVANZADO
                  </a>
                  <a
                    onClick={() => handleTabOpen("team")}
                    className={`cursor-pointer rounded-md px-4 py-3 text-sm font-medium md:text-base lg:px-6 ${open === "team"
                      ? "bg-primary text-red-500"
                      : "text-gray-800 hover:bg-primary hover:text-red-600 dark:text-dark-6 dark:hover:text-white"
                      }`}
                  >
                    SEGUIMIENTO POR OFICINA
                  </a>

                </div>
                <TabContent
                  details={
                    <>
                      <h1 className="text-2xl font-semibold my-4 mb-8 dark:text-white">
                        Número de expediente
                      </h1>
                      <div className="w-full flex flex-col md:flex-row items-center gap-4">
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
                          className="bg-red-500 dark:bg-red-600 text-white py-4 px-8 rounded-xl hover:bg-red-600 dark:hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                        >
                          Buscar
                        </button>
                      </div>
                    </>
                  }
                  tabCategory="home"
                  open={open}
                />
                <TabContent
                  details={
                    <>
                      <h1 className="text-2xl font-semibold my-4 mb-8 dark:text-white">Datos del remitente</h1>

                      <div className="space-y-4">
                        <div className="grid gap-6">
                          <div className="flex items-center justify-between">
                            <label className="font-semibold text-xl mr-2">DNI:</label>
                            <input
                              type="text"
                              value={backQuery}
                              onChange={onBackChange}
                              placeholder="DNI"
                              className="w-[300px] md:w-[440px] lg:w-[540px] py-3 px-4 text-lg bg-white dark:bg-neutral-800 text-black dark:text-white rounded-xl shadow-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <label className="font-semibold text-xl mr-2">Tipo de documento:</label>
                            <select
                              value={tipoSeleccionado}
                              onChange={handleTipoSeleccionado}
                              className="w-[300px] md:w-[440px] lg:w-[540px] py-3 px-4 text-lg bg-white dark:bg-neutral-800 text-black dark:text-white rounded-xl shadow-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

                          <div className="flex items-center justify-between">
                            <label className="font-semibold text-xl mr-2">Número de documento:</label>
                            <input
                              type="text"
                              value={numeroDocumento}
                              onChange={handleNumeroDocumentoChange}
                              placeholder="N° de documento"
                              className="w-[300px] md:w-[440px] lg:w-[540px] py-3 px-4 text-lg bg-white dark:bg-neutral-800 text-black dark:text-white rounded-xl shadow-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>

                        <div className="flex justify-center mt-6">
                          <button
                            onClick={handleBackSearch}
                            className="bg-red-500 dark:bg-red-600 text-white py-4 my-5 px-8 rounded-xl hover:bg-red-600 dark:hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                          >
                            Buscar
                          </button>
                        </div>
                      </div>
                    </>
                  }
                  tabCategory="about"
                  open={open}
                />
                <TabContent
                  details={
                    <>
                      <h1 className="text-lg sm:text-2xl font-semibold my-4 mb-8 dark:text-white">Datos del remitente</h1>

                      <div className="space-y-4">

                        <div className="grid gap-6">

                          <div className="sm:flex items-center justify-between">
                            <label className="font-semibold text-xl pr-2">Dependencia:</label>
                            <select
                              value={tipoSeleccionado}
                              onChange={handleTipoSeleccionado}
                              className="w-[300px] md:w-[440px] lg:w-[540px] py-3 px-4 text-lg bg-white dark:bg-gray-900 text-black dark:text-white rounded-xl shadow-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

                          <div className="sm:flex items-center justify-between">
                            <label className="font-semibold text-xl pr-2">Personal:</label>
                            <select
                              value={tipoSeleccionado}
                              onChange={handleTipoSeleccionado}
                              className="w-[300px] md:w-[440px] lg:w-[540px] py-3 px-4 text-lg bg-white dark:bg-gray-900 text-black dark:text-white rounded-xl shadow-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

                          <div className="flex items-center justify-between">
                            <label className="font-semibold text-xl mr-2">Tipo de Documento:</label>
                            <select
                              value={tipoSeleccionado}
                              onChange={handleTipoSeleccionado}
                              className="w-[300px] md:w-[440px] lg:w-[540px] py-3 px-4 text-lg bg-white dark:bg-gray-900 text-black dark:text-white rounded-xl shadow-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
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



                          <div className="flex items-center justify-between">
                            <label className="font-semibold text-xl mr-2">Número de Documento:</label>

                            <input
                              type="text"
                              value={numeroDocumento}
                              onChange={handleNumeroDocumentoChange}
                              placeholder="N° de documento"
                              className="w-[300px] md:w-[440px] lg:w-[540px] py-3 px-4 text-lg bg-white dark:bg-gray-900 text-black dark:text-white rounded-xl shadow-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>

                        <div className="flex justify-center mt-6">
                          <button
                            onClick={handleBackSearch}
                            className="bg-red-500 dark:bg-red-600 text-white py-4 my-5 px-8 rounded-xl hover:bg-red-600 dark:hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                          >
                            Buscar
                          </button>
                        </div>
                      </div>
                    </>
                  }
                  tabCategory="team"
                  open={open}
                />

              </div>
            </div>
          </div>

        </div>

      </section>

      

    </div>
  );
}

interface PropTabContent {
  open: string;
  tabCategory: string;
  details: React.ReactNode;
}


const TabContent = ({ open, tabCategory, details }: PropTabContent) => {
  return (
    <div>
      <div
        className={`p-6 text-base leading-relaxed text-body-color dark:text-dark-6 ${open === tabCategory ? "block" : "hidden"
          } `}
      >
        {details}
      </div>
    </div>
  );
};