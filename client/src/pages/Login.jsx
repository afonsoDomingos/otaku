import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Erro ao fazer login');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form">
                <h1>Entrar</h1>
                {error && <p style={{color: 'var(--primary)', marginBottom: '15px'}}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="input-group">
                        <input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <div style={{ textAlign: 'right', marginBottom: '20px' }}>
                        <a 
                            href={`https://wa.me/258842718131?text=${encodeURIComponent(`Olá suporte OtakuZoneFlix, esqueci minha senha. Meu email é: ${email}`)}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{ color: '#737373', fontSize: '0.85rem', textDecoration: 'none' }}
                        >
                            Esqueceu a senha?
                        </a>
                    </div>
                    <button type="submit" className="auth-btn">Entrar</button>
                    <div style={{marginTop: '20px', color: '#737373'}}>
                        Novo por aqui? <Link to="/register" style={{color: 'white'}}>Assine agora.</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
