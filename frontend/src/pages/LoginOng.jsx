import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/login.css';

export default function LoginOng() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:3000/api/login-ong', { email, senha });
            localStorage.setItem('user', JSON.stringify(res.data.user));
            navigate('/home');
        } catch (error) {
            setErro(error.response?.data?.error || 'Erro ao realizar login da ONG.');
        }
    };

    return (
        <div className="container d-flex justify-content-center mt-5">
            <div className="login-container w-100" style={{ maxWidth: '400px' }}>
                <div className="card p-4">
                    <h2 className="text-center mb-4">Login da ONG</h2>
                    
                    {erro && <div className="alert alert-danger">{erro}</div>}

                    <form onSubmit={handleLogin}>
                        <div className="mb-3">
                            <label className="form-label">E-mail Corporativo</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Senha</label>
                            <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} className="form-control" required />
                        </div>
                        <div className="d-grid gap-2">
                            <button type="submit" className="btn btn-primary">Entrar como ONG</button>
                        </div>
                    </form>
                    
                    <div className="text-center mt-3">
                        <p>Sua ONG não está cadastrada? <Link to="/cadastro-ong">Cadastre aqui</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
}