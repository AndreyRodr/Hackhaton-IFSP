import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Initial from './pages/Initial';
import Login from './pages/Login';
import LoginOng from './pages/LoginOng';
import Cadastro from './pages/Cadastro';
import CadastroOng from './pages/CadastroOng';
import Home from './pages/Home';
import Perfis from './pages/perfis'; //rotas

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Initial />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login-ong" element={<LoginOng />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/cadastro-ong" element={<CadastroOng />} />
        <Route path="/home" element={<Home />} />
        <Route path="/perfis" element={<Perfis />} /> {/* Rota para a página de perfis */}
      </Routes>
    </Router>
  );
}

export default App;