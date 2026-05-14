import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function PaginaUser({ currentUser }) {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [supportedOngs, setSupportedOngs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState('');

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ nome: '', interesses: '' });

    // Verifica se o usuário logado é o dono do perfil
    const isOwner = currentUser?.id === Number(id); 

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Busca os dados reais do usuário do backend
                const resUser = await axios.get(`http://localhost:3000/api/users/${id}`);
                const userData = resUser.data;
                setUser(userData);
                setFormData({
                    nome: userData.nome || '',
                    interesses: userData.interesses || ''
                });

                // Busca ONGs que o usuário apoia 
                try {
                    const resOngs = await axios.get(`http://localhost:3000/api/users/${id}/ongs`);
                    setSupportedOngs(resOngs.data);
                } catch (err) {
                    console.log('Nenhuma ONG apoiada encontrada ou erro na rota.');
                    setSupportedOngs([]);
                }

            } catch (error) {
                setErro('Erro ao carregar os dados do usuário.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [id]);

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            // Rota para atualizar os dados do usuário no backend
            await axios.put(`http://localhost:3000/api/users/${id}`, formData);
            
            setUser({ ...user, ...formData });
            setIsEditing(false);
        } catch (error) {
            setErro('Erro ao salvar as alterações.');
        }
    };

    if (loading) return <div className="container mt-5 text-center">Carregando perfil...</div>;
    if (erro) return <div className="container mt-5 alert alert-danger">{erro}</div>;
    if (!user) return <div className="container mt-5 alert alert-warning">Usuário não encontrado.</div>;

    return (
        <div className="container mt-5">
            <div className="row">
                {/* COLUNA ESQUERDA: INFORMAÇÕES DO USUÁRIO */}
                <div className="col-md-4 mb-4">
                    <div className="card shadow-sm border-0">
                        <div className="card-body">
                            {isEditing ? (
                                <form onSubmit={handleSave}>
                                    <div className="mb-3">
                                        <label className="form-label text-muted small">Nome Completo</label>
                                        <input type="text" className="form-control" value={formData.nome} onChange={(e) => setFormData({...formData, nome: e.target.value})} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label text-muted small">Interesses (Separados por vírgula)</label>
                                        <textarea className="form-control" rows="3" value={formData.interesses} onChange={(e) => setFormData({...formData, interesses: e.target.value})} required></textarea>
                                    </div>
                                    <div className="d-grid gap-2">
                                        <button type="submit" className="btn btn-success btn-sm">Salvar Alterações</button>
                                        <button type="button" className="btn btn-light btn-sm" onClick={() => setIsEditing(false)}>Cancelar</button>
                                    </div>
                                </form>
                            ) : (
                                <>
                                    <div className="text-center mb-3">
                                        <div className="bg-success text-white d-inline-flex justify-content-center align-items-center rounded-circle mb-2" style={{ width: '80px', height: '80px', fontSize: '2rem' }}>
                                            {user.nome.charAt(0).toUpperCase()}
                                        </div>
                                        <h4 className="card-title mb-0">{user.nome}</h4>
                                        <p className="text-muted small mt-1 mb-0">{user.email}</p>
                                    </div>
                                    <hr />
                                    <h6 className="text-muted mb-2">Meus Interesses</h6>
                                    <div className="mb-3">
                                        {user.interesses.split(',').map((interesse, index) => (
                                            <span key={index} className="badge bg-light text-dark border me-1 mb-1">
                                                {interesse.trim()}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Botão de Edição (Apenas para o Dono) */}
                                    {isOwner && (
                                        <div className="mt-4 d-grid">
                                            <button className="btn btn-outline-success btn-sm" onClick={() => setIsEditing(true)}>
                                                ✏️ Editar Perfil
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* COLUNA DIREITA: ONGS APOIADAS */}
                <div className="col-md-8">
                    <div className="mb-3">
                        <h3 className="mb-0">ONGs que Apoio</h3>
                    </div>

                    {supportedOngs.length === 0 ? (
                        <div className="card shadow-sm border-0 text-center p-5 text-muted">
                            Este usuário ainda não apoia nenhuma ONG.
                        </div>
                    ) : (
                        <div className="row">
                            {supportedOngs.map(ong => (
                                <div key={ong.id} className="col-md-6 mb-3">
                                    <div className="card shadow-sm border-0 h-100">
                                        <div className="card-body d-flex flex-column">
                                            <h5 className="card-title text-success">{ong.nome}</h5>
                                            <h6 className="card-subtitle mb-2 text-muted">{ong.categoria}</h6>
                                            <div className="mt-auto pt-3">
                                                <button className="btn btn-sm btn-outline-secondary w-100">{ong.btnText}</button>
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
    );
}