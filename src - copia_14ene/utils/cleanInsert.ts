// Reemplaza strings vacíos por null en un objeto (recursivo si hay nested)
export function cleanData<T extends Record<string, any>>(data: T): T {
  const cleaned: any = {};
  for (const key in data) {
    if (data[key] === "") {
      cleaned[key] = null;
    } else if (typeof data[key] === "object" && data[key] !== null) {
      cleaned[key] = cleanData(data[key]); // recursivo
    } else {
      cleaned[key] = data[key];
    }
  }
  return cleaned;
}

