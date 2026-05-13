import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/login.css';

export default function Cadastro() {
    const [formData, setFormData] = useState({ nome: '', email: '', senha: '', interesses: '' });
    const [erro, setErro] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3000/api/cadastro', formData);
            alert('Cadastro realizado com sucesso! Faça login.');
            navigate('/login');
        } catch (error) {
            setErro(error.response?.data?.error || 'Erro ao realizar cadastro.');
        }
    };

    return (
        <div className="container d-flex justify-content-center mt-5">
            <div className="login-container w-100" style={{ maxWidth: '400px' }}>
                <div className="card p-4">
                    <h2 className="text-center mb-4">Cadastro de Usuário</h2>
                    
                    {erro && <div className="alert alert-danger">{erro}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Nome Completo</label>
                            <input type="text" name="nome" onChange={handleChange} className="form-control" required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">E-mail</label>
                            <input type="email" name="email" onChange={handleChange} className="form-control" required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Senha</label>
                            <input type="password" name="senha" onChange={handleChange} className="form-control" required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Interesses (Causas)</label>
                            <input type="text" name="interesses" placeholder="Ex: Animais, Educação..." onChange={handleChange} className="form-control" />
                        </div>
                        <div className="d-grid gap-2">
                            <button type="submit" className="btn btn-primary">Criar Conta</button>
                        </div>
                    </form>
                    
                    <div className="text-center mt-3">
                        <p>Já tem conta? <Link to="/login">Entre aqui</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
}