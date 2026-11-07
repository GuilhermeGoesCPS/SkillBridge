import { useEffect, useState } from "react";
import { apiRequest, decodeJson, type ApplicationCandidate, type VacancyApplications } from "../api";
import "../styles/candidatos-vaga.css";

interface CandidatosVagaProps {
  vagaId: number;
}

const periodoLabels: Record<string, string> = { m: "Manhã", t: "Tarde", n: "Noite" };

type Situacao = "pendente" | "aceito" | "recusado";

const situacaoLabels: Record<Situacao, string> = {
  pendente: "Pendente",
  aceito: "Aceito",
  recusado: "Recusado",
};

function situacaoDe(aceito: boolean | number | null): Situacao {
  if (aceito === null || aceito === undefined) return "pendente";
  if (aceito === true || aceito === 1) return "aceito";
  return "recusado";
}

export default function CandidatosVaga({ vagaId }: CandidatosVagaProps) {
  const [candidatos, setCandidatos] = useState<ApplicationCandidate[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [mensagem, setMensagem] = useState("");
  const [atualizandoId, setAtualizandoId] = useState<number | null>(null);

  useEffect(() => {
    setCarregando(true);
    setMensagem("");
    apiRequest<VacancyApplications>(`/candidaturas/${vagaId}`)
      .then((resposta) => setCandidatos(resposta.candidaturas))
      .catch((error: unknown) => setMensagem(error instanceof Error ? error.message : "Não foi possível carregar os candidatos."))
      .finally(() => setCarregando(false));
  }, [vagaId]);

  async function responder(candidaturaId: number, aceito: boolean) {
    setAtualizandoId(candidaturaId);
    setMensagem("");
    try {
      const resposta = await apiRequest<{ id: number; vagaId: number; alunoId: number; aceito: boolean }>(
        `/candidaturas/${candidaturaId}/status`,
        { method: "PATCH", body: JSON.stringify({ aceito }) },
      );
      setCandidatos((prev) =>
        prev.map((candidato) => (candidato.id === candidaturaId ? { ...candidato, aceito: resposta.aceito } : candidato)),
      );
    } catch (error) {
      setMensagem(error instanceof Error ? error.message : "Não foi possível atualizar a candidatura.");
    } finally {
      setAtualizandoId(null);
    }
  }

  if (carregando) return <p className="empty-state">Carregando candidatos...</p>;
  if (!candidatos.length) {
    return mensagem ? <p className="status-message" role="alert">{mensagem}</p> : <p className="empty-state">Nenhum candidato até o momento.</p>;
  }

  return (
    <div className="candidatos-vaga">
      {mensagem && <p className="status-message" role="alert">{mensagem}</p>}
      {candidatos.map((candidato) => {
        const aluno = decodeJson(candidato.aluno);
        const curso = decodeJson(aluno.curso);
        const periodo = periodoLabels[aluno.periodo?.toLowerCase()] || aluno.periodo;
        const situacao = situacaoDe(candidato.aceito);
        const atualizando = atualizandoId === candidato.id;
        return (
          <div className="candidato-row" key={candidato.id}>
            <p className="candidato-nome">{aluno.nome}</p>
            <p>{curso.nome} · {periodo}</p>
            <p>{aluno.contato || "Sem contato informado."}</p>
            <p className={`candidato-situacao candidato-situacao--${situacao}`}>{situacaoLabels[situacao]}</p>
            <div className="candidato-acoes">
              <button type="button" className="button-primary" disabled={atualizando} onClick={() => responder(candidato.id, true)}>
                Aceitar
              </button>
              <button type="button" className="button-destructive" disabled={atualizando} onClick={() => responder(candidato.id, false)}>
                Recusar
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
