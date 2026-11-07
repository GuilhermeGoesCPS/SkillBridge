import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Candidaturas from "./pages/Candidaturas";
import Home from "./pages/Home";
import LoginAluno from "./pages/LoginAluno";
import LoginEmpresa from "./pages/LoginEmpresa";
import LoginInstituicao from "./pages/LoginInstituicao";
import CadastroAluno from "./pages/CadastroAluno";
import CadastroEmpresa from "./pages/CadastroEmpresa";
import CadastroInstituicao from "./pages/CadastroInstituicao";
import Edital from "./pages/Edital";
import Perfil from "./pages/Perfil";
import SobreNos from "./pages/SobreNos";
import Talentos from "./pages/Talentos";
import Vaga from "./pages/Vaga";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login-aluno" element={<LoginAluno />} />
        <Route path="/login-empresa" element={<LoginEmpresa />} />
        <Route path="/login-instituicao" element={<LoginInstituicao />} />
        <Route path="/cadastro-aluno" element={<CadastroAluno />} />
        <Route path="/cadastro-empresa" element={<CadastroEmpresa />} />
        <Route path="/cadastro-instituicao" element={<CadastroInstituicao />} />
        <Route path="/edital" element={<Edital />} />
        <Route path="/sobre-nos" element={<SobreNos />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/talentos" element={<Talentos />} />
        <Route path="/candidaturas" element={<Candidaturas />} />
        <Route path="/vaga" element={<Vaga />} />
      </Route>
    </Routes>
  );
}
