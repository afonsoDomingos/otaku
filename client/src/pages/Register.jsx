import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(name, email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Erro ao criar conta');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form">
                <h1>Criar Conta</h1>
                {error && <p style={{color: 'var(--primary)', marginBottom: '15px'}}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input type="text" placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div className="input-group">
                        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="input-group">
                        <input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <button type="submit" className="auth-btn">Registrar</button>
                    <div style={{marginTop: '20px', color: '#737373'}}>
                        Já tem uma conta? <Link to="/login" style={{color: 'white'}}>Entrar.</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
