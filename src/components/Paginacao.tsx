import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginacaoProps {
  paginaAtual: number;
  totalPaginas: number;
  totalRegistros: number;
  aoMudarPagina: (novaPagina: number) => void;
}

export function Paginacao({
  paginaAtual,
  totalPaginas,
  totalRegistros,
  aoMudarPagina,
}: PaginacaoProps) {
  if (totalRegistros === 0) return null;

  return (
    <nav className="paginacao" aria-label="Navegação de páginas">
      <span className="paginacao-info">
        Mostrando página <strong>{paginaAtual}</strong> de{" "}
        <strong>{totalPaginas}</strong> ({totalRegistros} clientes)
      </span>

      <div className="paginacao-botoes">
        <button
          type="button"
          className="btn-pagina"
          onClick={() => aoMudarPagina(paginaAtual - 1)}
          disabled={paginaAtual <= 1}
          aria-label="Página anterior"
        >
          <ChevronLeft size={18} aria-hidden="true" />
          <span>Anterior</span>
        </button>

        <button
          type="button"
          className="btn-pagina"
          onClick={() => aoMudarPagina(paginaAtual + 1)}
          disabled={paginaAtual >= totalPaginas}
          aria-label="Próxima página"
        >
          <span>Próxima</span>
          <ChevronRight size={18} aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
}