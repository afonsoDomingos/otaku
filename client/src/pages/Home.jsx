import React, { useState, useEffect } from 'react';
import API from '../api';
import { Play, Info, Flame, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import { useSearch } from '../context/SearchContext';

const Home = () => {
    const { searchQuery } = useSearch();
    const navigate = useNavigate();
    const [animes, setAnimes] = useState([]);
    const [shorts, setShorts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [featuredAnimes, setFeaturedAnimes] = useState([]);
    const [selectedShort, setSelectedShort] = useState(null);
    const [guests, setGuests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeHero, setActiveHero] = useState(0);
    const [showPartnerModal, setShowPartnerModal] = useState(false);
    const [partnerForm, setPartnerForm] = useState({ companyName: '', contactEmail: '', proposal: '' });
    const [partnerStatus, setPartnerStatus] = useState('');

    const fetchData = async () => {
        try {
            const [aRes, sRes] = await Promise.all([
                API.get('/animes'),
                API.get('/shorts')
            ]);
            let gRes = { data: [] };
            try { gRes = await API.get('/guests'); } catch (err) {}

            const animesData = Array.isArray(aRes.data) ? aRes.data : [];
            const shortsData = Array.isArray(sRes.data) ? sRes.data : [];
            setAnimes(animesData);
            setShorts(shortsData);
            
            const fetchedGuests = Array.isArray(gRes.data) && gRes.data.length > 0 ? gRes.data : [
                { _id: '1', name: 'Meu Mano Denzel', photo: 'https://via.placeholder.com/150', role: 'Convidado Especial' },
                { _id: '2', name: 'PURPPLESWAG', photo: 'https://via.placeholder.com/150', role: 'Convidado Especial' }
            ];
            setGuests(fetchedGuests);
            
            const cats = [...new Set(animesData.map(a => a.category).filter(Boolean))];
            setCategories(cats);
            setFeaturedAnimes(animesData.slice(0, 3));
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (featuredAnimes.length === 0) return;
        const interval = setInterval(() => {
            setActiveHero(prev => (prev + 1) % featuredAnimes.length);
        }, 8000);
        return () => clearInterval(interval);
    }, [featuredAnimes]);

    const filteredAnimes = animes.filter(anime => 
        (anime.title || "").toLowerCase().includes((searchQuery || "").trim().toLowerCase()) ||
        (anime.category || "").toLowerCase().includes((searchQuery || "").trim().toLowerCase())
    );

    const handlePartnerSubmit = async (e) => {
        e.preventDefault();
        setPartnerStatus('A enviar...');
        try {
            await API.post('/partners/submit', partnerForm);
            setPartnerStatus('sucesso');
            setTimeout(() => {
                setShowPartnerModal(false);
                setPartnerStatus('');
                setPartnerForm({ companyName: '', contactEmail: '', proposal: '' });
            }, 3000);
        } catch (error) {
            setPartnerStatus('erro');
        }
    };

    if (loading) return (
        <div className="skeleton-container">
            <div className="skeleton-hero"></div>
            <style>{`
                .skeleton-container { padding-top: 70px; background: #141414; min-height: 100vh; }
                .skeleton-hero { height: 80vh; background: #222; animation: pulse 1.5s infinite; }
                @keyframes pulse { 0% { opacity: 0.5; } 50% { opacity: 0.8; } 100% { opacity: 0.5; } }
            `}</style>
        </div>
    );

    return (
        <div className="home-page">
            {featuredAnimes.length > 0 && (
                <div className="hero-carousel">
                    {featuredAnimes.map((anime, index) => (
                        <div 
                            key={anime._id} 
                            className={`hero-slide ${index === activeHero ? 'active' : ''}`}
                            style={{ backgroundImage: `linear-gradient(to top, #080808, transparent 50%), linear-gradient(to right, #080808 30%, transparent), url(${anime.thumbnail})` }}
                        >
                            <div className="hero-content">
                                <div className="featured-badge">
                                    <Flame size={16} fill="#E50914" color="#E50914" />
                                    <span>EM DESTAQUE</span>
                                </div>
                                <h1>{anime.title}</h1>
                                <p>{anime.description}</p>
                                <div className="hero-btns">
                                    <button className="btn-primary" onClick={() => navigate(`/anime/${anime._id}`)} style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                        <Play fill="white" size={20} /> Assistir Agora
                                    </button>
                                    <button className="btn-secondary" onClick={() => navigate(`/anime/${anime._id}`)} style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                        <Info size={20} /> Mais Informações
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="carousel-indicators">
                        {featuredAnimes.map((_, i) => (
                            <div 
                                key={i} 
                                className={`indicator ${i === activeHero ? 'active' : ''}`}
                                onClick={() => setActiveHero(i)}
                            ></div>
                        ))}
                    </div>
                </div>
            )}

            <div className="main-content" style={{marginTop: featuredAnimes.length > 0 ? '-150px' : '0'}}>
                {animes.length === 0 && !loading && (
                    <div className="container" style={{padding: '50px 4%', opacity: 0.6}}>
                        <p>Sincronizando conteúdos com o servidor...</p>
                    </div>
                )}
                {(searchQuery && searchQuery.trim().length > 0) ? (
                    <div className="search-results">
                        <h2 className="row-title">Resultados para "{searchQuery}"</h2>
                        <div className="results-grid">
                            {filteredAnimes.length > 0 ? (
                                filteredAnimes.map(anime => (
                                    <Link to={`/anime/${anime._id}`} key={`search-${anime._id}`} className="anime-card">
                                        <img src={anime.thumbnail} alt={anime.title} />
                                        <div className="anime-card-info">
                                            <h3>{anime.title}</h3>
                                            <p>{anime.seasons?.length || 0} Temporadas</p>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <p style={{paddingLeft: '4%', color: '#757575'}}>Nenhum anime encontrado.</p>
                            )}
                        </div>
                    </div>
                ) : (
                    <>
                        {animes.length === 0 && shorts.length === 0 && !loading && (
                            <div className="container" style={{padding: '100px 4%', textAlign: 'center', color: '#888'}}>
                                <p>Carregando as novidades para você...</p>
                            </div>
                        )}

                        {animes.length > 0 && (
                            <div className="row-container">
                                <h2 className="row-title">Novidades no OtakuZone</h2>
                                <div className="row-scroll">
                                    {animes.slice().reverse().slice(0, 10).map(anime => (
                                        <Link to={`/anime/${anime._id}`} key={`new-${anime._id}`} className="anime-card">
                                            <img src={anime.thumbnail} alt={anime.title} />
                                            <div className="anime-card-info">
                                                <h3>{anime.title}</h3>
                                                <p>{anime.seasons?.length || 0} Temporadas</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {shorts.length > 0 && (
                            <div className="row-container">
                                <h2 className="row-title">Shorts Otaku</h2>
                                <div className="row-scroll shorts-row">
                                    {shorts.map(short => (
                                        <div key={short._id} className="short-card" onClick={() => setSelectedShort(short)}>
                                            <div className="short-thumbnail">
                                                <img src={`https://img.youtube.com/vi/${short.youtubeId}/hqdefault.jpg`} alt={short.title} />
                                                <div className="short-overlay">
                                                    <Play fill="white" size={24} />
                                                </div>
                                            </div>
                                            <h3>{short.title}</h3>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Shorts Player Modal */}
                        {selectedShort && (
                            <div className="short-modal-overlay" onClick={() => setSelectedShort(null)}>
                                <div className="short-modal-content" onClick={e => e.stopPropagation()}>
                                    <button className="close-short" onClick={() => setSelectedShort(null)}><X size={30} /></button>
                                    <div className="short-video-container">
                                        <iframe 
                                            src={`https://www.youtube.com/embed/${selectedShort.youtubeId}?autoplay=1`}
                                            title={selectedShort.title}
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                    <div className="short-modal-info">
                                        <h2>{selectedShort.title}</h2>
                                    </div>
                                </div>
                            </div>
                        )}

                        {categories.map(cat => (
                            <div key={cat} className="row-container">
                                <h2 className="row-title">{cat}</h2>
                                <div className="row-scroll">
                                    {animes.filter(a => a.category === cat).map(anime => (
                                        <Link to={`/anime/${anime._id}`} key={anime._id} className="anime-card">
                                            <img src={anime.thumbnail} alt={anime.title} />
                                            <div className="anime-card-info">
                                                <h3>{anime.title}</h3>
                                                <p>{anime.seasons?.length || 0} Temporadas</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}

                        <section className="about-otaku-section container" style={{marginTop: '60px'}}>
                            <div className="about-grid">
                                <div className="about-image">
                                    <img src="/images/otakumeuperfil.jpg" alt="Bem-vindo Otaku" className="otaku-profile-img" />
                                </div>
                                <div className="about-text">
                                    <div className="badge">SOBRE NÓS</div>
                                    <h2>Bem-vindo à Família OtakuZone!</h2>
                                    <p>
                                        Ser Otaku é mais do que apenas assistir anime; é uma paixão por contar histórias, 
                                        conexão com personagens e uma cultura vibrante que atravessa fronteiras. 
                                        Aqui na <strong>OtakuZoneFlix</strong>, criamos um espaço onde cada fã moçambicano 
                                        pode encontrar seu universo favorito com qualidade premium.
                                    </p>
                                    <p>
                                        Do primeiro episódio de um clássico ao lançamento mais recente do Japão, 
                                        estamos aqui para garantir que sua jornada seja épica. Prepare o ramen, 
                                        escolha seu clã e divirta-se!
                                    </p>
                                    <a 
                                        href="https://www.youtube.com/@Universo_Otaku_Podcast" 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="social-cta"
                                        style={{ textDecoration: 'none', display: 'inline-block' }}
                                    >
                                        <p>Junta-te ao nosso Podcast e debates semanais!</p>
                                    </a>
                                </div>
                            </div>
                        </section>

                        {/* Podcast Guests Section */}
                        <section className="guests-section container" style={{ padding: '80px 0' }}>
                            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                                <h2 className="row-title" style={{ margin: '0 auto', display: 'inline-block' }}>Já passaram pelo nosso Podcast</h2>
                                <p style={{ color: '#aaa', marginTop: '15px' }}>As lendas que já partilharam as suas histórias no Universo Otaku.</p>
                            </div>
                            <div className="guests-grid">
                                {guests.map((guest) => (
                                    <div key={guest._id} className="guest-card">
                                        <div className="guest-avatar-wrapper">
                                            <img src={guest.photo} alt={guest.name} className="guest-avatar" />
                                            <div className="guest-glow"></div>
                                        </div>
                                        <h3 className="guest-name">{guest.name}</h3>
                                        {guest.role && <p className="guest-role">{guest.role}</p>}
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Parceiros Section */}
                        <section className="partners-section container">
                            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                                <h2 className="row-title" style={{ margin: '0 auto', display: 'inline-block' }}>Nossos Parceiros</h2>
                            </div>
                            <div className="partners-grid">
                                <a 
                                    href="https://inscreva-se.com/" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="partner-card"
                                >
                                    <div className="partner-logo">
                                        <h3>INSCREVA-SE</h3>
                                    </div>
                                    <p>Plataforma de Inscrições</p>
                                </a>
                                
                                {/* Torna-te Parceiro Card */}
                                <div 
                                    className="partner-card become-partner-card"
                                    onClick={() => setShowPartnerModal(true)}
                                >
                                    <div className="partner-logo" style={{ background: 'transparent', border: '2px dashed var(--primary)' }}>
                                        <h3 style={{ color: 'var(--primary)' }}>+ JUNTAR-SE</h3>
                                    </div>
                                    <p>Torna-te Nosso Parceiro</p>
                                </div>
                            </div>
                        </section>
                    </>
                )}
            </div>

            {/* Partner Modal */}
            {showPartnerModal && (
                <div className="modal-overlay" onClick={() => setShowPartnerModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px', background: '#141414', padding: '30px', borderRadius: '12px', border: '1px solid #333' }}>
                        <button className="close-btn" onClick={() => setShowPartnerModal(false)}><X size={24} /></button>
                        <h2 style={{ marginBottom: '20px', color: '#fff' }}>Proposta de Parceria</h2>
                        {partnerStatus === 'sucesso' ? (
                            <div style={{ padding: '20px', background: 'rgba(46, 125, 50, 0.2)', color: '#a5d6a7', borderRadius: '8px', textAlign: 'center' }}>
                                Proposta enviada com sucesso! Entraremos em contacto em breve.
                            </div>
                        ) : (
                            <form onSubmit={handlePartnerSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', color: '#ccc' }}>Nome da Empresa / Entidade</label>
                                    <input 
                                        type="text" required 
                                        value={partnerForm.companyName} 
                                        onChange={e => setPartnerForm({...partnerForm, companyName: e.target.value})}
                                        style={{ width: '100%', padding: '12px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '6px' }} 
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', color: '#ccc' }}>Email de Contacto</label>
                                    <input 
                                        type="email" required 
                                        value={partnerForm.contactEmail} 
                                        onChange={e => setPartnerForm({...partnerForm, contactEmail: e.target.value})}
                                        style={{ width: '100%', padding: '12px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '6px' }} 
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', color: '#ccc' }}>Proposta / Ideia</label>
                                    <textarea 
                                        required rows="4" 
                                        value={partnerForm.proposal} 
                                        onChange={e => setPartnerForm({...partnerForm, proposal: e.target.value})}
                                        placeholder="Como podemos trabalhar juntos?"
                                        style={{ width: '100%', padding: '12px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '6px', resize: 'vertical' }} 
                                    />
                                </div>
                                {partnerStatus === 'erro' && <p style={{ color: '#ef4444', fontSize: '0.9rem' }}>Erro ao enviar. Tenta novamente.</p>}
                                <button 
                                    type="submit" 
                                    disabled={partnerStatus === 'A enviar...'}
                                    style={{ padding: '14px', background: 'var(--primary)', color: '#fff', fontWeight: 'bold', borderRadius: '6px', marginTop: '10px' }}
                                >
                                    {partnerStatus === 'A enviar...' ? 'A enviar...' : 'Enviar Proposta'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}

            <Footer />

            <style>{`
                .home-page { background: transparent; min-height: 100vh; color: white; }
                .hero-carousel { position: relative; height: 90vh; overflow: hidden; margin-bottom: -150px; }
                .hero-slide {
                    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                    background-size: cover; background-position: center 25%;
                    display: flex; align-items: center; padding: 0 4%;
                    opacity: 0; visibility: hidden; transition: opacity 1.5s ease-in-out;
                    z-index: 1;
                }
                .hero-slide.active { opacity: 1; visibility: visible; z-index: 2; animation: cinematic-zoom 30s linear forwards; }
                @keyframes cinematic-zoom { from { transform: scale(1.0); } to { transform: scale(1.15); } }
                .hero-content { max-width: 700px; z-index: 5; transform: translateY(30px); transition: transform 0.8s ease-out 0.4s, opacity 0.8s ease-out 0.4s; opacity: 0; }
                .hero-slide.active .hero-content { transform: translateY(0); opacity: 1; text-shadow: 2px 2px 15px rgba(0,0,0,0.9); }
                .featured-badge { display: flex; align-items: center; gap: 8px; background: rgba(0,0,0,0.6); padding: 6px 14px; border-radius: 4px; margin-bottom: 20px; border-left: 3px solid #E50914; width: fit-content; font-size: 0.85rem; font-weight: 700; letter-spacing: 1.5px; }
                .hero-content h1 { font-size: clamp(3rem, 10vw, 5rem); font-weight: 900; line-height: 1.1; margin-bottom: 20px; }
                .hero-slide.active .hero-content h1 {
                    animation: typing-reveal 1.5s steps(25, end) forwards;
                    clip-path: inset(0 100% 0 0);
                }
                @keyframes typing-reveal {
                    0% { clip-path: inset(0 100% 0 0); }
                    100% { clip-path: inset(0 0% 0 0); }
                }
                .hero-content p { font-size: 1.25rem; line-height: 1.4; color: #f3f3f3; margin-bottom: 30px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; max-width: 600px; }
                .hero-btns { display: flex; gap: 15px; flex-wrap: wrap; position: relative; z-index: 20; }
                @media (max-width: 768px) {
                    .hero-btns {
                        margin-bottom: 20px;
                    }
                    .hero-content {
                        transform: translateY(10px);
                    }
                    .hero-btns button {
                        flex: 1;
                        min-width: 140px;
                        padding: 10px 15px;
                        font-size: 0.9rem;
                    }
                }
                .carousel-indicators { position: absolute; bottom: 200px; left: 4%; display: flex; gap: 12px; z-index: 10; }
                .indicator { width: 35px; height: 3px; background: rgba(255,255,255,0.25); cursor: pointer; border-radius: 2px; transition: 0.4s; }
                .indicator.active { background: #E50914; width: 60px; box-shadow: 0 0 10px #E50914; }
                /* Cinematic Rows */
                .main-content { position: relative; z-index: 5; margin-top: -10vw; padding-bottom: 100px; background: linear-gradient(to bottom, transparent, #080808 5%); }
                .row-container { padding-left: 4%; margin-bottom: 50px; }
                .row-title { 
                    font-size: 1.8rem; margin-bottom: 25px; font-weight: 800; color: #fff; letter-spacing: -0.5px; position: relative; display: inline-block; 
                    animation: typing-reveal 1.2s steps(20, end) forwards;
                    clip-path: inset(0 100% 0 0);
                }
                .row-title::after { content: ''; position: absolute; left: 0; bottom: -8px; width: 40px; height: 3px; background: #E50914; border-radius: 2px; }
                
                .row-scroll { display: flex; gap: 20px; overflow-x: auto; padding: 10px 0 30px; scrollbar-width: none; mask-image: linear-gradient(to right, black 85%, transparent 100%); }
                .row-scroll::-webkit-scrollbar { display: none; }

                .anime-card { flex: 0 0 240px; position: relative; border-radius: 8px; overflow: hidden; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); cursor: pointer; box-shadow: 0 10px 20px rgba(0,0,0,0.5); }
                .anime-card:hover { transform: scale(1.1) translateY(-10px); z-index: 10; box-shadow: 0 15px 30px rgba(229, 9, 20, 0.3); }
                .anime-card img { width: 100%; height: 360px; object-fit: cover; }
                
                .anime-card-info { 
                    position: absolute; bottom: 0; left: 0; width: 100%; padding: 20px 15px; 
                    background: linear-gradient(to top, rgba(0,0,0,0.95) 20%, transparent);
                    backdrop-filter: blur(2px);
                    opacity: 0; transition: 0.4s;
                }
                .anime-card:hover .anime-card-info { opacity: 1; }
                .anime-card-info h3 { font-size: 1.1rem; font-weight: 700; margin-bottom: 5px; color: #fff; }
                .anime-card-info p { font-size: 0.85rem; color: #E50914; font-weight: 600; }

                /* Shorts Styling (More Vertical) */
                .shorts-row { gap: 15px; }
                .short-card { flex: 0 0 180px; transition: transform 0.4s; cursor: pointer; }
                .short-thumbnail { width: 100%; aspect-ratio: 9/16; border-radius: 8px; overflow: hidden; position: relative; border: 2px solid transparent; transition: 0.3s; }
                .short-thumbnail img { width: 100%; height: 100%; object-fit: cover; }
                .short-card:hover .short-thumbnail { border-color: #E50914; box-shadow: 0 0 20px rgba(229, 9, 20, 0.4); }
                .short-card h3 { font-weight: 700; font-size: 0.9rem; color: #fff; margin-top: 10px; }

                /* Short Player Modal */
                .short-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.98); z-index: 2000; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(15px); }
                .short-modal-content { position: relative; height: 85vh; max-height: 800px; aspect-ratio: 9/16; margin: 0 auto; animation: modal-reveal 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
                @keyframes modal-reveal { from { transform: scale(0.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }
                
                .short-video-container { width: 100%; height: 100%; background: #000; border-radius: 12px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 20px 100px rgba(0,0,0,1); }
                .short-video-container iframe { width: 100%; height: 100%; }

                @media (max-width: 768px) {
                    .hero-carousel { height: 85vh; margin-bottom: -40px; }
                    .hero-content { padding: 0 5%; padding-top: 50vh; }
                    .hero-content h1 { font-size: 2.2rem; text-align: left; margin-bottom: 10px; }
                    .hero-content p { font-size: 0.95rem; text-align: left; -webkit-line-clamp: 4; line-height: 1.4; margin-bottom: 20px; }
                    .featured-badge { padding: 4px 10px; font-size: 0.75rem; border-left-width: 2px; }
                    .hero-btns { flex-direction: column; width: 100%; align-items: stretch; margin-top: 0px; gap: 10px; }
                    .hero-btns button { width: 100%; justify-content: center; padding: 12px; font-size: 1rem; border-radius: 4px; }
                    
                    .main-content { margin-top: 0; padding-top: 20px; }
                    .row-container { margin-bottom: 30px; }
                    .row-title { font-size: 1.3rem; margin-bottom: 15px; }
                    
                    /* Smaller Cards designed for horizontal swiping */
                    .anime-card { flex: 0 0 130px; border-radius: 6px; }
                    .anime-card img { height: 195px; }
                    .anime-card-info { opacity: 1; padding: 8px; background: linear-gradient(to top, rgba(0,0,0,0.95) 40%, transparent); }
                    .anime-card-info h3 { font-size: 0.85rem; line-height: 1.2; box-orient: vertical; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; }
                    .short-card { flex: 0 0 110px; }
                    .short-card h3 { font-size: 0.8rem; }
                    
                    .carousel-indicators { bottom: 60px; left: 5%; }
                    
                    .about-otaku-section { padding: 50px 0; }
                    .about-grid { grid-template-columns: 1fr !important; gap: 30px; text-align: center; }
                    .about-image img { height: 300px !important; border-radius: 8px; }
                    .about-text h2 { font-size: 1.8rem; }
                    .badge { margin: 0 auto; }
                    .social-cta { justify-content: center; }
                }

                .about-otaku-section { padding: 100px 0; border-top: 1px solid #222; }
                .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
                .otaku-profile-img { 
                    width: 100%; 
                    height: 550px; 
                    object-fit: cover; 
                    object-position: top; 
                    border-radius: 12px; 
                    box-shadow: 0 20px 40px rgba(0,0,0,0.6); 
                    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                    border: 1px solid transparent;
                }
                .otaku-profile-img:hover {
                    transform: scale(1.02) translateY(-10px);
                    box-shadow: 0 30px 60px rgba(229, 9, 20, 0.4);
                    border-color: rgba(229, 9, 20, 0.6);
                }
                .about-text h2 { 
                    font-size: 2.5rem; margin: 20px 0; font-weight: 900; 
                    background: linear-gradient(90deg, #fff, #ffb3b3, #E50914, #fff);
                    background-size: 200% auto;
                    color: transparent;
                    -webkit-background-clip: text;
                    animation: text-shine 4s linear infinite;
                    text-shadow: 0 0 20px rgba(229, 9, 20, 0.2);
                }
                @keyframes text-shine {
                    to { background-position: 200% center; }
                }
                .about-text p { 
                    font-size: 1.1rem; color: #aaa; line-height: 1.8; margin-bottom: 20px; 
                    transition: all 0.3s ease;
                    border-left: 2px solid transparent;
                    padding-left: 0;
                }
                .about-text p:hover {
                    color: #fff;
                    padding-left: 14px;
                    border-left: 2px solid #E50914;
                    text-shadow: 0 0 10px rgba(255,255,255,0.4);
                }
                .social-cta {
                    display: inline-block;
                    padding: 12px 24px;
                    background: rgba(229, 9, 20, 0.1);
                    border: 1px solid var(--primary);
                    border-radius: 6px;
                    color: #fff;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s;
                    box-shadow: 0 0 15px rgba(229, 9, 20, 0.2);
                    margin-top: 10px;
                }
                .social-cta:hover {
                    background: var(--primary);
                    box-shadow: 0 0 25px rgba(229, 9, 20, 0.6);
                    transform: translateY(-4px);
                }
                .social-cta p {
                    margin: 0; color: #fff; border: none; padding: 0; transition: none;
                }
                .social-cta:hover p {
                    padding: 0; border: none; text-shadow: 0 0 5px #fff;
                }
                .badge { background: #E50914; color: white; padding: 5px 12px; font-weight: bold; border-radius: 4px; font-size: 0.85rem; width: fit-content; text-transform: uppercase; box-shadow: 0 0 10px rgba(229, 9, 20, 0.4); }
                
                /* Partners Section */
                .partners-section { padding: 60px 0; border-top: 1px solid #222; }
                .partners-grid { display: flex; justify-content: center; gap: 40px; flex-wrap: wrap; }
                .partner-card {
                    display: flex; flex-direction: column; align-items: center; gap: 15px;
                    text-decoration: none; transition: all 0.3s ease; cursor: pointer;
                }
                .partner-logo {
                    width: 240px; height: 100px; background: #0c0c0c; border: 1px solid #333; border-radius: 8px;
                    display: flex; align-items: center; justify-content: center;
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                .partner-logo h3 { font-size: 1.4rem; font-weight: 900; color: #fff; letter-spacing: 1px; }
                .partner-card:hover .partner-logo {
                    transform: translateY(-8px) scale(1.05); border-color: var(--primary);
                    box-shadow: 0 15px 30px rgba(229, 9, 20, 0.3);
                }
                .partner-card p { color: #888; font-size: 0.95rem; transition: color 0.3s; font-weight: 500; }
                .partner-card:hover p { color: #fff; text-shadow: 0 0 8px rgba(255,255,255,0.4); }

                /* Guests Section */
                .guests-grid { display: flex; justify-content: center; gap: 50px; flex-wrap: wrap; }
                .guest-card { display: flex; flex-direction: column; align-items: center; text-align: center; max-width: 180px; }
                .guest-avatar-wrapper { position: relative; margin-bottom: 20px; width: 140px; height: 140px; border-radius: 50%; padding: 4px; background: linear-gradient(45deg, #111, #333); transition: all 0.4s ease; cursor: pointer; }
                .guest-card:hover .guest-avatar-wrapper { background: linear-gradient(45deg, var(--primary), #ffb3b3); transform: scale(1.05) translateY(-5px); }
                .guest-avatar { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; border: 4px solid #080808; position: relative; z-index: 2; }
                .guest-glow { position: absolute; top: 0; left: 0; right: 0; bottom: 0; border-radius: 50%; box-shadow: 0 0 20px rgba(229, 9, 20, 0); transition: all 0.4s ease; z-index: 1; }
                .guest-card:hover .guest-glow { box-shadow: 0 0 30px rgba(229, 9, 20, 0.6); }
                .guest-name { font-size: 1.1rem; font-weight: 800; color: #fff; margin-bottom: 5px; transition: color 0.3s; }
                .guest-card:hover .guest-name { color: var(--primary); text-shadow: 0 0 10px rgba(229, 9, 20, 0.4); }
                .guest-role { font-size: 0.85rem; color: #888; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; }
            `}</style>
        </div>
    );
};

export default Home;
