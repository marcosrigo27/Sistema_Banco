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
      { message: "Informe um CPF (11 d\u00edgitos) ou CNPJ (14 d\u00edgitos) v\u00e1lido." }
    ),
  rg: z
    .string()
    .trim()
    .optional(),
  dataNascimento: z
    .string()
    .min(1, "A data de nascimento \u00e9 obrigat\u00f3ria.")
    .refine(
      (val) => {
        const data = new Date(`${val}T00:00:00`);
        return !isNaN(data.getTime()) && data <= new Date();
      },
      { message: "Informe uma data de nascimento v\u00e1lida e n\u00e3o futura." }
    ),
  email: z
    .string()
    .trim()
    .email("Informe um endere\u00e7o de e-mail v\u00e1lido."),
  endereco: z
    .string()
    .trim()
    .min(5, "O endere\u00e7o deve ter pelo menos 5 caracteres."),
  rendaAnual: z
    .number({ invalid_type_error: "Informe um valor num\u00e9rico v\u00e1lido." })
    .min(0, "A renda anual n\u00e3o pode ser negativa."),
  patrimonio: z
    .number({ invalid_type_error: "Informe um valor num\u00e9rico v\u00e1lido." })
    .min(0, "O patrim\u00f4nio n\u00e3o pode ser negativo."),
  estadoCivil: z.enum(["Solteiro", "Casado", "Vi\u00favo", "Divorciado"], {
    errorMap: () => ({ message: "Selecione um estado civil v\u00e1lido." }),
  }),
  codigoAgencia: z
    .number({ invalid_type_error: "Selecione uma ag\u00eancia." })
    .int()
    .positive("Selecione uma ag\u00eancia v\u00e1lida."),
});

// Infere automaticamente o tipo TypeScript dos dados do formulario a partir do schema
export type ClienteFormData = z.infer<typeof clienteSchema>;