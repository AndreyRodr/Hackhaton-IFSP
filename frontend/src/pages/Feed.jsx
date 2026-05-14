import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Feed() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    // Mock de dados: Simula as ONGs cadastradas no banco
    const ongsMock = [
        {
            id: 1,
            nome: "Amigos da Pata Jacareí",
            categoria: "Proteção Animal",
            descricao: "Resgatamos e cuidamos de animais de rua em Jacareí. Precisamos de ajuda para ração e tratamentos veterinários.",
            imagem: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=500"
        },
        {
            id: 2,
            nome: "Sopão Solidário IFSP",
            categoria: "Alimentação",
            descricao: "Distribuímos marmitas e sopas para pessoas em situação de vulnerabilidade nas madrugadas de sexta-feira.",
            imagem: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=500"
        },
        {
            id: 3,
            nome: "Educa Mais Vale",
            categoria: "Educação",
            descricao: "Oferecemos aulas de reforço e preparação para o ENEM para jovens de escolas públicas da região.",
            imagem: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=500"
        }
    ];

    useEffect(() => {
        // Verifica se o usuário está logado para poder ver o feed
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            navigate('/login');
        }
    }, [navigate]);

    if (!user) return <div className="text-center mt-5">Carregando...</div>;

    return (
        <div style={{ backgroundColor: '#f4f4f9', minHeight: '100vh', paddingBottom: '50px' }}>
            {/* Navbar simples */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-success mb-4 shadow-sm">
                <div className="container">
                    <span className="navbar-brand mb-0 h1 fw-bold">Jacaridade</span>
                    <div className="d-flex align-items-center">
                        <span className="text-white me-3 d-none d-md-block">Olá, {user.nome}</span>
                        <Link to="/user/:id" className="btn btn-outline-light btn-sm me-2">Meu Perfil</Link>
                        <button onClick={() => { localStorage.removeItem('user'); navigate('/'); }} className="btn btn-light btn-sm text-success fw-bold">Sair</button>
                    </div>
                </div>
            </nav>

            {/* Cabeçalho do Feed */}
            <div className="container">
                <div className="text-center mb-5">
                    <h2 className="fw-bold" style={{ color: '#2c3e50' }}>Explore Causas e Faça a Diferença</h2>
                    <p className="text-muted">Conheça as ONGs de Jacareí e descubra como você pode ajudar hoje.</p>
                </div>

                {/* Grid de ONGs */}
                <div className="row g-4">
                    {ongsMock.map((ong) => (
                        <div className="col-12 col-md-6 col-lg-4" key={ong.id}>
                            <div className="card h-100 shadow-sm border-0" style={{ borderRadius: '15px', overflow: 'hidden' }}>
                                <img src={ong.imagem} className="card-img-top" alt={ong.nome} style={{ height: '200px', objectFit: 'cover' }} />
                                <div className="card-body d-flex flex-column">
                                    <span className="badge bg-success mb-2 align-self-start">{ong.categoria}</span>
                                    <h5 className="card-title fw-bold text-dark">{ong.nome}</h5>
                                    <p className="card-text text-muted" style={{ fontSize: '0.9rem' }}>{ong.descricao}</p>
                                    
                                    {/* Botão alinhado sempre ao final do card */}
                                    <div className="mt-auto pt-3">
                                        <button className="btn btn-success w-100 fw-bold" onClick={() => navigate(`/ong/${ong.id}`)}>Visitar Perfil</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}