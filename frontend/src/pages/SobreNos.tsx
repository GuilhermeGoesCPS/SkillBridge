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
    <>
      <section className="page-header">
        <h1>Sobre Nós</h1>
        <p>Conheça a plataforma e o que nos move.</p>
      </section>

      <section className="data-page sobre-nos-page">
        {sobreNos && (
          <article className="sobre-nos-bloco">
            <div className="sobre-nos-circulo">
              <img src={logoNegativo} alt="" />
            </div>
            <div className="sobre-nos-texto">
              <h2>Sobre nós</h2>
              <p>{sobreNos.texto}</p>
            </div>
          </article>
        )}

        {objetivo && (
          <article className="sobre-nos-bloco">
            <div className="sobre-nos-texto">
              <h2>Objetivo</h2>
              <p>{objetivo.texto}</p>
            </div>
            <div className="sobre-nos-circulo">
              <img src={logoNegativo} alt="" />
            </div>
          </article>
        )}
      </section>
    </>
  );
}
