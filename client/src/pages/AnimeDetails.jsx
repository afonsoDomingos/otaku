import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, X, Upload, CreditCard } from 'lucide-react';

const AnimeDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [anime, setAnime] = useState(null);
    const [selectedSeason, setSelectedSeason] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [proof, setProof] = useState(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const fetchAnime = async () => {
            const { data } = await API.get(`/animes/${id}`);
            setAnime(data);
        };
        fetchAnime();
    }, [id]);

    const handlePurchaseClick = (season) => {
        if (!user) return navigate('/login');
        setSelectedSeason(season);
        setShowModal(true);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!proof) return alert("Por favor, selecione um comprovativo.");

        setUploading(true);
        const formData = new FormData();
        formData.append('proof', proof);
        formData.append('animeId', anime._id);
        formData.append('seasonId', selectedSeason._id);

        try {
            await API.post('/purchases', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert("Comprovativo enviado com sucesso! Aguarde a aprovação.");
            setShowModal(false);
            setProof(null);
        } catch (error) {
            alert("Erro ao enviar comprovativo.");
        } finally {
            setUploading(false);
        }
    };

    if (!anime) return <div style={{paddingTop: '100px', textAlign: 'center'}}>Carregando...</div>;

    const isPurchased = (seasonId) => {
        return user?.purchasedSeasons?.includes(seasonId);
    };

    return (
        <div className="anime-details-page">
            <div className="details-header" style={{ backgroundImage: `linear-gradient(to top, var(--background), transparent), url(${anime.thumbnail})` }}>
                <div className="container">
                    <h1>{anime.title}</h1>
                    <p>{anime.description}</p>
                </div>
            </div>

            <div className="container">
                <h2 style={{margin: '40px 0 20px'}}>Temporadas Disponíveis</h2>
                <div className="seasons-grid">
                    {anime.seasons.map((season, index) => (
                        <div key={season._id} className="season-card">
                            <div className="season-info">
                                <h3>{season.title}</h3>
                                <p>{season.episodes.length} Episódios</p>
                                <p className="price">MT {season.price.toLocaleString()}</p>
                            </div>
                            {isPurchased(season._id) ? (
                                <button onClick={() => navigate(`/player/${anime._id}/${index}/0`)} className="btn-primary">
                                    <CheckCircle size={18} /> Assistir Agora
                                </button>
                            ) : (
                                <button onClick={() => handlePurchaseClick(season)} className="btn-secondary">
                                    <CreditCard size={18} /> Comprar Acesso
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="close-btn" onClick={() => setShowModal(false)}><X /></button>
                        <h2>Instruções de Pagamento</h2>
                        <p>Para obter acesso à <strong>{selectedSeason.title}</strong>, por favor siga os passos abaixo:</p>
                        
                        <div className="payment-steps">
                            <div className="step">
                                <strong>1. Transferência/M-Pesa</strong>
                                <p>Número: 84 123 4567 (Nome: OtakuZone Intl)</p>
                            </div>
                            <div className="step">
                                <strong>2. Valor</strong>
                                <p>MT {selectedSeason.price.toLocaleString()}</p>
                            </div>
                        </div>

                        <form onSubmit={handleUpload} className="upload-form">
                            <h3>Enviar Comprovativo</h3>
                            <div className="file-input">
                                <label htmlFor="proof"><Upload /> {proof ? proof.name : "Selecionar Imagem/PDF"}</label>
                                <input type="file" id="proof" onChange={(e) => setProof(e.target.files[0])} hidden />
                            </div>
                            <button type="submit" className="auth-btn" disabled={uploading}>
                                {uploading ? "Enviando..." : "Confirmar Pagamento"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
                .anime-details-page { padding-bottom: 50px; }
                .details-header {
                    height: 50vh;
                    background-size: cover;
                    background-position: center;
                    display: flex;
                    align-items: flex-end;
                    padding-bottom: 40px;
                }
                .details-header h1 { font-size: 3rem; margin-bottom: 10px; }
                .details-header p { max-width: 800px; color: #ccc; }
                .seasons-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 20px;
                }
                .season-card {
                    background: var(--surface);
                    padding: 20px;
                    border-radius: 8px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border: 1px solid var(--border);
                }
                .season-info h3 { margin-bottom: 5px; }
                .price { color: var(--primary); font-weight: bold; margin-top: 5px; }
                .modal-overlay {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0,0,0,0.85);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 2000;
                    padding: 20px;
                }
                .modal-content {
                    background: #181818;
                    padding: 40px;
                    border-radius: 8px;
                    max-width: 500px;
                    width: 100%;
                    position: relative;
                }
                .close-btn { position: absolute; top: 20px; right: 20px; background: none; color: white; }
                .payment-steps { background: #222; padding: 15px; border-radius: 4px; margin: 20px 0; }
                .step { margin-bottom: 10px; }
                .file-input label {
                    display: flex; align-items: center; gap: 10px;
                    background: #333; padding: 15px; border-radius: 4px; cursor: pointer;
                    justify-content: center; border: 1px dashed #666;
                }
            `}</style>
        </div>
    );
};

export default AnimeDetails;
