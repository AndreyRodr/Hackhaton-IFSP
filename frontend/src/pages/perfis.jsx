import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';

export default function Perfis() {
    const [user] = useState(() => {
        const storedUser = localStorage.getItem('user'); //localStorage como se fosse um session
        if (storedUser) {
            try {
                return JSON.parse(storedUser);
            } catch (error) {
                console.error('Erro ao processar dados do usuário:', error);
                localStorage.removeItem('user');
            }
        }
        return null;
    });

    const navigate = useNavigate(); //função para redirecionar

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    const handleLogout = () => { //se sair ele apaga a session
        localStorage.removeItem('user');
        navigate('/');
    };

    if (!user) {
        return <div className="text-center mt-5">Carregando perfil...</div>;
    }

    return (
        <div className="container d-flex justify-content-center mt-5">
            <div className="login-container w-100" style={{ maxWidth: '600px' }}>
                <div className="card p-4">
                    <h2 className="text-center mb-4">Meu Perfil</h2>
                    <div className="mb-3">
                        <p><strong>Nome:</strong> {user.nome}</p>
                        <p><strong>Tipo de acesso:</strong> {user.tipo === 'ong' ? 'ONG' : 'Usuário'}</p>
                        {user.email && <p><strong>E-mail:</strong> {user.email}</p>}
                        {user.categoria && <p><strong>Categoria:</strong> {user.categoria}</p>}
                        {user.descricao && <p><strong>Descrição:</strong> {user.descricao}</p>}
                        {user.interesses && <p><strong>Interesses:</strong> {user.interesses}</p>}
                    </div>

                    <div className="d-grid gap-2">
                        <button onClick={() => navigate('/home')} className="btn btn-primary">Voltar para Home</button>
                        <button onClick={handleLogout} className="btn btn-outline-danger">Sair</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
