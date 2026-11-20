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
    <nav className="paginacao" aria-label="Navega\u00e7\u00e3o de p\u00e1ginas">
      <span className="paginacao-info">
        Mostrando p\u00e1gina <strong>{paginaAtual}</strong> de{" "}
        <strong>{totalPaginas}</strong> ({totalRegistros} clientes)
      </span>

      <div className="paginacao-botoes">
        <button
          type="button"
          className="btn-pagina"
          onClick={() => aoMudarPagina(paginaAtual - 1)}
          disabled={paginaAtual <= 1}
          aria-label="P\u00e1gina anterior"
        >
          <ChevronLeft size={18} aria-hidden="true" />
          <span>Anterior</span>
        </button>

        <button
          type="button"
          className="btn-pagina"
          onClick={() => aoMudarPagina(paginaAtual + 1)}
          disabled={paginaAtual >= totalPaginas}
          aria-label="Pr\u00f3xima p\u00e1gina"
        >
          <span>Pr\u00f3xima</span>
          <ChevronRight size={18} aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
}