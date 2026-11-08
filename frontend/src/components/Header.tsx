import { useEffect, useState, type FormEvent } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { clearSession, getSession, subscribeSessionChange } from "../api";
import logoNegativo from "../assets/logos/skillbridge-logo-negativo.svg";
import iconePesquisa from "../assets/icons/icone-pesquisa.svg";
import iconeUsuario from "../assets/icons/icone-usuario.svg";

function navLinkClass({ isActive }: { isActive: boolean }) {
  return isActive ? "active" : undefined;
}

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [session, setSession] = useState(getSession);

  useEffect(() => subscribeSessionChange(() => setSession(getSession())), []);

  function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = new FormData(event.currentTarget).get("q")?.toString().trim();
    if (query) navigate(`/edital?q=${encodeURIComponent(query)}`);
  }

  const mostrarVoltar = location.pathname === "/vaga";

  function voltar() {
    if (window.history.length > 1) navigate(-1);
    else navigate("/edital");
  }

  return (
    <header>
      <div className="header-start">
        <Link to="/" className="header-logo-link">
          <img className="icons" id="logo" src={logoNegativo} alt="" />
          <span className="brand-name">SkillBridge</span>
        </Link>

        <form className="search-box" onSubmit={search}>
          <img className="icons" id="pesquisa" src={iconePesquisa} alt="" />
          <input type="search" name="q" placeholder="Pesquise aqui..." aria-label="Pesquisar vagas" />
        </form>
      </div>

      {mostrarVoltar ? (
        <button type="button" className="header-voltar" onClick={voltar}>
          {"< Voltar"}
        </button>
      ) : (
        <nav>
          <NavLink to="/" end className={navLinkClass}>HOME</NavLink>
          <NavLink to="/edital" className={navLinkClass}>VAGAS</NavLink>
          {session?.usuario.tipo === "empresa" && <NavLink to="/talentos" className={navLinkClass}>BANCO DE TALENTOS</NavLink>}
          {session?.usuario.tipo === "aluno" && <NavLink to="/candidaturas" className={navLinkClass}>MINHAS CANDIDATURAS</NavLink>}
          <NavLink to="/sobre-nos" className={navLinkClass}>SOBRE NÓS</NavLink>
        </nav>
      )}

      <div className="header-actions">
        {session ? (
          <button className="header-logout" type="button" onClick={() => { clearSession(); navigate("/"); }}>Sair</button>
        ) : (
          <Link className="button-secundaryb" to="/login-aluno">Entrar</Link>
        )}
        <Link
          to={session ? "/perfil" : "/login-aluno"}
          className="avatar-circle"
          aria-label={session ? "Meu perfil" : "Entrar ou acessar perfil"}
        >
          <img className="icons" id="perfil" src={iconeUsuario} alt="" />
        </Link>
      </div>
    </header>
  );
}
