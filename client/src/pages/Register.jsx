import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [country, setCountry] = useState('Moçambique');
    const { register } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const countries = [
        "Moçambique", "Angola", "Portugal", "Brasil", "Cabo Verde", 
        "Guiné-Bissau", "São Tomé e Príncipe", "África do Sul", "Outro"
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(name, email, password, country);
            showToast("Conta criada com sucesso! Bem-vindo.", "success");
            navigate('/');
        } catch (err) {
            showToast(err.response?.data?.message || 'Erro ao criar conta', "error");
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form">
                <h1>Criar Conta</h1>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input type="text" placeholder="Nome Completo" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div className="input-group">
                        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="input-group">
                        <select 
                            value={country} 
                            onChange={(e) => setCountry(e.target.value)} 
                            required
                            style={{ width: '100%', padding: '12px', background: '#333', border: '1px solid #444', borderRadius: '4px', color: 'white', marginBottom: '15px' }}
                        >
                            {countries.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
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
