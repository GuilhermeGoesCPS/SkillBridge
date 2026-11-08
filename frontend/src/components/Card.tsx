import { Link } from "react-router-dom";
import type { HomeCard } from "../data/homeCards";

export default function Card({ titulo, texto, botao }: HomeCard) {
  const destaque = titulo === "ACESSE NOSSA PLATAFORMA";

  return (
    <section className={destaque ? "card card--cta" : "card"}>
      <div className="content-info">
        <h2>{titulo}</h2>
        <p>{texto}</p>
        {botao && (
          <Link className={destaque ? "button-primaryb" : "button-primary"} to={botao.href}>
            {botao.texto}
          </Link>
        )}
      </div>
    </section>
  );
}
