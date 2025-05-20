export const validateDni = (dni) => {
  const regex = /^[0-9]{8}$/;
  return regex.test(dni);
};

export const validatePartialDni = (dni) => {
  return dni === "" || /^[0-9]{1,8}$/.test(dni);
};

export const validateNumDoc = (numDoc) => {
  const regex = /^[0-9]{1,6}$/;
  if (!regex.test(numDoc)) {
    return false;
  }
  return numDoc.padStart(6, "0");
};