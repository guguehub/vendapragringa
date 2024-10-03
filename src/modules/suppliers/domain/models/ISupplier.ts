export interface ISupplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string; // "bairro" in Brazilian context
    city: string;
    state: string;
    cep: string; // ZIP code
  };
}
