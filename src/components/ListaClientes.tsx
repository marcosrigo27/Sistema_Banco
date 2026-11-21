import { Eye, User } from "lucide-react";
import { Cliente } from "../types/bank";
import { formatarCpfCnpj } from "../utils/formatters";

interface ListaClientesProps {
  clientes: Cliente[];
  aoSelecionarCliente: (cliente: Cliente) => void;
}

export function ListaClientes({ clientes, aoSelecionarCliente }: ListaClientesProps) {
  if (clientes.length === 0) {
    return (
      <div className="estado-vazio" role="status">
        <User size={40} aria-hidden="true" />
        <p>Nenhum cliente encontrado para os filtros informados.</p>
      </div>
    );
  }

  return (
    <div className="tabela-container">
      <table className="tabela-clientes" aria-label="Lista de clientes cadastrados">
        <thead>
          <tr>
            <th scope="col">Nome</th>
            <th scope="col">CPF / CNPJ</th>
            <th scope="col">E-mail</th>
            <th scope="col">Agência</th>
            <th scope="col" className="coluna-acoes">
              Ações
            </th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente) => (
            <tr
              key={cliente.id}
              onClick={() => aoSelecionarCliente(cliente)}
              className="linha-clicavel"
            >
              <td>
                <div className="nome-principal">
                  {cliente.nomeSocial ? cliente.nomeSocial : cliente.nome}
                </div>
                {cliente.nomeSocial && (
                  <div className="nome-registro">Registro: {cliente.nome}</div>
                )}
              </td>
              <td className="texto-mono">{formatarCpfCnpj(cliente.cpfCnpj)}</td>
              <td>{cliente.email || "-"}</td>
              <td>
                <span className="badge-agencia">Ag. {cliente.codigoAgencia}</span>
              </td>
              <td className="coluna-acoes">
                <button
                  type="button"
                  className="btn-detalhes"
                  onClick={(e) => {
                    e.stopPropagation();
                    aoSelecionarCliente(cliente);
                  }}
                  aria-label={`Ver detalhes de ${cliente.nome}`}
                >
                  <Eye size={16} aria-hidden="true" />
                  <span>Detalhes</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}