import { Link } from "react-router-dom";
import { decodeJson, type Vacancy } from "../api";

interface JobCardProps {
  vaga: Vacancy;
}

function formatarSalario(valor: number | string) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(valor));
}

export default function JobCard({ vaga }: JobCardProps) {
  const empresa = decodeJson(vaga.empresa);
  const tags = decodeJson(vaga.tags);

  return (
    <article className="card-vaga">
      <div className="content-vaga">
        <p className="eyebrow-vaga">{vaga.tipo}</p>
        <h2>{vaga.tipo} #{vaga.id}</h2>

        <div className="empresa-vaga-linha">
          <span className="empresa-avatar" aria-hidden="true">{empresa.nome ? empresa.nome.charAt(0).toUpperCase() : "?"}</span>
          <p className="empresa-vaga">{empresa.nome}</p>
        </div>

        <p>{vaga.descricao || "Descrição não informada."}</p>

        <div className="tag-list">
          {tags.map((tag) => <span key={tag.id}>{tag.nome}</span>)}
        </div>

        <div className="card-vaga-rodape">
          <p className="card-vaga-info">
            {formatarSalario(vaga.salario)} · {vaga.horarioInicio.slice(0, 5)} às {vaga.horarioTermino.slice(0, 5)}
          </p>
          <Link className="button-primary" to={`/vaga?id=${vaga.id}`}>Ver vaga</Link>
        </div>
      </div>
    </article>
  );
}
