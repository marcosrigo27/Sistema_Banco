// Tipos literais (Union Types) garantem que apenas valores válidos sejam aceitos
export type EstadoCivil = "Solteiro" | "Casado" | "Viúvo" | "Divorciado";
export type TipoConta = "corrente" | "poupanca";

export interface Cliente {
  id: string;
  cpfCnpj: string;
  rg?: string; 
  dataNascimento: Date;
  nome: string;
  nomeSocial?: string;
  email: string;
  endereco: string;
  rendaAnual: number;
  patrimonio: number;
  estadoCivil: EstadoCivil;
  codigoAgencia: number;
}

export interface Conta {
  id: string;
  cpfCnpjCliente: string;
  tipo: TipoConta;
  saldo: number;
  limiteCredito: number;
  creditoDisponivel: number;
}

export interface Agencia {
  id: string;
  codigo: number;
  nome: string;
  endereco: string;
}