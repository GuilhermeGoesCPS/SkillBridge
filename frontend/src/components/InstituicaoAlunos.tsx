import { useEffect, useState } from "react";
import { apiRequest, decodeJson, type Course, type InstitutionStudent } from "../api";
import "../styles/candidatos-vaga.css";

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
      <h2>Alunos</h2>
      <div className="campo-form campo-filtro">
        <label htmlFor="filtro-curso">Filtrar por curso</label>
        <select id="filtro-curso" value={cursoId} onChange={(event) => setCursoId(event.target.value)}>
          <option value="">Todos os cursos</option>
          {cursos.map((curso) => <option key={curso.id} value={curso.id}>{curso.nome}</option>)}
        </select>
      </div>
      {mensagem && <p className="status-message" role="alert">{mensagem}</p>}
      {carregando && <p className="empty-state">Carregando alunos...</p>}
      {!carregando && !mensagem && !alunos.length && <p className="empty-state">Nenhum aluno encontrado.</p>}
      {!carregando && alunos.length > 0 && (
        <div className="table-wrap">
          <table className="table-clean">
            <thead>
              <tr>
                <th>Nome</th>
                <th>RA</th>
                <th>Curso</th>
                <th>Horário</th>
                <th>Contato</th>
              </tr>
            </thead>
            <tbody>
              {alunos.map((aluno) => {
                const curso = decodeJson(aluno.curso);
                const periodo = periodoLabels[aluno.periodo?.toLowerCase()] || aluno.periodo;
                return (
                  <tr key={aluno.id}>
                    <td className="candidato-nome">{aluno.nome}</td>
                    <td>{aluno.ra}</td>
                    <td>{curso.nome}</td>
                    <td>{periodo}</td>
                    <td>{aluno.contato || "Sem contato informado."}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </article>
  );
}
