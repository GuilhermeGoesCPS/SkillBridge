import { useEffect, useState } from "react";
import { apiRequest, decodeJson, type InstitutionAcceptedApplication } from "../api";
import "../styles/candidatos-vaga.css";

const periodoLabels: Record<string, string> = { m: "Manhã", t: "Tarde", n: "Noite" };

export default function InstituicaoCandidaturas() {
  const [candidaturas, setCandidaturas] = useState<InstitutionAcceptedApplication[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    apiRequest<InstitutionAcceptedApplication[]>("/instituicao/candidaturas")
      .then(setCandidaturas)
      .catch((error: unknown) => setMensagem(error instanceof Error ? error.message : "Não foi possível carregar as candidaturas aceitas."))
      .finally(() => setCarregando(false));
  }, []);

  return (
    <article className="profile-panel">
      <h2>Candidaturas aceitas</h2>
      {mensagem && <p className="status-message" role="alert">{mensagem}</p>}
      {carregando && <p className="empty-state">Carregando candidaturas...</p>}
      {!carregando && !mensagem && !candidaturas.length && <p className="empty-state">Nenhuma candidatura aceita até o momento.</p>}
      {!carregando && candidaturas.length > 0 && (
        <div className="table-wrap">
          <table className="table-clean">
            <thead>
              <tr>
                <th>Aluno</th>
                <th>RA</th>
                <th>Vaga</th>
                <th>Empresa</th>
                <th>Salário</th>
                <th>Horário</th>
              </tr>
            </thead>
            <tbody>
              {candidaturas.map((item) => {
                const aluno = decodeJson(item.aluno);
                const vaga = decodeJson(item.vaga);
                const empresa = decodeJson(item.empresa);
                const periodo = periodoLabels[aluno.periodo?.toLowerCase()] || aluno.periodo;
                return (
                  <tr key={item.id}>
                    <td className="candidato-nome">{aluno.nome}</td>
                    <td>{aluno.ra}</td>
                    <td>{vaga.tipo} #{vaga.id}</td>
                    <td>{empresa.nome}</td>
                    <td>R$ {Number(vaga.salario).toFixed(2)}</td>
                    <td>{vaga.horarioInicio?.slice(0, 5)}–{vaga.horarioTermino?.slice(0, 5)} · {periodo}</td>
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
