import { EstadoCivil, TipoConta } from "../types/bank";

/**
 * Converte strings numericas (ex: "1.250,50", "R$ 500,00" ou "1250.50") em number valido.
 * Retorna 0 caso o valor seja vazio ou invalido.
 */
export function parseNumero(valor: unknown): number {
  if (typeof valor === "number") return isNaN(valor) ? 0 : valor;
  if (!valor || typeof valor !== "string") return 0;

  // Remove "R$", espacos e caracteres nao numericos exceto ponto, virgula e sinal negativo
  let limpo = valor.replace(/[^\d.,-]/g, "").trim();

  // Se houver virgula e ponto (ex: "1.500,75"), remove os pontos de milhar e troca virgula por ponto
  if (limpo.includes(",") && limpo.includes(".")) {
    limpo = limpo.replace(/\./g, "").replace(",", ".");
  } else if (limpo.includes(",")) {
    // Se houver apenas virgula (ex: "1500,75"), troca por ponto
    limpo = limpo.replace(",", ".");
  }

  const numero = Number(limpo);
  return isNaN(numero) ? 0 : numero;
}

/**
 * Converte string de data (DD/MM/AAAA ou AAAA-MM-DD) para objeto Date.
 */
export function parseData(valor: unknown): Date {
  if (!valor || typeof valor !== "string") return new Date();

  const limpo = valor.trim();

  // Formato brasileiro: DD/MM/AAAA
  if (limpo.includes("/")) {
    const [dia, mes, ano] = limpo.split("/").map(Number);
    if (dia && mes && ano) {
      return new Date(ano, mes - 1, dia);
    }
  }

  // Formato ISO: AAAA-MM-DD (adiciona T00:00:00 para evitar problemas de fuso horario)
  const dataIso = new Date(limpo.includes("T") ? limpo : `${limpo}T00:00:00`);
  return isNaN(dataIso.getTime()) ? new Date() : dataIso;
}

/**
 * Mantem apenas os digitos de um CPF/CNPJ e restaura zeros a esquerda
 * caso a planilha tenha removido (11 digitos para CPF, 14 para CNPJ).
 */
export function normalizarCpfCnpj(valor: unknown): string {
  if (!valor) return "";
  const apenasDigitos = String(valor).replace(/\D/g, "");

  if (apenasDigitos.length > 0 && apenasDigitos.length <= 11) {
    return apenasDigitos.padStart(11, "0");
  }
  if (apenasDigitos.length > 11 && apenasDigitos.length <= 14) {
    return apenasDigitos.padStart(14, "0");
  }
  return apenasDigitos;
}

/**
 * Normaliza o estado civil para corresponder estritamente ao tipo EstadoCivil.
 */
export function parseEstadoCivil(valor: unknown): EstadoCivil {
  const texto = String(valor ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  if (texto.startsWith("casad")) return "Casado";
  if (texto.startsWith("viuv")) return "Vi\u00favo";
  if (texto.startsWith("divorciad")) return "Divorciado";
  return "Solteiro";
}

/**
 * Normaliza o tipo de conta para "corrente" ou "poupanca".
 */
export function parseTipoConta(valor: unknown): TipoConta {
  const texto = String(valor ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // Remove acentos ("poupanca")

  return texto === "poupanca" ? "poupanca" : "corrente";
}