import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { CheckCircle, X, Upload, CreditCard, Play } from 'lucide-react';
import Footer from '../components/Footer';

const AnimeDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [anime, setAnime] = useState(null);
    const [others, setOthers] = useState([]);
    const [selectedSeason, setSelectedSeason] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showTrailer, setShowTrailer] = useState(false);
    const [proof, setProof] = useState(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const { data } = await API.get(`/animes/${id}`);
                setAnime(data);
                
                const { data: allAnimes } = await API.get('/animes');
                setOthers((Array.isArray(allAnimes) ? allAnimes : []).filter(a => a._id !== id).slice(0, 6));
            } catch (error) {
                console.error(error);
            }
        };
        fetchDetails();
        window.scrollTo(0, 0);
    }, [id]);

    const handlePurchaseClick = (season) => {
        if (!user) return navigate('/login');
        
        // Check if season has real episodes (ignoring the default empty one if necessary)
        const hasEpisodes = season.episodes && season.episodes.length > 0 && season.episodes.some(ep => ep.videoUrl && ep.videoUrl.trim() !== "");
        
        if (!hasEpisodes) {
            return showToast("🌸 Opa! Esta temporada ainda está em processamento e não tem episódios disponíveis no momento. Por favor, aguarda pela disponibilidade. Agradecemos a tua paciência e paixão Otaku! ✨", "info");
        }

        setSelectedSeason(season);
        setShowModal(true);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!proof) return showToast("Por favor, selecione um comprovativo.", "warning");

        setUploading(true);
        const formData = new FormData();
        formData.append('proof', proof);
        formData.append('animeId', anime._id);
        formData.append('seasonId', selectedSeason._id);
        formData.append('price', selectedSeason.price);

        try {
            await API.post('/purchases', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            showToast("Comprovativo enviado com sucesso! Aguarde a aprovação.");
            setShowModal(false);
            setProof(null);
        } catch (error) {
            showToast("Erro ao enviar comprovativo.", "error");
        } finally {
            setUploading(false);
        }
    };

    if (!anime) return <div className="loading-screen">Carregando...</div>;

    const isPurchased = (seasonId) => {
        return user?.purchasedSeasons?.includes(seasonId);
    };

    return (
        <div className="anime-details-page">
            <div className="details-header" style={{ backgroundImage: `linear-gradient(to top, #141414, transparent 60%), linear-gradient(to right, #141414 30%, transparent), url(${anime.thumbnail})` }}>
                <div className="container header-container">
                    <div className="header-text">
                        <h1>{anime.title}</h1>
                        <p className="description">{anime.description}</p>
                        <div className="header-actions">
                            <button className="btn-primary" onClick={() => setShowTrailer(true)}>
                                <Play fill="white" size={20} /> Ver Trailer
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container content-section">
                <div className="seasons-section">
                    <h2 className="section-title">Temporadas Disponíveis</h2>
                    <div className="seasons-grid">
                        {anime.seasons.map((season, index) => (
                            <div key={season._id} className="season-card">
                                <div className="season-info">
                                    <h3>{season.title}</h3>
                                    <p>{season.episodes.length} Episódios</p>
                                    <p className="price">MT {season.price.toLocaleString()}</p>
                                </div>
                                <div className="season-action">
                                    {isPurchased(season._id) ? (
                                        <button onClick={() => navigate(`/player/${anime._id}/${index}/0`)} className="btn-primary">
                                            <CheckCircle size={18} /> Assistir
                                        </button>
                                    ) : (
                                        <button onClick={() => handlePurchaseClick(season)} className="btn-secondary">
                                            <CreditCard size={18} /> Comprar
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="suggested-section">
                    <h2 className="section-title">Quem viu {anime.title} também assistiu</h2>
                    <div className="suggested-grid">
                        {others.map(item => (
                            <Link to={`/anime/${item._id}`} key={item._id} className="anime-card">
                                <img src={item.thumbnail} alt={item.title} />
                                <div className="anime-card-info">
                                    <h3>{item.title}</h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {showTrailer && (
                <div className="modal-overlay" onClick={() => setShowTrailer(false)}>
                    <div className="modal-content trailer-modal" onClick={e => e.stopPropagation()}>
                        <button className="close-btn" onClick={() => setShowTrailer(false)}><X /></button>
                        <div className="video-container">
                            <iframe 
                                src={anime.seasons[0]?.episodes[0]?.videoUrl} 
                                title={anime.title}
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                            ></iframe>
                        </div>
                        <div className="trailer-info">
                            <h2>Trailer: {anime.title}</h2>
                            <p>{anime.description}</p>
                        </div>
                    </div>
                </div>
            )}

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button className="close-btn" onClick={() => setShowModal(false)}><X /></button>
                        <h2>Instruções de Pagamento</h2>
                        <p>Para obter acesso à <strong>{selectedSeason.title}</strong>, siga os passos abaixo:</p>
                        
                        <div className="payment-steps">
                            <div className="step">
                                <strong>1. Transferência/M-Pesa</strong>
                                <p>Número: 84 525 4253 (Nome: OtakuZone Intl)</p>
                            </div>
                            <div className="step">
                                <strong>2. Valor</strong>
                                <p>MT {selectedSeason.price.toLocaleString()}</p>
                            </div>
                        </div>

                        <form onSubmit={handleUpload} className="upload-form">
                            <h3>Enviar Comprovativo</h3>
                            <div className="file-input">
                                <label htmlFor="proof"><Upload /> {proof ? proof.name : "Selecionar Comprovativo"}</label>
                                <input type="file" id="proof" onChange={(e) => setProof(e.target.files[0])} hidden required />
                            </div>
                            <button type="submit" className="auth-btn" disabled={uploading}>
                                {uploading ? "Enviando..." : "Confirmar Pagamento"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <Footer />

            <style>{`
                .anime-details-page { background: #141414; min-height: 100vh; }
                .loading-screen { padding-top: 100px; text-align: center; font-size: 1.2rem; }
                .details-header {
                    height: 85vh;
                    background-size: cover;
                    background-position: center 20%;
                    display: flex;
                    align-items: center;
                    margin-bottom: -150px;
                }
                .header-container { display: flex; align-items: center; height: 100%; }
                .header-text { max-width: 700px; z-index: 5; }
                .header-text h1 { font-size: clamp(3rem, 10vw, 5rem); font-weight: 900; line-height: 1; margin-bottom: 20px; text-shadow: 2px 2px 4px rgba(0,0,0,0.5); }
                .header-text .description { font-size: 1.2rem; margin-bottom: 30px; line-height: 1.4; color: #e5e5e5; display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden; }
                .header-actions { display: flex; gap: 15px; }
                
                .content-section { position: relative; z-index: 10; padding-bottom: 100px; }
                .section-title { font-size: 1.8rem; margin: 40px 0 25px; font-weight: 600; }
                
                .seasons-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 15px; }
                .season-card { background: #181818; padding: 25px; border-radius: 8px; border: 1px solid #333; display: flex; justify-content: space-between; align-items: center; transition: background 0.3s; }
                .season-card:hover { background: #242424; }
                .season-info h3 { font-size: 1.2rem; margin-bottom: 5px; }
                .price { color: var(--primary); font-weight: 800; font-size: 1.1rem; margin-top: 8px; }

                .suggested-section { margin-top: 80px; }
                .suggested-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 15px; }

                .trailer-modal { max-width: 900px !important; padding: 0 !important; overflow: hidden; border-radius: 12px !important; }
                .video-container { position: relative; padding-bottom: 56.25%; height: 0; }
                .video-container iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }
                .trailer-info { padding: 30px; background: #181818; }
                .trailer-info h2 { margin-bottom: 15px; }

                @media (max-width: 768px) {
                    .details-header { height: 60vh; }
                    .header-text h1 { font-size: 2.5rem; }
                    .header-actions { flex-direction: column; }
                }
            `}</style>
        </div>
    );
};

export default AnimeDetails;
