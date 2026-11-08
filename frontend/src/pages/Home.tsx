import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "../components/Card";
import JobCard from "../components/JobCard";
import { homeCards } from "../data/homeCards";
import { apiRequest, decodeJson, type Company, type Vacancy } from "../api";
import logoNegativo from "../assets/logos/skillbridge-logo-negativo.svg";

const titulosCardsFinais = ["ALUNO", "EMPRESA", "ACESSE NOSSA PLATAFORMA"];

export default function Home() {
  const navigate = useNavigate();
  const [empresas, setEmpresas] = useState<Company[]>([]);
  const [carregandoEmpresas, setCarregandoEmpresas] = useState(true);
  const [vagasDestaque, setVagasDestaque] = useState<Vacancy[]>([]);
  const [carregandoVagas, setCarregandoVagas] = useState(true);

  useEffect(() => {
    document.title = "SkillBridge | Home";
  }, []);

  useEffect(() => {
    apiRequest<Company[]>("/empresas")
      .then(setEmpresas)
      .catch(() => setEmpresas([]))
      .finally(() => setCarregandoEmpresas(false));
  }, []);

  useEffect(() => {
    apiRequest<Vacancy[]>("/vagas")
      .then((vagas) => setVagasDestaque(vagas.slice(0, 2)))
      .catch(() => setVagasDestaque([]))
      .finally(() => setCarregandoVagas(false));
  }, []);

  function buscar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const termo = new FormData(event.currentTarget).get("q")?.toString().trim();
    navigate(termo ? `/edital?q=${encodeURIComponent(termo)}` : "/edital");
  }

  const sobre = homeCards.find((card) => card.titulo === "SOBRE NÓS");
  const cardsFinais = homeCards.filter((card) => titulosCardsFinais.includes(card.titulo));

  return (
    <>
      <section className="hero">
        <div className="hero-grid">
          <div className="hero-content">
            <p className="hero-eyebrow">OPORTUNIDADES PARA ALUNOS DO CENTRO PAULA SOUZA</p>
            <h1>Seu primeiro passo no mercado, no horário que cabe na sua rotina.</h1>
            <p className="hero-subtitle">
              Encontre estágio, aprendizagem e emprego compatíveis com a sua jornada acadêmica, e seja
              encontrado por empresas que buscam talentos em formação.
            </p>
            <form className="hero-search" onSubmit={buscar}>
              <input type="search" name="q" placeholder="Cargo, empresa ou competência" aria-label="Pesquisar vagas" />
              <button type="submit" className="hero-search-submit">Buscar vagas</button>
            </form>
          </div>

          {sobre && (
            <div className="hero-card">
              <div className="hero-card-icon">
                <img src={logoNegativo} alt="" />
              </div>
              <h2>Conectando alunos e empresas</h2>
              <p>{sobre.texto}</p>
              <Link className="button-primary" to="/cadastro-aluno">Criar meu perfil</Link>
            </div>
          )}
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

      <section className="home-destaque">
        <div className="home-destaque-topo">
          <div>
            <p className="eyebrow-vaga">OPORTUNIDADES</p>
            <h2>Vagas em destaque</h2>
          </div>
          <Link className="button-secundary" to="/edital">Ver todas as vagas</Link>
        </div>
        <div className="grid-vagas">
          {carregandoVagas && <p className="empty-state">Carregando vagas em destaque...</p>}
          {!carregandoVagas && vagasDestaque.length === 0 && (
            <p className="empty-state">Nenhuma vaga publicada no momento.</p>
          )}
          {!carregandoVagas && vagasDestaque.map((vaga) => <JobCard key={vaga.id} vaga={vaga} />)}
        </div>
      </section>

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
