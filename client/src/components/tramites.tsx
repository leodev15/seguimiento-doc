import { useState } from "react";
import Search from "./Search";
import Tree from "./Tree";
import { validateDni, validatePartialDni, validateNumDoc } from "../utils/validation.js"; 
export default function SeguimientoContainer() {
  const [expediente, setExpediente] = useState("");
  const [dni, setDni] = useState("");
  const [tipoDoc, setTipoDoc] = useState("");
  const [numDoc, setNumDoc] = useState("");

  const handleSearchFromFront = (query: string) => {
    setExpediente(query);
    setDni("");
    setTipoDoc("");
    setNumDoc("");
  };

  const handleSearchFromBack = (dni: string, tipoDoc: string, numDoc: string) => {
    if (!validateDni(dni)) {
      alert("El DNI debe tener 8 dígitos numéricos");
      return;
    }

    const formattedNumDoc = validateNumDoc(numDoc);
    if (!formattedNumDoc) {
      alert("El número de documento debe ser numérico y tener hasta 6 dígitos");
      return;
    }

    setDni(dni);
    setTipoDoc(tipoDoc);
    setNumDoc(formattedNumDoc);
    setExpediente("");
  };

  const handleFrontChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExpediente(e.target.value);
  };

  const handleBackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (validatePartialDni(value)) {
      setDni(value);
    }
  };

  return (
    <div className="flex flex-col gap-8 px-4 pt-6 pb-12 max-w-6xl mx-auto">
      <Search
        onSearch={handleSearchFromFront}
        onBackSearch={handleSearchFromBack}
        frontQuery={expediente}
        backQuery={dni}
        onFrontChange={handleFrontChange}
        onBackChange={handleBackChange}
      />
      <Tree
        dni={dni}
        tipoDoc={tipoDoc}
        numDoc={numDoc}
        expediente={expediente}
      />
    </div>
  );
}