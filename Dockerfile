# Etapa 1: Construcción del frontend
FROM node:20 AS build

WORKDIR /app

# Copiar los archivos de package.json y package-lock.json del cliente
COPY ./client/package.json ./client/package-lock.json ./client/

# Instalar dependencias del frontend
RUN npm install --prefix client

# Copiar el resto de los archivos del cliente
COPY ./client ./client

# Construir el frontend
RUN npm run build --prefix client

# Etapa 2: Construcción del backend
FROM node:20

WORKDIR /app

# Copiar los archivos de package.json y package-lock.json del servidor
COPY ./server/package.json ./server/package-lock.json ./server/

# Instalar dependencias del backend
RUN npm install --prefix server

# Copiar el resto de los archivos del servidor
COPY ./server ./server

# Copiar los archivos del frontend ya construidos desde la etapa de build
COPY --from=build /app/client/dist /app/client/dist

# Exponer el puerto para el backend
EXPOSE 3000

# Iniciar el servidor backend
CMD ["npm", "--prefix", "server", "run", "start"]