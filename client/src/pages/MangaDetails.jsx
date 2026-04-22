import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { CheckCircle, X, Upload, CreditCard, BookOpen } from 'lucide-react';
import Footer from '../components/Footer';

const MangaDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [manga, setManga] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [proof, setProof] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [hasAccess, setHasAccess] = useState(false);

    useEffect(() => {
        const fetchManga = async () => {
            try {
                const { data } = await API.get(`/mangas/${id}`);
                setManga(data);
                
                if (user) {
                    const { data: purchases } = await API.get('/purchases/my');
                    const owned = purchases.some(p => p.manga?._id === id && p.status === 'approved');
                    setHasAccess(owned);
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchManga();
        window.scrollTo(0, 0);
    }, [id, user]);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!proof) return showToast("Selecione o comprovativo.", "warning");

        setUploading(true);
        const formData = new FormData();
        formData.append('proof', proof);
        formData.append('mangaId', manga._id);

        try {
            await API.post('/purchases', formData);
            showToast("Comprovativo enviado! Aguarde a aprovação do administrador.");
            setShowModal(false);
        } catch (error) {
            showToast("Erro ao enviar comprovativo.", "error");
        } finally {
            setUploading(false);
        }
    };

    if (!manga) return <div className="loading-screen">Carregando...</div>;

    return (
        <div className="anime-details-page">
            <div className="hero-section" style={{backgroundImage: `linear-gradient(to top, #141414, transparent), url(${manga.thumbnail})`}}>
                <div className="container">
                    <div className="details-content">
                        <div className="badge">Mangá Premium</div>
                        <h1>{manga.title}</h1>
                        <p className="description">{manga.description}</p>
                        <div className="meta">
                            <span>{manga.author}</span> • <span>{manga.genre}</span>
                        </div>
                        <div className="action-btns">
                            {hasAccess ? (
                                <button className="btn-primary" onClick={() => navigate(`/manga-reader/${manga._id}/0`)}>
                                    <BookOpen /> Ler Agora
                                </button>
                            ) : (
                                <button className="btn-primary" onClick={() => setShowModal(true)}>
                                    <CreditCard /> Comprar Acesso (25 MT)
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container chapters-section" style={{padding: '40px 0'}}>
                <h2>Capítulos</h2>
                <div className="chapters-list">
                    {manga.chapters.map((ch, idx) => (
                        <div key={idx} className="chapter-row" onClick={() => hasAccess ? navigate(`/manga-reader/${manga._id}/${idx}`) : setShowModal(true)}>
                           <span>Capítulo {ch.number}: {ch.title}</span>
                           {hasAccess ? <BookOpen size={18} /> : <CreditCard size={18} color="#888" />}
                        </div>
                    ))}
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button className="close-btn" onClick={() => setShowModal(false)}><X /></button>
                        <h2>Instruções de Pagamento</h2>
                        <p>Para ler <strong>{manga.title}</strong> completo, siga os passos:</p>
                        <div className="payment-steps">
                            <div className="step"><strong>1. M-Pesa:</strong> 84 525 4253 (OtakuZone)</div>
                            <div className="step"><strong>2. Valor:</strong> 25 MT</div>
                        </div>
                        <form onSubmit={handleUpload} className="upload-form">
                            <input type="file" onChange={e => setProof(e.target.files[0])} required />
                            <button type="submit" className="auth-btn" disabled={uploading}>{uploading ? "Enviando..." : "Confirmar Pagamento"}</button>
                        </form>
                    </div>
                </div>
            )}

            <Footer />

            <style>{`
                .chapters-list { display: flex; flex-direction: column; gap: 10px; margin-top: 20px; }
                .chapter-row { background: #222; padding: 15px 20px; border-radius: 8px; display: flex; justify-content: space-between; cursor: pointer; transition: 0.3s; }
                .chapter-row:hover { background: #333; transform: translateX(10px); color: var(--primary); }
                .payment-steps { background: #111; padding: 20px; border-radius: 8px; margin: 20px 0; }
                .step { margin-bottom: 10px; font-size: 1.1rem; }
            `}</style>
        </div>
    );
};

export default MangaDetails;
