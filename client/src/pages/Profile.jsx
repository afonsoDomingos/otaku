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
                        <img src={preview} alt="Avatar" className="profile-avatar" />
                        <label htmlFor="avatar-upload" className="avatar-overlay">
                            <Camera size={24} />
                            <input type="file" id="avatar-upload" onChange={handleFileChange} hidden />
                        </label>
                    </div>
                    <h1>Editar Perfil</h1>
                    <p>Mantenha os seus dados atualizados no Universo Otaku.</p>
                </div>

                <form onSubmit={handleSubmit} className="profile-form">
                    <div className="input-group">
                        <label><User size={18} /> Nome Completo</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} required />
                    </div>
                    
                    <div className="input-group">
                        <label><Mail size={18} /> Endereço de Email</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                    </div>

                    <div className="input-group">
                        <label><Lock size={18} /> Nova Senha (deixe vazio para não mudar)</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
                    </div>

                    <button type="submit" className="save-btn" disabled={loading}>
                        {loading ? "A guardar..." : <><Save size={18} /> Guardar Alterações</>}
                    </button>
                </form>
            </div>

            <style>{`
                .profile-page { padding-top: 120px; padding-bottom: 80px; max-width: 600px !important; }
                .back-btn { background: none; border: none; color: #888; display: flex; align-items: center; gap: 8px; cursor: pointer; margin-bottom: 30px; transition: color 0.3s; }
                .back-btn:hover { color: #fff; }
                
                .profile-container { background: #181818; padding: 40px; border-radius: 12px; border: 1px solid #333; box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
                
                .profile-header { text-align: center; margin-bottom: 40px; }
                .avatar-wrapper { position: relative; width: 150px; height: 150px; margin: 0 auto 20px; border-radius: 50%; overflow: hidden; border: 3px solid var(--primary); }
                .profile-avatar { width: 100%; height: 100%; object-fit: cover; }
                .avatar-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s; cursor: pointer; }
                .avatar-wrapper:hover .avatar-overlay { opacity: 1; }
                .profile-header h1 { font-size: 2rem; margin-bottom: 10px; }
                .profile-header p { color: #888; }

                .profile-form { display: flex; flexDirection: column; gap: 25px; }
                .input-group { display: flex; flexDirection: column; gap: 10px; }
                .input-group label { display: flex; align-items: center; gap: 10px; color: #aaa; font-size: 0.9rem; font-weight: 600; }
                .input-group input { padding: 12px 15px; background: #111; border: 1px solid #333; border-radius: 8px; color: #fff; font-size: 1rem; outline: none; transition: border-color 0.3s; }
                .input-group input:focus { border-color: var(--primary); }

                .save-btn { margin-top: 10px; padding: 15px; background: var(--primary); color: #fff; border: none; border-radius: 8px; font-size: 1rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; transition: all 0.3s; }
                .save-btn:hover:not(:disabled) { background: #ff1f1f; transform: translateY(-2px); box-shadow: 0 10px 20px rgba(229, 9, 20, 0.3); }
                .save-btn:disabled { opacity: 0.5; cursor: not-allowed; }

                .notification-toast {
                    position: fixed;
                    top: 90px;
                    right: 40px;
                    padding: 15px 25px;
                    background: #181818;
                    color: white;
                    border-radius: 8px;
                    border-left: 4px solid #4ade80;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                    z-index: 10000;
                    animation: slideIn 0.3s ease-out;
                }
                .notification-toast.error { border-left-color: #ff4444; }
                
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default Profile;
