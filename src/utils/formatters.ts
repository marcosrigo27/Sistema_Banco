/**
 * Formata uma string numerica como CPF (11 digitos) ou CNPJ (14 digitos).
 */
export function formatarCpfCnpj(valor: string): string {
  const digitos = valor.replace(/\D/g, "");

  if (digitos.length === 11) {
    return digitos.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }

  if (digitos.length === 14) {
    return digitos.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
  }

  return valor;
}

/**
 * Formata um numero para moeda brasileira (BRL).
 */
export function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
}

/**
 * Formata um objeto Date para o padrao DD/MM/AAAA.
 */
export function formatarData(data: Date): string {
  if (!(data instanceof Date) || isNaN(data.getTime())) {
    return "Data invalida";
  }

  return new Intl.DateTimeFormat("pt-BR").format(data);
}

/**
 * Remove acentos e deixa em minusculo para facilitar buscas de texto.
 */
export function normalizarTextoBusca(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}