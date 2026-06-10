export interface IGetCustomersResponse {
  id: number;
  name: string;
  cpf: string | null;
  cnpj: string | null;
  phone: string;
  email: string;
  created_at: string;
}

type BaseCustomer = {
  id?: number;
  phone: string;
  email: string;
  name: string;
};

type NameOrCnpj = 
  | { cpf: string; cnpj?: never }
  | { cnpj: string; cpf?: never };

export type IUpsertCustomer = BaseCustomer & NameOrCnpj;