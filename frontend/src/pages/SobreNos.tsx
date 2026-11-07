import { useEffect } from "react";
import { homeCards } from "../data/homeCards";
import logoNegativo from "../assets/logos/skillbridge-logo-negativo.svg";

export default function SobreNos() {
  useEffect(() => {
    document.title = "SkillBridge | Sobre Nós";
  }, []);

  const sobreNos = homeCards.find((card) => card.titulo === "SOBRE NÓS");
  const objetivo = homeCards.find((card) => card.titulo === "PROPÓSITO");

  return (
    <section className="data-page sobre-nos-page">
      {sobreNos && (
        <article className="sobre-nos-bloco">
          <div className="sobre-nos-circulo">
            <img src={logoNegativo} alt="Logo do SkillBridge" />
          </div>
          <div className="sobre-nos-texto">
            <h1>Sobre Nós</h1>
            <p>{sobreNos.texto}</p>
          </div>
        </article>
      )}

      {objetivo && (
        <article className="sobre-nos-bloco">
          <div className="sobre-nos-texto">
            <h1>Objetivo</h1>
            <p>{objetivo.texto}</p>
          </div>
          <div className="sobre-nos-circulo">
            <img src={logoNegativo} alt="Logo do SkillBridge" />
          </div>
        </article>
      )}
    </section>
  );
}
