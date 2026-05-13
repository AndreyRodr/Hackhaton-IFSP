import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/login.css';

export default function CadastroOng() {
    const [formData, setFormData] = useState({ nome: '', email: '', senha: '', categoria: '', descricao: '' });
    const [erro, setErro] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3000/api/cadastro-ong', formData);
            alert('ONG cadastrada com sucesso! Faça login.');
            navigate('/login-ong');
        } catch (error) {
            setErro(error.response?.data?.error || 'Erro ao cadastrar a ONG.');
        }
    };

    return (
        <div className="container d-flex justify-content-center mt-4 mb-4">
            <div className="login-container w-100" style={{ maxWidth: '500px' }}>
                <div className="card p-4">
                    <h2 className="text-center mb-4">Cadastro de ONG</h2>
                    
                    {erro && <div className="alert alert-danger">{erro}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Nome da ONG</label>
                            <input type="text" name="nome" onChange={handleChange} className="form-control" required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">E-mail de Contato</label>
                            <input type="email" name="email" onChange={handleChange} className="form-control" required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Senha</label>
                            <input type="password" name="senha" onChange={handleChange} className="form-control" required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Categoria Principal</label>
                            <input type="text" name="categoria" placeholder="Ex: Proteção Animal, Cestas Básicas" onChange={handleChange} className="form-control" required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Breve Descrição da Missão</label>
                            <textarea name="descricao" rows="3" onChange={handleChange} className="form-control" required></textarea>
                        </div>
                        <div className="d-grid gap-2">
                            <button type="submit" className="btn btn-secondary">Cadastrar Instituição</button>
                        </div>
                    </form>
                    
                    <div className="text-center mt-3">
                        <p>Já cadastrou sua ONG? <Link to="/login-ong">Faça login</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
}