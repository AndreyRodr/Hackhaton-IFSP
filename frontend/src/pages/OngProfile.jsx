import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function OngProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [currentUser, setCurrentUser] = useState(null);
    const [ong, setOng] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState('');

    // Estados para edição
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ nome: '', categoria: '', descricao: '' });

    // ESTADOS PARA O MODAL
    const [showModal, setShowModal] = useState(false);
    const [modalConfig, setModalConfig] = useState({ title: '', message: '' });

    const openModal = (title, message) => {
        setModalConfig({ title, message });
        setShowModal(true);
    };

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }

        const fetchOngData = async () => {
            try {
                const resOng = await axios.get(`http://localhost:3000/api/ongs/${id}`);
                setOng(resOng.data.ong);
                setFormData({
                    nome: resOng.data.ong.nome,
                    categoria: resOng.data.ong.categoria,
                    descricao: resOng.data.ong.descricao
                });
            } catch (error) {
                console.warn("API não encontrada, usando dados simulados.");
                const mockOng = {
                    id: Number(id),
                    nome: "ONG Exemplo " + id,
                    categoria: "Causa Social",
                    descricao: "Esta é uma descrição provisória porque a rota do backend ainda não foi criada.",
                    email: "contato@ongexemplo.com"
                };
                setOng(mockOng);
                setFormData({ nome: mockOng.nome, categoria: mockOng.categoria, descricao: mockOng.descricao });
            } finally {
                setPosts([
                    { id: 1, titulo: 'Campanha do Agasalho', conteudo: 'Estamos arrecadando cobertores neste inverno.', data: '10/05/2026' },
                    { id: 2, titulo: 'Adoção de Pets', conteudo: 'Neste sábado teremos feira de adoção na praça central.', data: '12/05/2026' }
                ]);
                setLoading(false);
            }
        };

        fetchOngData();
    }, [id]);

    const isOwner = currentUser?.tipo === 'ong' && currentUser?.id === Number(id);

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:3000/api/ongs/${id}`, formData, { withCredentials: true });
            setOng({ ...ong, ...formData });
            setIsEditing(false);
            openModal("Sucesso", "Perfil atualizado com sucesso!");
        } catch (error) {
            setOng({ ...ong, ...formData });
            setIsEditing(false);
            // Substituído alert pelo Modal
            openModal("Informação", "Como a API não existe, salvamos apenas visualmente!");
        }
    };

    if (loading) return <div className="container mt-5 text-center">Carregando perfil...</div>;
    if (erro) return <div className="container mt-5 alert alert-danger">{erro}</div>;
    if (!ong) return <div className="container mt-5 alert alert-warning">ONG não encontrada.</div>;

    return (
        <div style={{ backgroundColor: '#f4f4f9', minHeight: '100vh', paddingBottom: '50px' }}>
            
            {/* COMPONENTE MODAL (Renderização condicional) */}
            {showModal && (
                <>
                    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content" style={{ borderRadius: '15px', border: 'none' }}>
                                <div className="modal-header border-0">
                                    <h5 className="modal-title fw-bold text-success">{modalConfig.title}</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <p>{modalConfig.message}</p>
                                </div>
                                <div className="modal-footer border-0">
                                    <button type="button" className="btn btn-success" onClick={() => setShowModal(false)} style={{ borderRadius: '8px' }}>Entendido</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-backdrop fade show"></div>
                </>
            )}

            <nav className="navbar navbar-expand-lg navbar-dark bg-success mb-4 shadow-sm">
                <div className="container">
                    <span className="navbar-brand mb-0 h1 fw-bold">Jacaridade</span>
                    <button onClick={() => navigate('/feed')} className="btn btn-outline-light btn-sm">Voltar ao Feed</button>
                </div>
            </nav>

            <div className="container">
                <div className="row">
                    <div className="col-md-4 mb-4">
                        <div className="card shadow-sm border-0" style={{ borderRadius: '15px' }}>
                            <div className="card-body">
                                {isEditing ? (
                                    <form onSubmit={handleSave}>
                                        <div className="mb-3">
                                            <label className="form-label text-muted small">Nome da ONG</label>
                                            <input type="text" className="form-control" value={formData.nome} onChange={(e) => setFormData({...formData, nome: e.target.value})} required />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label text-muted small">Categoria</label>
                                            <input type="text" className="form-control" value={formData.categoria} onChange={(e) => setFormData({...formData, categoria: e.target.value})} required />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label text-muted small">Descrição</label>
                                            <textarea className="form-control" rows="4" value={formData.descricao} onChange={(e) => setFormData({...formData, descricao: e.target.value})} required></textarea>
                                        </div>
                                        <div className="d-grid gap-2">
                                            <button type="submit" className="btn btn-success btn-sm">Salvar Alterações</button>
                                            <button type="button" className="btn btn-light btn-sm" onClick={() => setIsEditing(false)}>Cancelar</button>
                                        </div>
                                    </form>
                                ) : (
                                    <>
                                        <div className="text-center mb-3">
                                            <div className="bg-success text-white d-inline-flex justify-content-center align-items-center rounded-circle mb-2 shadow" style={{ width: '80px', height: '80px', fontSize: '2.5rem', fontWeight: 'bold' }}>
                                                {ong.nome.charAt(0).toUpperCase()}
                                            </div>
                                            <h4 className="card-title mb-0 fw-bold">{ong.nome}</h4>
                                            <span className="badge bg-success mt-2">{ong.categoria}</span>
                                        </div>
                                        <hr />
                                        <h6 className="text-muted mb-2 fw-bold">Sobre a causa</h6>
                                        <p className="card-text small">{ong.descricao}</p>
                                        <h6 className="text-muted mt-4 mb-2 fw-bold">Contato</h6>
                                        <p className="card-text small mb-0">📧 {ong.email}</p>

                                        {isOwner && (
                                            <div className="mt-4 d-grid">
                                                <button className="btn btn-outline-success btn-sm fw-bold" onClick={() => setIsEditing(true)}>
                                                    ✏️ Editar Perfil
                                                </button>
                                            </div>
                                        )}
                                        
                                        {!isOwner && (
                                            <div className="mt-4 d-grid">
                                                <button className="btn btn-success fw-bold" onClick={() => openModal("Doação", "Chave PIX: celular da ong (12) 9999-9999")}>
                                                    Fazer uma Doação 💚
                                                </button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="col-md-8">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h3 className="mb-0 fw-bold" style={{ color: '#2c3e50' }}>Atualizações da ONG</h3>
                            {isOwner && (
                                <button className="btn btn-success btn-sm fw-bold">+ Nova Atualização</button>
                            )}
                        </div>

                        {posts.length === 0 ? (
                            <div className="card shadow-sm border-0 text-center p-5 text-muted" style={{ borderRadius: '15px' }}>
                                Esta instituição ainda não publicou atualizações.
                            </div>
                        ) : (
                            posts.map(post => (
                                <div key={post.id} className="card shadow-sm border-0 mb-4" style={{ borderRadius: '15px' }}>
                                    <div className="card-body p-4">
                                        <div className="d-flex justify-content-between align-items-start">
                                            <h5 className="card-title fw-bold text-success mb-1">{post.titulo}</h5>
                                            <span className="badge bg-light text-muted border">{post.data}</span>
                                        </div>
                                        <p className="card-text mt-3" style={{ fontSize: '1.05rem', color: '#495057' }}>{post.conteudo}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}