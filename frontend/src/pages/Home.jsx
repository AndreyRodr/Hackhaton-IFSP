import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
    // 1. Lemos o localStorage DIRETO na criação do estado
    const [user] = useState(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                return JSON.parse(storedUser);
            } catch (error) {
                console.error("Erro ao processar dados do usuário:", error);
                localStorage.removeItem('user');
                return null; // Retorna nulo se o JSON estiver quebrado
            }
        }
        return null; // Retorna nulo se não houver usuário logado
    });

    const navigate = useNavigate();

    // 2. O useEffect agora serve APENAS para fazer o redirecionamento
    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    // Previne renderização enquanto o redirecionamento acontece
    if (!user) return <div className="text-center mt-5">Carregando painel...</div>;

    return (
        <div style={{ backgroundColor: '#f4f4f9', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div className="container" style={{ maxWidth: '600px' }}>
                <div className="card p-5 text-center shadow-sm" style={{ borderRadius: '12px' }}>
                    <h1 style={{ color: '#2c3e50' }}>Área Logada - Hackathon Ada Lovelace</h1>
                    
                    <div className="mt-4 mb-4">
                        <p style={{ fontSize: '1.2rem', color: '#7f8c8d' }}>
                            Bem-vindo(a), <strong>{user.nome}</strong>!
                        </p>
                        <span className={`badge ${user.tipo === 'ong' ? 'bg-secondary' : 'bg-primary'} p-2`} style={{ fontSize: '1rem' }}>
                            Acesso: {user.tipo === 'ong' ? 'Instituição (ONG)' : 'Doador/Voluntário'}
                        </span>
                    </div>

                    <div className="d-grid gap-2 mt-3">
                        <button onClick={handleLogout} className="btn btn-outline-danger">Sair do Sistema</button>
                    </div>
                </div>
            </div>
        </div>
    );
}