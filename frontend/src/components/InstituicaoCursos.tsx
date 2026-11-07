import { useEffect, useState } from "react";
import { apiRequest, decodeJson, type InstitutionStudent } from "../api";

interface Curso {
  id: number;
  nome: string;
}

export default function InstituicaoCursos() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    apiRequest<InstitutionStudent[]>("/instituicao/alunos")
      .then((alunos) => {
        const vistos = new Map<number, Curso>();
        for (const aluno of alunos) {
          const curso = decodeJson(aluno.curso);
          if (!vistos.has(curso.id)) vistos.set(curso.id, curso);
        }
        setCursos([...vistos.values()].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR")));
      })
      .catch(() => setCursos([]))
      .finally(() => setCarregando(false));
  }, []);

  if (carregando || !cursos.length) return null;

  return (
    <article className="profile-panel">
      <h2>Cursos</h2>
      <div className="tag-list">
        {cursos.map((curso) => <span key={curso.id}>{curso.nome}</span>)}
      </div>
    </article>
  );
}
