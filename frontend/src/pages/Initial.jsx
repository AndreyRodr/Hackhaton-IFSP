import { Link } from 'react-router-dom';
import '../styles/login.css';

export default function Initial() {
    return (
        <div style={{ backgroundColor: '#f4f4f9', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="card p-4" style={{ width: '100%', maxWidth: '480px', borderRadius: '16px', boxShadow: '0 18px 45px rgba(0,0,0,0.12)' }}>
                <div className="text-center mb-4">
                    <h1>Bem-vindo à Jacaridade</h1>
                    <p className="text-muted">Escolha como deseja se cadastrar.</p>
                </div>
                <div className="d-grid gap-3">
                    <Link to="/cadastro" className="btn btn-primary btn-lg">Cadastrar como Usuário</Link>
                    <Link to="/cadastro-ong" className="btn btn-secondary btn-lg">Cadastrar como ONG</Link>
                </div>
                <hr />
                <div className="text-center mt-3">
                    <p className="mb-2">Já possui conta?</p>
                    <Link to="/login" className="btn btn-outline-primary me-2">Login Usuário</Link>
                    <Link to="/login-ong" className="btn btn-outline-secondary">Login ONG</Link>
                </div>
            </div>
        </div>
    );
}