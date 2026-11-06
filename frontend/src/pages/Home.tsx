import { useEffect, useState } from "react";
import Card from "../components/Card";
import { homeCards } from "../data/homeCards";
import { apiRequest, decodeJson, type Company } from "../api";
import bannerImg from "../assets/images/banner.webp";
import logo from "../assets/logos/skillbridge-logo.svg";
import logoNegativo from "../assets/logos/skillbridge-logo-negativo.svg";

const titulosCardsFinais = ["ALUNO", "EMPRESA", "ACESSE NOSSA PLATAFORMA"];

export default function Home() {
  const [empresas, setEmpresas] = useState<Company[]>([]);
  const [carregandoEmpresas, setCarregandoEmpresas] = useState(true);

  useEffect(() => {
    document.title = "SkillBridge | Home";
  }, []);

  useEffect(() => {
    apiRequest<Company[]>("/empresas")
      .then(setEmpresas)
      .catch(() => setEmpresas([]))
      .finally(() => setCarregandoEmpresas(false));
  }, []);

  const sobre = homeCards.find((card) => card.titulo === "SOBRE NÓS");
  const cardsFinais = homeCards.filter((card) => titulosCardsFinais.includes(card.titulo));

  return (
    <>
      <section className="banner">
        <img className="banner-img" src={bannerImg} alt="Background do Banner" />
        <div className="banner-content">
          <h1>Seja bem vindo a plataforma</h1>
          <div id="logobanner">
            <img src={logo} alt="Logo do SkillBridge" />
          </div>
        </div>
      </section>

      {sobre && (
        <section className="home-sobre">
          <div className="home-sobre-circle">
            <img src={logoNegativo} alt="Logo do SkillBridge" />
          </div>
          <div className="home-sobre-content">
            <h2>Sobre</h2>
            <p>{sobre.texto}</p>
          </div>
        </section>
      )}

      <section className="home-parceiras">
        <h2>Empresas Parceiras</h2>
        {carregandoEmpresas && <p className="empty-state">Carregando empresas parceiras...</p>}
        {!carregandoEmpresas && !empresas.length && (
          <p className="empty-state">Nenhuma empresa parceira cadastrada no momento.</p>
        )}
        {!carregandoEmpresas && empresas.length > 0 && (
          <div className="tag-list">
            {empresas.map((empresa) => {
              const usuario = decodeJson(empresa.usuario);
              return <span key={empresa.id}>{usuario.nome}</span>;
            })}
          </div>
        )}
      </section>

      {cardsFinais.map((card) => (
        <Card key={card.titulo} titulo={card.titulo} texto={card.texto} botao={card.botao} />
      ))}
    </>
  );
}
