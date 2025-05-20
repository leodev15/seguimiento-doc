const { exec } = require("child_process");
const env = process.env.NODE_ENV || 'development';

if (env === 'development') {
  console.log("🚀 Iniciando en modo desarrollo...\n");

  const backend = exec("npm --prefix server run dev");
  backend.stdout.on("data", (data) => console.log("Backend (dev):", data.toString()));
  backend.stderr.on("data", (data) => console.error("❌ Backend (dev):", data.toString()));

  const frontend = exec("npm --prefix client run dev");
  frontend.stdout.on("data", (data) => console.log("Frontend (dev):", data.toString()));
  frontend.stderr.on("data", (data) => console.error("❌ Frontend (dev):", data.toString()));

} else if (env === 'production') {
  console.log("🚀 Iniciando en modo producción...\n");

  const build = exec("npm --prefix client run build");

  build.stdout.on("data", (data) => console.log("Frontend build:", data.toString()));
  build.stderr.on("data", (data) => console.error("❌ Error en el build del frontend:", data.toString()));

  build.on("exit", (code) => {
    if (code === 0) {
      console.log("✅ Build del frontend completado.\n");

      const backend = exec("npm --prefix server run start");
      backend.stdout.on("data", (data) => console.log("Backend (prod):", data.toString()));
      backend.stderr.on("data", (data) => console.error("❌ Backend (prod):", data.toString()));
    } else {
      console.error("❌ Falló el build del frontend. Abortando inicio del backend.");
    }
  });
} else {
  console.log("❌ No se especificó un entorno válido.");
}
// node start.js