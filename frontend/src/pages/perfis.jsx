import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/login.css';

export default function Perfis() {
    const [storedUser] = useState(() => {
        const saved = localStorage.getItem('user');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (error) {
                console.error('Erro ao processar dados do usuário:', error);
                localStorage.removeItem('user');
            }
        }
        return null;
    });

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (!storedUser) {
            navigate('/login');
            return;
        }

        const fetchProfile = async () => {
            try {
                const path = storedUser.tipo === 'ong' ? `/api/ongs/${storedUser.id}` : `/api/users/${storedUser.id}`;
                const response = await axios.get(`http://localhost:3000${path}`);
                setProfile(response.data.user || response.data.ong);
            } catch (error) {
                setErro('Não foi possível carregar os dados do perfil.');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [storedUser, navigate]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    if (loading) return <div className="text-center mt-5">Carregando perfil...</div>;
    if (erro) return <div className="container mt-5 alert alert-danger">{erro}</div>;
    if (!profile) return <div className="container mt-5 alert alert-warning">Perfil não encontrado.</div>;

    return (
        <div style={{ backgroundColor: '#f4f4f9', minHeight: '100vh', paddingBottom: '50px' }}>
            {/* Navbar simples */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-success mb-4 shadow-sm">
                <div className="container">
                    <span className="navbar-brand mb-0 h1 fw-bold">Jacaridade</span>
                    <button onClick={() => navigate('/feed')} className="btn btn-outline-light btn-sm">Voltar ao Feed</button>
                </div>
            </nav>
            <div className="container d-flex justify-content-center mt-5">
                <div className="login-container w-100" style={{ maxWidth: '600px' }}>
                    <div className="card p-4">
                        <h2 className="text-center mb-4">Meu Perfil</h2>
                        <div className="mb-3">
                            <p><strong>Nome:</strong> {profile.nome}</p>
                            <p><strong>E-mail:</strong> {profile.email}</p>
                            <p><strong>Tipo de conta:</strong> {storedUser.tipo === 'ong' ? 'ONG' : 'Usuário'}</p>
                            {storedUser.tipo === 'ong' && profile.categoria && <p><strong>Categoria:</strong> {profile.categoria}</p>}
                            {storedUser.tipo === 'ong' && profile.descricao && <p><strong>Descrição:</strong> {profile.descricao}</p>}
                            {storedUser.tipo !== 'ong' && profile.interesses && <p><strong>Interesses:</strong> {profile.interesses}</p>}
                        </div>

                        <div className="d-grid gap-2">
                            <button onClick={() => navigate('/home')} className="btn btn-primary">Voltar para Home</button>
                            <button onClick={handleLogout} className="btn btn-outline-danger">Sair</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
