export function validarAllPropVacias(obj: Record<string, any>): boolean {
    return Object.values(obj).every(
        valor => valor === '' || valor === null || valor === undefined
    );
}

export function validarAnyPropVacias(obj: Record<string, any>): boolean {
  return Object.values(obj).some(
    valor => valor === '' || valor === null || valor === undefined
  );
}