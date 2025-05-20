const BASE_URL =
    import.meta.env.MODE === "production"
    ? "/api"  
    : "http://localhost:3001/api";

export default BASE_URL;
