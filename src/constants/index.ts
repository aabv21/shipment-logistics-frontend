interface ProductType {
  value: string;
  label: string;
}

export const PRODUCT_TYPES: ProductType[] = [
  { value: "electronics", label: "Electrónicos" },
  { value: "clothing", label: "Ropa" },
  { value: "documents", label: "Documentos" },
  { value: "food", label: "Alimentos" },
  { value: "furniture", label: "Muebles" },
  { value: "fragile", label: "Frágil" },
  { value: "medical", label: "Médico" },
  { value: "books", label: "Libros" },
  { value: "other", label: "Otro" },
];
