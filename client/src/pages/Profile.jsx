import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api';
import { Camera, User, Mail, Lock, Save, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [password, setPassword] = useState('');
    const [profilePic, setProfilePic] = useState(null);
    const [preview, setPreview] = useState(user?.profilePic || '');
    const [imgError, setImgError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

    const showNotification = (message, type = 'success') => {
        setNotification({ show: true, message, type });
        setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePic(file);
            setPreview(URL.createObjectURL(file));
            setImgError(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        if (password) formData.append('password', password);
        if (profilePic) formData.append('profilePic', profilePic);

        try {
            const { data } = await API.put('/auth/profile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setUser(data);
            localStorage.setItem('user', JSON.stringify(data));
            showNotification("Perfil atualizado com sucesso!");
        } catch (error) {
            showNotification(error.response?.data?.message || "Erro ao atualizar perfil", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="profile-page container">
            {notification.show && (
                <div className={`notification-toast ${notification.type}`}>
                    {notification.message}
                </div>
            )}
            <button onClick={() => navigate(-1)} className="back-btn">
                <ArrowLeft size={20} /> Voltar
            </button>
            
            <div className="profile-container">
                <div className="profile-header">
                    <div className="avatar-wrapper">
                        {!imgError && preview ? (
                            <img 
                                src={preview} 
                                alt="Avatar" 
                                className="profile-avatar" 
                                onError={() => setImgError(true)}
                            />
                        ) : (
                            <div className="avatar-fallback">
                                <User size={60} />
                            </div>
                        )}
                        <label htmlFor="avatar-upload" className="avatar-overlay">
                            <Camera size={24} />
                            <input type="file" id="avatar-upload" onChange={handleFileChange} hidden />
                        </label>
                    </div>
                    <h1>Editar Perfil</h1>
                    <p>Personalize o seu perfil no Universo Otaku.</p>
                </div>

                <form onSubmit={handleSubmit} className="profile-form">
                    <div className="form-grid">
                        <div className="input-group">
                            <label><User size={18} /> Nome Completo</label>
                            <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Seu nome" />
                        </div>
                        
                        <div className="input-group">
                            <label><Mail size={18} /> Email</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="seu@email.com" />
                        </div>

                        <div className="input-group full-width">
                            <label><Lock size={18} /> Nova Senha (deixe vazio para manter)</label>
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
                        </div>
                    </div>

                    <button type="submit" className="save-btn" disabled={loading}>
                        {loading ? "A guardar..." : <><Save size={18} /> Guardar Alterações</>}
                    </button>
                </form>
            </div>

            <style>{`
                .profile-page { padding-top: 120px; padding-bottom: 80px; max-width: 800px !important; }
                .back-btn { background: none; border: none; color: #888; display: flex; align-items: center; gap: 8px; cursor: pointer; margin-bottom: 30px; transition: color 0.3s; font-weight: 600; }
                .back-btn:hover { color: var(--primary); }
                
                .profile-container { background: #181818; padding: 50px; border-radius: 16px; border: 1px solid #333; box-shadow: 0 30px 60px rgba(0,0,0,0.6); }
                
                .profile-header { text-align: center; margin-bottom: 50px; }
                .avatar-wrapper { position: relative; width: 160px; height: 160px; margin: 0 auto 25px; border-radius: 50%; border: 4px solid #333; overflow: hidden; background: #111; transition: all 0.3s; }
                .avatar-wrapper:hover { border-color: var(--primary); transform: scale(1.02); }
                .profile-avatar { width: 100%; height: 100%; object-fit: cover; }
                .avatar-fallback { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: #222; color: #555; }
                
                .avatar-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s; cursor: pointer; color: #fff; }
                .avatar-wrapper:hover .avatar-overlay { opacity: 1; }
                
                .profile-header h1 { font-size: 2.5rem; font-weight: 800; margin-bottom: 12px; }
                .profile-header p { color: #888; font-size: 1.1rem; }

                .profile-form { display: flex; flex-direction: column; gap: 30px; }
                .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
                .input-group.full-width { grid-column: span 2; }
                
                .input-group { display: flex; flex-direction: column; gap: 10px; }
                .input-group label { display: flex; align-items: center; gap: 10px; color: #aaa; font-size: 0.95rem; font-weight: 700; margin-left: 5px; }
                .input-group input { padding: 15px 20px; background: rgba(0,0,0,0.3); border: 1px solid #444; border-radius: 10px; color: #fff; font-size: 1rem; outline: none; transition: all 0.3s; }
                .input-group input:focus { border-color: var(--primary); background: #000; box-shadow: 0 0 0 4px rgba(229, 9, 20, 0.1); }

                .save-btn { margin-top: 15px; padding: 18px; background: var(--primary); color: #fff; border: none; border-radius: 10px; font-size: 1.1rem; font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 12px; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
                .save-btn:hover:not(:disabled) { background: #ff1f1f; transform: translateY(-3px); box-shadow: 0 15px 30px rgba(229, 9, 20, 0.4); }
                .save-btn:disabled { opacity: 0.5; cursor: not-allowed; }

                .notification-toast {
                    position: fixed;
                    top: 90px;
                    right: 40px;
                    padding: 18px 30px;
                    background: #222;
                    color: white;
                    border-radius: 12px;
                    border-left: 5px solid #4ade80;
                    box-shadow: 0 20px 50px rgba(0,0,0,0.5);
                    z-index: 10000;
                    animation: slideIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    font-weight: 600;
                }
                .notification-toast.error { border-left-color: #ff4444; }
                
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }

                @media (max-width: 600px) {
                    .form-grid { grid-template-columns: 1fr; }
                    .input-group.full-width { grid-column: span 1; }
                    .profile-container { padding: 30px 20px; }
                    .profile-header h1 { font-size: 2rem; }
                }
            `}</style>
        </div>
    );
};

export default Profile;
