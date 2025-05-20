interface PageProps {
  onStart: () => (view: "search" | "tree" | "backcard") => void;
}

export default function Page({ onStart }: PageProps) {
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg text-center">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Bienvenido al Sistema de Seguimiento
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mb-10">
        Selecciona una opción para continuar:
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center items-center max-w-6xl mx-auto">
        {/* CARD 1 - Seguimiento */}
        <div className="flip-card w-full max-w-xs mx-auto">
          <div className="flip-card-inner">
            <div
              className="flip-card-front bg-blue-600 text-white rounded-xl flex items-center justify-center text-xl font-semibold cursor-pointer"
              onClick={onStart}
            >
              Seguimiento
            </div>
            <div className="flip-card-back bg-blue-700 text-white rounded-xl p-4 flex items-center justify-center text-sm">
              Inicia el seguimiento de documentos por expediente o DNI.
            </div>
          </div>
        </div>

        {/* CARD 2 */}
        <div className="flip-card w-full max-w-xs mx-auto">
          <div className="flip-card-inner">
            <div className="flip-card-front bg-gray-400 dark:bg-gray-600 text-white rounded-xl flex items-center justify-center text-xl font-semibold">
              Opción 2
            </div>
            <div className="flip-card-back bg-gray-500 text-white rounded-xl p-4 flex items-center justify-center text-sm">
              Funcionalidad en desarrollo.
            </div>
          </div>
        </div>

        {/* CARD 3 */}
        <div className="flip-card w-full max-w-xs mx-auto">
          <div className="flip-card-inner">
            <div className="flip-card-front bg-gray-400 dark:bg-gray-600 text-white rounded-xl flex items-center justify-center text-xl font-semibold">
              Opción 3
            </div>
            <div className="flip-card-back bg-gray-500 text-white rounded-xl p-4 flex items-center justify-center text-sm">
              Esta opción estará disponible próximamente.
            </div>
          </div>
        </div>

        {/* CARD 4 */}
        <div className="flip-card w-full max-w-xs mx-auto">
          <div className="flip-card-inner">
            <div className="flip-card-front bg-gray-400 dark:bg-gray-600 text-white rounded-xl flex items-center justify-center text-xl font-semibold">
              Opción 4
            </div>
            <div className="flip-card-back bg-gray-500 text-white rounded-xl p-4 flex items-center justify-center text-sm">
              Más herramientas vendrán en futuras actualizaciones.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
