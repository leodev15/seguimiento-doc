import { useState } from "react";
import Search from "./Search";
import Tree from "./Tree";
import { validateDni, validatePartialDni, validateNumDoc } from "../utils/validation.js";
import { Busqueda } from "../models/busqueda.model.js";
import { useToast } from "../context/ToastContext.js";
import { validarAnyPropVacias } from "../utils/validationData.js";

export default function SeguimientoContainer() {
  const [expediente, setExpediente] = useState("");
  const [dni, setDni] = useState("");
  const [tipoDoc, setTipoDoc] = useState("");
  const [numDoc, setNumDoc] = useState("");
  const { showToast } = useToast();


  /**Agregado */
  const [busquedaOficina, setBusquedaOficina] = useState<Busqueda>({
    codDependencia: "",
    codPersonal: "",
    codTipodoc: "",
    numDocumento: "",
  })

  const handleSearchFromFront = (query: string) => {
    if (!query) {
      showToast("Ingrese el número de expediente del documento a buscar.", "error");
      return;
    }
    setExpediente(query);
  };

  const handleSearchByOficina = (busqueda: Busqueda) => {
    const formattedNumDoc = validateNumDoc(busqueda.numDocumento);

    if (validarAnyPropVacias(busqueda)) {
      showToast("Hay uno o varios campos por ingresar.", "error");
      return;
    } else if (!formattedNumDoc) {
      showToast("El número de documento debe ser numérico y tener hasta 6 dígitos.", "error");
      return;
    }
    setBusquedaOficina({ ...busqueda, numDocumento: formattedNumDoc })

  }

  const handleSearchFromBack = (dni: string, tipoDoc: string, numDoc: string) => {

    const formattedNumDoc = validateNumDoc(numDoc);

    if (!dni || !tipoDoc || !numDoc) {
      showToast("Hay uno o varios campos vacios para ingresar.","error")
      return
    } else if (!validateDni(dni)) {
      showToast("El dni debe tener 8 dígitos numéricos.", "error");
      return;
    }

    if (!formattedNumDoc) {
      alert("El número de documento debe ser numérico y tener hasta 6 dígitos.");
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
    <div className="flex flex-col gap-8 px-4 pt-6 pb-12 max-w-6xl mx-autos">
      <Search
        onSearch={handleSearchFromFront}
        onSearchOficina={handleSearchByOficina}
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
        busquedaOficina={busquedaOficina}
      />
    </div>
  );
}