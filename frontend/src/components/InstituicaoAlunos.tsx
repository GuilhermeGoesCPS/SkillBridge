import { useEffect, useState } from "react";
import { apiRequest, decodeJson, type Course, type InstitutionStudent } from "../api";

const periodoLabels: Record<string, string> = { m: "Manhã", t: "Tarde", n: "Noite" };

export default function InstituicaoAlunos() {
  const [cursos, setCursos] = useState<Course[]>([]);
  const [cursoId, setCursoId] = useState("");
  const [alunos, setAlunos] = useState<InstitutionStudent[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    apiRequest<Course[]>("/cursos").then(setCursos).catch(() => undefined);
  }, []);

  useEffect(() => {
    setCarregando(true);
    setMensagem("");
    const path = cursoId ? `/instituicao/alunos?curso=${cursoId}` : "/instituicao/alunos";
    apiRequest<InstitutionStudent[]>(path)
      .then(setAlunos)
      .catch((error: unknown) => setMensagem(error instanceof Error ? error.message : "Não foi possível carregar os alunos."))
      .finally(() => setCarregando(false));
  }, [cursoId]);

  return (
    <article className="profile-panel">
      <h2>Meus alunos</h2>
      <div className="data-form">
        <label htmlFor="filtro-curso">Curso</label>
        <select id="filtro-curso" value={cursoId} onChange={(event) => setCursoId(event.target.value)}>
          <option value="">Todos os cursos</option>
          {cursos.map((curso) => <option key={curso.id} value={curso.id}>{curso.nome}</option>)}
        </select>
      </div>
      {mensagem && <p className="status-message" role="alert">{mensagem}</p>}
      {carregando && <p className="empty-state">Carregando alunos...</p>}
      {!carregando && !mensagem && !alunos.length && <p className="empty-state">Nenhum aluno encontrado.</p>}
      {!carregando && alunos.map((aluno) => {
        const curso = decodeJson(aluno.curso);
        const periodo = periodoLabels[aluno.periodo?.toLowerCase()] || aluno.periodo;
        return (
          <div className="application-row" key={aluno.id}>
            <h3>{aluno.nome}</h3>
            <p>RA {aluno.ra} · {periodo}</p>
            <p>{curso.nome}</p>
            <p>{aluno.contato || "Sem contato informado."}</p>
          </div>
        );
      })}
    </article>
  );
}
