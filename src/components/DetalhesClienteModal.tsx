import { useEffect } from "react";
import { Building2, CreditCard, User, X } from "lucide-react";
import { Agencia, Cliente, Conta } from "../types/bank";
import { formatarCpfCnpj, formatarData, formatarMoeda } from "../utils/formatters";

interface DetalhesClienteModalProps {
  cliente: Cliente;
  contas: Conta[];
  agencia?: Agencia;
  aoFechar: () => void;
}

export function DetalhesClienteModal({
  cliente,
  contas,
  agencia,
  aoFechar,
}: DetalhesClienteModalProps) {
  // Permite fechar o modal pressionando a tecla ESC (boa prática de acessibilidade)
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        aoFechar();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [aoFechar]);

  return (
    <div
      className="modal-overlay"
      onClick={aoFechar}
      role="dialog"
      aria-modal="true"
      aria-labelledby="titulo-detalhes-cliente"
    >
      <div className="modal-conteudo" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <div>
            <h2 id="titulo-detalhes-cliente">
              {cliente.nomeSocial ? cliente.nomeSocial : cliente.nome}
            </h2>
            <p className="modal-subtitulo">ID do Cliente: {cliente.id}</p>
          </div>

          <button
            type="button"
            className="btn-fechar-modal"
            onClick={aoFechar}
            aria-label="Fechar detalhes do cliente"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </header>

        <div className="modal-corpo">
          {/* Seção 1: Dados Pessoais e Financeiros */}
          <section className="detalhe-secao" aria-labelledby="secao-dados-pessoais">
            <h3 id="secao-dados-pessoais">
              <User size={18} aria-hidden="true" />
              <span>Dados Cadastrais</span>
            </h3>

            <dl className="grid-detalhes">
              <div className="item-detalhe">
                <dt>Nome Completo</dt>
                <dd>{cliente.nome}</dd>
              </div>

              <div className="item-detalhe">
                <dt>Nome Social</dt>
                <dd>{cliente.nomeSocial || "Não informado"}</dd>
              </div>

              <div className="item-detalhe">
                <dt>CPF / CNPJ</dt>
                <dd className="texto-mono">{formatarCpfCnpj(cliente.cpfCnpj)}</dd>
              </div>

              <div className="item-detalhe">
                <dt>RG</dt>
                <dd>{cliente.rg || "Não informado"}</dd>
              </div>

              <div className="item-detalhe">
                <dt>Data de Nascimento</dt>
                <dd>{formatarData(cliente.dataNascimento)}</dd>
              </div>

              <div className="item-detalhe">
                <dt>Estado Civil</dt>
                <dd>{cliente.estadoCivil}</dd>
              </div>

              <div className="item-detalhe">
                <dt>E-mail</dt>
                <dd>{cliente.email || "Não informado"}</dd>
              </div>

              <div className="item-detalhe">
                <dt>Renda Anual</dt>
                <dd>{formatarMoeda(cliente.rendaAnual)}</dd>
              </div>

              <div className="item-detalhe">
                <dt>Patrimônio</dt>
                <dd>{formatarMoeda(cliente.patrimonio)}</dd>
              </div>

              <div className="item-detalhe item-detalhe-largo">
                <dt>Endereço</dt>
                <dd>{cliente.endereco || "Não informado"}</dd>
              </div>
            </dl>
          </section>

          {/* Seção 2: Agência Vinculada */}
          <section className="detalhe-secao" aria-labelledby="secao-agencia">
            <h3 id="secao-agencia">
              <Building2 size={18} aria-hidden="true" />
              <span>Agência Vinculada</span>
            </h3>

            {agencia ? (
              <dl className="grid-detalhes">
                <div className="item-detalhe">
                  <dt>Nome da Agência</dt>
                  <dd>{agencia.nome}</dd>
                </div>

                <div className="item-detalhe">
                  <dt>Código da Agência</dt>
                  <dd>{agencia.codigo}</dd>
                </div>

                <div className="item-detalhe">
                  <dt>ID da Agência</dt>
                  <dd className="texto-mono">{agencia.id}</dd>
                </div>

                <div className="item-detalhe item-detalhe-largo">
                  <dt>Endereço da Agência</dt>
                  <dd>{agencia.endereco || "Não informado"}</dd>
                </div>
              </dl>
            ) : (
              <p className="texto-aviso">
                Agência de código {cliente.codigoAgencia} não encontrada na base de dados.
              </p>
            )}
          </section>

          {/* Seção 3: Contas Bancárias */}
          <section className="detalhe-secao" aria-labelledby="secao-contas">
            <h3 id="secao-contas">
              <CreditCard size={18} aria-hidden="true" />
              <span>Contas Bancárias ({contas.length})</span>
            </h3>

            {contas.length > 0 ? (
              <div className="lista-contas">
                {contas.map((conta) => (
                  <article key={conta.id} className="card-conta">
                    <div className="card-conta-topo">
                      <span className={`badge-conta badge-${conta.tipo}`}>
                        Conta {conta.tipo === "corrente" ? "Corrente" : "Poupança"}
                      </span>
                      <span className="texto-mono">ID: {conta.id}</span>
                    </div>

                    <dl className="grid-detalhes">
                      <div className="item-detalhe">
                        <dt>Saldo Atual</dt>
                        <dd className={conta.saldo < 0 ? "valor-negativo" : "valor-positivo"}>
                          {formatarMoeda(conta.saldo)}
                        </dd>
                      </div>

                      <div className="item-detalhe">
                        <dt>Limite de Crédito</dt>
                        <dd>{formatarMoeda(conta.limiteCredito)}</dd>
                      </div>

                      <div className="item-detalhe">
                        <dt>Crédito Disponível</dt>
                        <dd>{formatarMoeda(conta.creditoDisponivel)}</dd>
                      </div>
                    </dl>
                  </article>
                ))}
              </div>
            ) : (
              <p className="texto-aviso">
                Nenhuma conta bancária vinculada a este cliente.
              </p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}