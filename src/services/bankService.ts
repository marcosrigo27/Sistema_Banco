import Papa from "papaparse";
import type { Agencia, Cliente, Conta } from "../types/bank";
import {
  normalizarCpfCnpj,
  parseData,
  parseEstadoCivil,
  parseNumero,
  parseTipoConta,
} from "../utils/parsers";

const BASE_URL =
  "https://docs.google.com/spreadsheets/d/1LkyaeCgiyaIN1IxXnbZQPmVMIcht3PIxMDUXHsvczK0/gviz/tq?tqx=out:csv&sheet=";

const URLS = {
  clientes: `${BASE_URL}clientes`,
  contas: `${BASE_URL}contas`,
  agencias: `${BASE_URL}agencias`,
};

/**
 * Faz o fetch do CSV como texto puro e converte em linhas de objetos chave-valor.
 */
async function fetchCsv<T extends Record<string, string>>(url: string): Promise<T[]> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Erro ao carregar dados da planilha (Status: ${response.status})`);
  }

  const csvText = await response.text();

  const resultado = Papa.parse<T>(csvText, {
    header: true,          // Usa a primeira linha como nome das propriedades
    skipEmptyLines: true,  // Ignora linhas em branco no final do arquivo
    transformHeader: (header) => header.trim(), // Remove espacos acidentais nos cabecalhos
  });

  return resultado.data;
}

/**
 * Busca e normaliza todos os dados bancarios (clientes, contas e agencias) em paralelo.
 */
export async function carregarDadosBancarios(): Promise<{
  clientes: Cliente[];
  contas: Conta[];
  agencias: Agencia[];
}> {
  const [rawClientes, rawContas, rawAgencias] = await Promise.all([
    fetchCsv<Record<string, string>>(URLS.clientes),
    fetchCsv<Record<string, string>>(URLS.contas),
    fetchCsv<Record<string, string>>(URLS.agencias),
  ]);

  const clientes: Cliente[] = rawClientes
    .filter((row) => row.id || row.nome) // Descarta linhas completamente invalidas
    .map((row, index) => ({
      id: row.id?.trim() || `cli-${index + 1}`,
      cpfCnpj: normalizarCpfCnpj(row.cpfCnpj),
      rg: row.rg?.trim() || undefined,
      dataNascimento: parseData(row.dataNascimento),
      nome: row.nome?.trim() || "Nome nao informado",
      nomeSocial: row.nomeSocial?.trim() || undefined,
      email: row.email?.trim() || "",
      endereco: row.endereco?.trim() || "",
      rendaAnual: parseNumero(row.rendaAnual),
      patrimonio: parseNumero(row.patrimonio),
      estadoCivil: parseEstadoCivil(row.estadoCivil),
      codigoAgencia: parseNumero(row.codigoAgencia),
    }));

  const contas: Conta[] = rawContas
    .filter((row) => row.id || row.cpfCnpjCliente)
    .map((row, index) => ({
      id: row.id?.trim() || `conta-${index + 1}`,
      cpfCnpjCliente: normalizarCpfCnpj(row.cpfCnpjCliente),
      tipo: parseTipoConta(row.tipo),
      saldo: parseNumero(row.saldo),
      limiteCredito: parseNumero(row.limiteCredito),
      creditoDisponivel: parseNumero(row.creditoDisponivel),
    }));

  const agencias: Agencia[] = rawAgencias
    .filter((row) => row.id || row.codigo)
    .map((row, index) => ({
      id: row.id?.trim() || `ag-${index + 1}`,
      codigo: parseNumero(row.codigo),
      nome: row.nome?.trim() || "Agencia sem nome",
      endereco: row.endereco?.trim() || "",
    }));

  return { clientes, contas, agencias };
}