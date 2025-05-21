import { Documento } from "../models/documentos.model";
import { Personal } from "../models/personal.model";

type Entrada = {
    codigo: string;
    dependencia: string;
};

export interface Option {
    value: string | number;
    label: string;
}

export const transformarDependencias = (data: Entrada[]): Option[] => {
    return data.map(item => ({
        value: item.codigo,
        label: item.dependencia,
    }))
}

export const transformarPersonales = (data: Personal[]): Option[] => {
    return data.map(item => ({
        value: item.codigo,
        label: item.personal,
    }))
}

export const transformarDocumentos = (data: Documento[]): Option[] => {
    return data.map(item => ({
        value: item.cdoc_tipdoc,
        label: item.cdoc_desdoc,
    }))
}
