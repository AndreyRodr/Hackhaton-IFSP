import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function PaginaUser() {
    const { id } = useParams();
    const navigate = useNavigate();

    // Estados
    const [userProfile, setUserProfile] = useState(null); // Dados do perfil visitado
    const [loggedInUser, setLoggedInUser] = useState(null); // Quem está logado
    const [supportedOngs, setSupportedOngs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ nome: '', interesses: '' });

    // 1. Verificar Autenticação e Dados do Perfil
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        console.log(storedUser);
        
        if (storedUser) {
            setLoggedInUser(JSON.parse(storedUser));
        } else {
            navigate('/login');
            return;
        }

        const fetchUserData = async () => {
            try {
                setLoading(true);
                // Busca os dados do usuário do perfil da URL
                // const resUser = await axios.get(`http://localhost:3000/api/users/${loggedInUser.id}`);
                // const userData = resUser.data;
                
                // setUserProfile(userData);
                // setFormData({
                //     nome: userData.nome || '',
                //     interesses: userData.interesses || ''
                // });

                // Busca ONGs que este usuário apoia 
                // try {
                //     const resOngs = await axios.get(`http://localhost:3000/api/users/${id}/ongs`);
                //     setSupportedOngs(resOngs.data);
                // } catch (err) {
                //     setSupportedOngs([]);
                // }
            } catch (error) {
                setErro('Erro ao carregar o perfil do usuário.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [id, navigate]);

    // Função de Salvar Edição
    const handleSave = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:3000/api/users/${id}`, formData);
            setUserProfile({ ...userProfile, ...formData });
            setIsEditing(false);
            // Atualiza o localStorage se o usuário editou o próprio nome
            if (loggedInUser.id === userProfile.id) {
                const updated = { ...loggedInUser, nome: formData.nome };
                localStorage.setItem('user', JSON.stringify(updated));
                setLoggedInUser(updated);
            }
        } catch (error) {
            setErro('Erro ao salvar as alterações.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    // Verificação se é o dono
    const isOwner = loggedInUser && String(loggedInUser.id) === String(id);

    if (loading) return <div className="text-center mt-5">Carregando perfil...</div>;
    if (erro) return <div className="container mt-5 alert alert-danger text-center">{erro}</div>;

    return (
        <div style={{ backgroundColor: '#f4f4f9', minHeight: '100vh', paddingBottom: '50px' }}>
            {/* Navbar Padrão */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-success mb-5 shadow-sm">
                <div className="container">
                    <Link to="/feed" className="navbar-brand mb-0 h1 fw-bold text-decoration-none">Jacaridade</Link>
                    <div className="d-flex align-items-center">
                        <span className="text-white me-3 d-none d-md-block">Olá, {loggedInUser?.nome}</span>
                        <Link to="/feed" className="btn btn-outline-light btn-sm me-2">Voltar ao Feed</Link>
                        <button onClick={handleLogout} className="btn btn-light btn-sm text-success fw-bold">Sair</button>
                    </div>
                </div>
            </nav>

            <div className="container">
                <div className="row">
                    {/* COLUNA ESQUERDA: PERFIL */}
                    <div className="col-md-4 mb-4">
                        <div className="card shadow-sm border-0" style={{ borderRadius: '15px' }}>
                            <div className="card-body p-4">
                                {isEditing ? (
                                    <form onSubmit={handleSave}>
                                        <h5 className="fw-bold mb-3">Editar Perfil</h5>
                                        <div className="mb-3">
                                            <label className="form-label text-muted small">Nome Completo</label>
                                            <input type="text" className="form-control" value={formData.nome} onChange={(e) => setFormData({...formData, nome: e.target.value})} required />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label text-muted small">Interesses</label>
                                            <textarea className="form-control" rows="3" value={formData.interesses} onChange={(e) => setFormData({...formData, interesses: e.target.value})} placeholder="Ex: Causa animal, Educação..."></textarea>
                                        </div>
                                        <div className="d-grid gap-2">
                                            <button type="submit" className="btn btn-success btn-sm fw-bold">Salvar</button>
                                            <button type="button" className="btn btn-light btn-sm" onClick={() => setIsEditing(false)}>Cancelar</button>
                                        </div>
                                    </form>
                                ) : (
                                    <>
                                        <div className="text-center mb-3">
                                            <div className="bg-success text-white d-inline-flex justify-content-center align-items-center rounded-circle mb-3 shadow-sm" style={{ width: '100px', height: '100px', fontSize: '2.5rem' }}>
                                                {loggedInUser.nome.charAt(0).toUpperCase()}
                                            </div>
                                            <h4 className="fw-bold mb-0">{loggedInUser.nome}</h4>
                                            <p className="text-muted small">{loggedInUser.email || "email@exemplo.com"}</p>
                                        </div>
                                        
                                        <hr className="my-4 text-muted" />
                                        
                                        <h6 className="fw-bold text-dark mb-2">Sobre / Interesses</h6>
                                        {/* <p className="text-muted small">
                                            {userProfile.interesses || "Nenhum interesse listado ainda."}
                                        </p> */}

                                        {isOwner && (
                                            <div className="mt-4 d-grid">
                                                <button className="btn btn-outline-success btn-sm fw-bold" onClick={() => setIsEditing(true)}>
                                                    ✏️ Editar Meu Perfil
                                                </button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* COLUNA DIREITA: ONGS */}
                    <div className="col-md-8">
                        <div className="mb-4">
                            <h3 className="fw-bold" style={{ color: '#2c3e50' }}>ONGs que Apoio</h3>
                            <p className="text-muted small">Causas que este usuário acompanha em Jacareí.</p>
                        </div>

                        {supportedOngs.length === 0 ? (
                            <div className="card shadow-sm border-0 text-center p-5 text-muted" style={{ borderRadius: '15px' }}>
                                <i className="bi bi-heart mb-3" style={{ fontSize: '2rem' }}></i>
                                <span>Ainda não apoia nenhuma causa.</span>
                            </div>
                        ) : (
                            <div className="row g-4">
                                {supportedOngs.map(ong => (
                                    <div key={ong.id} className="col-md-6">
                                        <div className="card h-100 shadow-sm border-0" style={{ borderRadius: '15px', overflow: 'hidden' }}>
                                            <div className="card-body d-flex flex-column">
                                                <span className="badge bg-success mb-2 align-self-start">{ong.categoria}</span>
                                                <h5 className="card-title fw-bold">{ong.nome}</h5>
                                                <p className="card-text text-muted small flex-grow-1">{ong.descricao?.substring(0, 80)}...</p>
                                                <div className="mt-3">
                                                    <button 
                                                        className="btn btn-sm btn-outline-success w-100 fw-bold"
                                                        onClick={() => navigate(`/ong/${ong.id}`)}
                                                    >
                                                        Ver Detalhes
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}