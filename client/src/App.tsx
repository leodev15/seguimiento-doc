import DarkModeToggle from './components/DarkModeToggle';
import Background from './components/Background';
import SeguimientoContainer from './components/tramites'; 

function App() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-center p-4">
      <Background />

      <div className="fixed top-0 left-0 right-0 z-20 p-4 bg-white dark:bg-gray-800 shadow-lg flex items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <img src="/logo.png" alt="Logo" className="h-14 w-auto" />
          <span className="text-lg sm:text-xl font-semibold text-black dark:text-white">
            GORE Ayacucho
          </span>
        </div>

        <DarkModeToggle />
      </div>
      <div className="w-full max-w-6xl space-y-6 mt-20 px-4 lg:mt-12">
        <SeguimientoContainer />  
      </div>
    </div>
  );
}

export default App;
