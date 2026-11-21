import { z } from "zod";

export const clienteSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(3, "O nome deve ter pelo menos 3 caracteres."),
  nomeSocial: z
    .string()
    .trim()
    .optional(),
  cpfCnpj: z
    .string()
    .trim()
    .refine(
      (val) => {
        const digitos = val.replace(/\D/g, "");
        return digitos.length === 11 || digitos.length === 14;
      },
      { message: "Informe um CPF (11 dígitos) ou CNPJ (14 dígitos) válido." }
    ),
  rg: z
    .string()
    .trim()
    .optional(),
  dataNascimento: z
    .string()
    .min(1, "A data de nascimento é obrigatória.")
    .refine(
      (val) => {
        const data = new Date(`${val}T00:00:00`);
        return !isNaN(data.getTime()) && data <= new Date();
      },
      { message: "Informe uma data de nascimento válida e não futura." }
    ),
  email: z
    .string()
    .trim()
    .email("Informe um endereço de e-mail válido."),
  endereco: z
    .string()
    .trim()
    .min(5, "O endereço deve ter pelo menos 5 caracteres."),
  rendaAnual: z
    .number({ invalid_type_error: "Informe um valor numérico válido." })
    .min(0, "A renda anual não pode ser negativa."),
  patrimonio: z
    .number({ invalid_type_error: "Informe um valor numérico válido." })
    .min(0, "O patrimônio não pode ser negativo."),
  estadoCivil: z.enum(["Solteiro", "Casado", "Viúvo", "Divorciado"], {
    errorMap: () => ({ message: "Selecione um estado civil válido." }),
  }),
  codigoAgencia: z
    .number({ invalid_type_error: "Selecione uma agência." })
    .int()
    .positive("Selecione uma agência válida."),
});

export type ClienteFormData = z.infer<typeof clienteSchema>;