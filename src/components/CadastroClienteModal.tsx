import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus, X } from "lucide-react";
import { Agencia, Cliente } from "../types/bank";
import { ClienteFormData, clienteSchema } from "../schemas/clienteSchema";
import { normalizarCpfCnpj } from "../utils/parsers";

interface CadastroClienteModalProps {
  agencias: Agencia[];
  cpfsExistentes: string[];
  aoCadastrar: (novoCliente: Cliente) => void;
  aoFechar: () => void;
}

export function CadastroClienteModal({
  agencias,
  cpfsExistentes,
  aoCadastrar,
  aoFechar,
}: CadastroClienteModalProps) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ClienteFormData>({
    resolver: zodResolver(clienteSchema),
    defaultValues: {
      estadoCivil: "Solteiro",
      rendaAnual: 0,
      patrimonio: 0,
      codigoAgencia: agencias[0]?.codigo ?? 0,
    },
  });

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        aoFechar();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [aoFechar]);

  function onSubmit(dados: ClienteFormData) {
    const cpfCnpjLimpo = normalizarCpfCnpj(dados.cpfCnpj);

    if (cpfsExistentes.includes(cpfCnpjLimpo)) {
      setError("cpfCnpj", {
        type: "manual",
        message: "Já existe um cliente cadastrado com este CPF/CNPJ.",
      });
      return;
    }

    const novoCliente: Cliente = {
      id: crypto.randomUUID(),
      nome: dados.nome.trim(),
      nomeSocial: dados.nomeSocial?.trim() || undefined,
      cpfCnpj: cpfCnpjLimpo,
      rg: dados.rg?.trim() || undefined,
      dataNascimento: new Date(`${dados.dataNascimento}T00:00:00`),
      email: dados.email.trim(),
      endereco: dados.endereco.trim(),
      rendaAnual: dados.rendaAnual,
      patrimonio: dados.patrimonio,
      estadoCivil: dados.estadoCivil,
      codigoAgencia: dados.codigoAgencia,
    };

    aoCadastrar(novoCliente);
  }

  return (
    <div
      className="modal-overlay"
      onClick={aoFechar}
      role="dialog"
      aria-modal="true"
      aria-labelledby="titulo-cadastro-cliente"
    >
      <div className="modal-conteudo" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <div className="titulo-com-icone">
            <UserPlus size={22} aria-hidden="true" />
            <h2 id="titulo-cadastro-cliente">Cadastrar Novo Cliente</h2>
          </div>

          <button
            type="button"
            className="btn-fechar-modal"
            onClick={aoFechar}
            aria-label="Fechar formulário de cadastro"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="form-cadastro" noValidate>
          <div className="modal-corpo">
            <div className="grid-formulario">
              {/* Nome */}
              <div className="campo-grupo">
                <label htmlFor="nome">Nome Completo *</label>
                <input
                  id="nome"
                  type="text"
                  placeholder="Ex: Maria da Silva"
                  aria-invalid={!!errors.nome}
                  {...register("nome")}
                />
                {errors.nome && (
                  <span className="mensagem-erro" role="alert">
                    {errors.nome.message}
                  </span>
                )}
              </div>

              {/* Nome Social */}
              <div className="campo-grupo">
                <label htmlFor="nomeSocial">Nome Social (opcional)</label>
                <input
                  id="nomeSocial"
                  type="text"
                  placeholder="Como prefere ser chamado(a)"
                  {...register("nomeSocial")}
                />
              </div>

              {/* CPF / CNPJ */}
              <div className="campo-grupo">
                <label htmlFor="cpfCnpj">CPF ou CNPJ *</label>
                <input
                  id="cpfCnpj"
                  type="text"
                  placeholder="Somente números ou formatado"
                  aria-invalid={!!errors.cpfCnpj}
                  {...register("cpfCnpj")}
                />
                {errors.cpfCnpj && (
                  <span className="mensagem-erro" role="alert">
                    {errors.cpfCnpj.message}
                  </span>
                )}
              </div>

              {/* RG */}
              <div className="campo-grupo">
                <label htmlFor="rg">RG (opcional)</label>
                <input
                  id="rg"
                  type="text"
                  placeholder="Ex: 1234567-ES"
                  {...register("rg")}
                />
              </div>

              {/* Data de Nascimento */}
              <div className="campo-grupo">
                <label htmlFor="dataNascimento">Data de Nascimento *</label>
                <input
                  id="dataNascimento"
                  type="date"
                  aria-invalid={!!errors.dataNascimento}
                  {...register("dataNascimento")}
                />
                {errors.dataNascimento && (
                  <span className="mensagem-erro" role="alert">
                    {errors.dataNascimento.message}
                  </span>
                )}
              </div>

              {/* Estado Civil */}
              <div className="campo-grupo">
                <label htmlFor="estadoCivil">Estado Civil *</label>
                <select
                  id="estadoCivil"
                  aria-invalid={!!errors.estadoCivil}
                  {...register("estadoCivil")}
                >
                  <option value="Solteiro">Solteiro</option>
                  <option value="Casado">Casado</option>
                  <option value="Viúvo">Viúvo</option>
                  <option value="Divorciado">Divorciado</option>
                </select>
                {errors.estadoCivil && (
                  <span className="mensagem-erro" role="alert">
                    {errors.estadoCivil.message}
                  </span>
                )}
              </div>

              {/* E-mail */}
              <div className="campo-grupo">
                <label htmlFor="email">E-mail *</label>
                <input
                  id="email"
                  type="email"
                  placeholder="cliente@email.com"
                  aria-invalid={!!errors.email}
                  {...register("email")}
                />
                {errors.email && (
                  <span className="mensagem-erro" role="alert">
                    {errors.email.message}
                  </span>
                )}
              </div>

              {/* Agência */}
              <div className="campo-grupo">
                <label htmlFor="codigoAgencia">Agência *</label>
                <select
                  id="codigoAgencia"
                  aria-invalid={!!errors.codigoAgencia}
                  {...register("codigoAgencia", { valueAsNumber: true })}
                >
                  {agencias.length === 0 && (
                    <option value={0}>Nenhuma agência disponível</option>
                  )}
                  {agencias.map((ag) => (
                    <option key={ag.id} value={ag.codigo}>
                      {ag.codigo} - {ag.nome}
                    </option>
                  ))}
                </select>
                {errors.codigoAgencia && (
                  <span className="mensagem-erro" role="alert">
                    {errors.codigoAgencia.message}
                  </span>
                )}
              </div>

              {/* Renda Anual */}
              <div className="campo-grupo">
                <label htmlFor="rendaAnual">Renda Anual (R$) *</label>
                <input
                  id="rendaAnual"
                  type="number"
                  step="0.01"
                  min="0"
                  aria-invalid={!!errors.rendaAnual}
                  {...register("rendaAnual", { valueAsNumber: true })}
                />
                {errors.rendaAnual && (
                  <span className="mensagem-erro" role="alert">
                    {errors.rendaAnual.message}
                  </span>
                )}
              </div>

              {/* Patrimônio */}
              <div className="campo-grupo">
                <label htmlFor="patrimonio">Patrimônio (R$) *</label>
                <input
                  id="patrimonio"
                  type="number"
                  step="0.01"
                  min="0"
                  aria-invalid={!!errors.patrimonio}
                  {...register("patrimonio", { valueAsNumber: true })}
                />
                {errors.patrimonio && (
                  <span className="mensagem-erro" role="alert">
                    {errors.patrimonio.message}
                  </span>
                )}
              </div>

              {/* Endereço */}
              <div className="campo-grupo campo-largo">
                <label htmlFor="endereco">Endereço Completo *</label>
                <input
                  id="endereco"
                  type="text"
                  placeholder="Rua, número, bairro, cidade - UF"
                  aria-invalid={!!errors.endereco}
                  {...register("endereco")}
                />
                {errors.endereco && (
                  <span className="mensagem-erro" role="alert">
                    {errors.endereco.message}
                  </span>
                )}
              </div>
            </div>
          </div>

          <footer className="modal-footer">
            <button type="button" className="btn-secundario" onClick={aoFechar}>
              Cancelar
            </button>
            <button type="submit" className="btn-primario">
              Salvar Cliente
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}