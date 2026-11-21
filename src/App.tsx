import { useEffect, useMemo, useState } from "react";
import { Building2, Loader2, Search, UserPlus, AlertCircle, CheckCircle2 } from "lucide-react";
import type { Agencia, Cliente, Conta } from "./types/bank";
import { carregarDadosBancarios } from "./services/bankService";
import { normalizarTextoBusca } from "./utils/formatters";
import { ListaClientes } from "./components/ListaClientes";
import { Paginacao } from "./components/Paginacao";
import { DetalhesClienteModal } from "./components/DetalhesClienteModal";
import { CadastroClienteModal } from "./components/CadastroClienteModal";
import "./App.css";

const ITENS_POR_PAGINA = 10;

export function App() {
  // Estados principais dos dados
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [contas, setContas] = useState<Conta[]>([]);
  const [agencias, setAgencias] = useState<Agencia[]>([]);

  // Estados de carregamento e erro
  const [carregando, setCarregando] = useState<boolean>(true);
  const [erro, setErro] = useState<string | null>(null);

  // Estados de busca e paginacao
  const [termoBusca, setTermoBusca] = useState<string>("");
  const [paginaAtual, setPaginaAtual] = useState<number>(1);

  // Estados dos modais e feedback
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null);
  const [modalCadastroAberto, setModalCadastroAberto] = useState<boolean>(false);
  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);

  useEffect(() => {
    async function buscarDados() {
      try {
        setCarregando(true);
        setErro(null);
        const dados = await carregarDadosBancarios();
        setClientes(dados.clientes);
        setContas(dados.contas);
        setAgencias(dados.agencias);
      } catch (err) {
        const mensagem =
          err instanceof Error
            ? err.message
            : "Não foi possível carregar os dados bancários.";
        setErro(mensagem);
      } finally {
        setCarregando(false);
      }
    }

    buscarDados();
  }, []);

  // Filtra clientes por Nome, Nome Social ou CPF/CNPJ (com ou sem pontuacao)
  const clientesFiltrados = useMemo(() => {
    const buscaTexto = normalizarTextoBusca(termoBusca.trim());
    const buscaDigitos = termoBusca.replace(/\D/g, "");

    if (!buscaTexto && !buscaDigitos) {
      return clientes;
    }

    return clientes.filter((cliente) => {
      const nomeMatch = normalizarTextoBusca(cliente.nome).includes(buscaTexto);
      const nomeSocialMatch = cliente.nomeSocial
        ? normalizarTextoBusca(cliente.nomeSocial).includes(buscaTexto)
        : false;
      const cpfCnpjMatch =
        buscaDigitos.length > 0 && cliente.cpfCnpj.includes(buscaDigitos);

      return nomeMatch || nomeSocialMatch || cpfCnpjMatch;
    });
  }, [clientes, termoBusca]);

  // Calcula paginacao (maximo 10 clientes por vez)
  const totalPaginas = Math.max(1, Math.ceil(clientesFiltrados.length / ITENS_POR_PAGINA));

  const clientesPaginados = useMemo(() => {
    const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA;
    return clientesFiltrados.slice(inicio, inicio + ITENS_POR_PAGINA);
  }, [clientesFiltrados, paginaAtual]);

  function handleBuscaChange(valor: string) {
    setTermoBusca(valor);
    setPaginaAtual(1); // Volta para a primeira pagina ao filtrar
  }

  function handleCadastrarCliente(novoCliente: Cliente) {
    // Insere no inicio da lista em memoria para aparecer imediatamente na tela
    setClientes((prev) => [novoCliente, ...prev]);
    setModalCadastroAberto(false);
    setPaginaAtual(1);
    setTermoBusca("");
    setMensagemSucesso(`Cliente "${novoCliente.nome}" cadastrado com sucesso!`);

    setTimeout(() => {
      setMensagemSucesso(null);
    }, 4000);
  }

  // Cruza contas e agencia do cliente selecionado para exibir no modal de detalhes
  const contasDoClienteSelecionado = useMemo(() => {
    if (!clienteSelecionado) return [];
    return contas.filter(
      (conta) => conta.cpfCnpjCliente === clienteSelecionado.cpfCnpj
    );
  }, [clienteSelecionado, contas]);

  const agenciaDoClienteSelecionado = useMemo(() => {
    if (!clienteSelecionado) return undefined;
    return agencias.find(
      (agencia) => agencia.codigo === clienteSelecionado.codigoAgencia
    );
  }, [clienteSelecionado, agencias]);

  const cpfsExistentes = useMemo(
    () => clientes.map((c) => c.cpfCnpj),
    [clientes]
  );

  return (
    <div className="app-container">
      {/* Cabecalho Institucional */}
      <header className="app-header">
        <div className="header-conteudo">
          <div className="marca">
            <div className="marca-icone">
              <Building2 size={28} aria-hidden="true" />
            </div>
            <div>
              <h1>Sistema Bancário</h1>
              <p>Gestão de Clientes, Contas e Agências</p>
            </div>
          </div>

          <button
            type="button"
            className="btn-primario"
            onClick={() => setModalCadastroAberto(true)}
            disabled={carregando}
          >
            <UserPlus size={18} aria-hidden="true" />
            <span>Novo Cliente</span>
          </button>
        </div>
      </header>

      <main className="main-conteudo">
        {/* Banner de feedback de cadastro */}
        {mensagemSucesso && (
          <div className="alerta-sucesso" role="status">
            <CheckCircle2 size={20} aria-hidden="true" />
            <span>{mensagemSucesso}</span>
          </div>
        )}

        {/* Barra de Pesquisa e Resumo */}
        <section className="barra-ferramentas" aria-label="Filtros de pesquisa">
          <div className="campo-busca">
            <Search size={18} className="icone-busca" aria-hidden="true" />
            <label htmlFor="input-busca" className="sr-only">
              Pesquisar por nome ou CPF/CNPJ
            </label>
            <input
              id="input-busca"
              type="search"
              placeholder="Pesquisar por nome, nome social ou CPF/CNPJ..."
              value={termoBusca}
              onChange={(e) => handleBuscaChange(e.target.value)}
            />
          </div>

          {!carregando && !erro && (
            <div className="resumo-total">
              Total: <strong>{clientesFiltrados.length}</strong>{" "}
              {clientesFiltrados.length === 1 ? "cliente" : "clientes"}
            </div>
          )}
        </section>

        {/* Estados de Carregamento, Erro ou Lista */}
        {carregando ? (
          <div className="estado-central" role="status">
            <Loader2 size={36} className="spinner" aria-hidden="true" />
            <p>Carregando dados da planilha...</p>
          </div>
        ) : erro ? (
          <div className="estado-erro" role="alert">
            <AlertCircle size={36} aria-hidden="true" />
            <h2>Erro ao carregar os dados</h2>
            <p>{erro}</p>
            <button
              type="button"
              className="btn-primario"
              onClick={() => window.location.reload()}
            >
              Tentar Novamente
            </button>
          </div>
        ) : (
          <section className="card-principal" aria-label="Resultados da busca">
            <ListaClientes
              clientes={clientesPaginados}
              aoSelecionarCliente={(cliente) => setClienteSelecionado(cliente)}
            />

            <Paginacao
              paginaAtual={paginaAtual}
              totalPaginas={totalPaginas}
              totalRegistros={clientesFiltrados.length}
              aoMudarPagina={setPaginaAtual}
            />
          </section>
        )}
      </main>

      {/* Modal de Visualizacao Completa */}
      {clienteSelecionado && (
        <DetalhesClienteModal
          cliente={clienteSelecionado}
          contas={contasDoClienteSelecionado}
          agencia={agenciaDoClienteSelecionado}
          aoFechar={() => setClienteSelecionado(null)}
        />
      )}

      {/* Modal de Cadastro em Memoria */}
      {modalCadastroAberto && (
        <CadastroClienteModal
          agencias={agencias}
          cpfsExistentes={cpfsExistentes}
          aoCadastrar={handleCadastrarCliente}
          aoFechar={() => setModalCadastroAberto(false)}
        />
      )}
    </div>
  );
}

export default App;