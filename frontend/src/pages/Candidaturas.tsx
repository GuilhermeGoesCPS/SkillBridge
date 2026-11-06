import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest, decodeJson, getSession, type MyApplication } from "../api";
import "../styles/candidatos-vaga.css";

type Situacao = "pendente" | "aceito" | "recusado";

const situacaoLabels: Record<Situacao, string> = {
  pendente: "Pendente",
  aceito: "Aceito",
  recusado: "Recusado",
};

function situacaoDe(aceito: boolean | null): Situacao {
  if (aceito === null || aceito === undefined) return "pendente";
  return aceito ? "aceito" : "recusado";
}

export default function Candidaturas() {
  const session = getSession();
  const [candidaturas, setCandidaturas] = useState<MyApplication[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    document.title = "SkillBridge | Candidaturas";
    if (session?.usuario.tipo !== "aluno") return;
    apiRequest<MyApplication[]>("/minhas-candidaturas")
      .then(setCandidaturas)
      .catch((error: unknown) => setMensagem(error instanceof Error ? error.message : "Não foi possível carregar suas candidaturas."))
      .finally(() => setCarregando(false));
  }, [session?.usuario.tipo]);

  if (session?.usuario.tipo !== "aluno") {
    return (
      <section className="data-page">
        <article className="profile-panel">
          <p className="eyebrow-vaga">CANDIDATURAS</p>
          <h1>Minhas Candidaturas</h1>
          <p>{session ? "Essa área é exclusiva para contas de aluno." : "Entre com uma conta de aluno para ver suas candidaturas."}</p>
          {!session && <Link className="button-primary" to="/login-aluno">Entrar como aluno</Link>}
        </article>
      </section>
    );
  }

  return (
    <section className="data-page">
      <article className="profile-panel">
        <p className="eyebrow-vaga">CANDIDATURAS</p>
        <h1>Minhas Candidaturas</h1>
      </article>
      {mensagem && <p className="status-message" role="alert">{mensagem}</p>}
      <section className="grid-vagas">
        {carregando && <p className="empty-state">Carregando candidaturas...</p>}
        {!carregando && !mensagem && !candidaturas.length && <p className="empty-state">Você ainda não se candidatou a nenhuma vaga.</p>}
        {!carregando && candidaturas.map((candidatura) => {
          const vaga = decodeJson(candidatura.vaga);
          const empresa = decodeJson(candidatura.empresa);
          const salario = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(vaga.salario));
          const situacao = situacaoDe(candidatura.aceito);
          return (
            <article className="card-vaga" key={candidatura.id}>
              <div className="content-vaga">
                <p className="eyebrow-vaga">{vaga.tipo}</p>
                <h2>{vaga.tipo} #{vaga.id}</h2>
                <p className="empresa-vaga">{empresa.nome}</p>
                <p>{salario} · {vaga.horarioInicio.slice(0, 5)} às {vaga.horarioTermino.slice(0, 5)}</p>
                <p className={`candidato-situacao candidato-situacao--${situacao}`}>{situacaoLabels[situacao]}</p>
              </div>
            </article>
          );
        })}
      </section>
    </section>
  );
}
