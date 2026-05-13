import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/login.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:3000/api/login', { email, senha });
            localStorage.setItem('user', JSON.stringify(res.data.user));
            navigate('/home');
        } catch (error) {
            setErro(error.response?.data?.error || 'Erro ao realizar login.');
        }
    };

    return (
        <div className="container d-flex justify-content-center mt-5">
            <div className="login-container w-100" style={{ maxWidth: '400px' }}>
                <div className="card p-4">
                    <h2 className="text-center mb-4">Login de Usuário</h2>
                    
                    {erro && <div className="alert alert-danger">{erro}</div>}

                    <form onSubmit={handleLogin}>
                        <div className="mb-3">
                            <label className="form-label">E-mail</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Senha</label>
                            <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} className="form-control" required />
                        </div>
                        <div className="d-grid gap-2">
                            <button type="submit" className="btn btn-primary">Acessar Sistema</button>
                        </div>
                    </form>
                    
                    <div className="text-center mt-3">
                        <p>Não tem conta? <Link to="/cadastro">Cadastre-se aqui</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
}