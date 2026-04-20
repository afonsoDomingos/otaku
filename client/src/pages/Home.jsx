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
    const [loading, setLoading] = useState(true);
    const [activeHero, setActiveHero] = useState(0);

    const fetchData = async () => {
        try {
            const [aRes, sRes] = await Promise.all([
                API.get('/animes'),
                API.get('/shorts')
            ]);
            setAnimes(aRes.data);
            setShorts(sRes.data);
            
            const cats = [...new Set(aRes.data.map(a => a.category))];
            setCategories(cats);
            setFeaturedAnimes(aRes.data.slice(0, 3));
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
        anime.title.toLowerCase().includes((searchQuery || "").toLowerCase()) ||
        anime.category.toLowerCase().includes((searchQuery || "").toLowerCase())
    );

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
                            style={{ backgroundImage: `linear-gradient(to top, #141414, transparent 50%), linear-gradient(to right, #141414 30%, transparent), url(${anime.thumbnail})` }}
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

            <div className="main-content">
                {searchQuery ? (
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
                        <div className="row-container">
                            <h2 className="row-title">Novidades no OtakuZone</h2>
                            <div className="row-scroll">
                                {animes.slice().reverse().slice(0, 6).map(anime => (
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
                    </>
                )}
            </div>

                <section className="about-otaku-section container">
                    <div className="about-grid">
                        <div className="about-image">
                            <img src="/images/OTAKU.png" alt="Bem-vindo Otaku" />
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
                            <div className="social-cta">
                                <p>Junta-te ao nosso Podcast e debates semanais!</p>
                            </div>
                        </div>
                    </div>
                </section>

                <Footer />

            <style>{`
                .home-page { background: #141414; min-height: 100vh; color: white; }
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
                .hero-content p { font-size: 1.25rem; line-height: 1.4; color: #f3f3f3; margin-bottom: 30px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; max-width: 600px; }
                .hero-btns { display: flex; gap: 15px; }
                .carousel-indicators { position: absolute; bottom: 200px; left: 4%; display: flex; gap: 12px; z-index: 10; }
                .indicator { width: 35px; height: 3px; background: rgba(255,255,255,0.25); cursor: pointer; border-radius: 2px; transition: 0.4s; }
                .indicator.active { background: #E50914; width: 60px; }
                /* Cinematic Rows */
                .main-content { position: relative; z-index: 5; margin-top: -10vw; padding-bottom: 100px; background: linear-gradient(to bottom, transparent, #141414 5%); }
                .row-container { padding-left: 4%; margin-bottom: 50px; }
                .row-title { font-size: 1.8rem; margin-bottom: 25px; font-weight: 800; color: #fff; letter-spacing: -0.5px; position: relative; display: inline-block; }
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
                .short-modal-content { position: relative; width: 100%; max-width: 420px; animation: modal-reveal 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
                @keyframes modal-reveal { from { transform: scale(0.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }
                
                .short-video-container { width: 100%; aspect-ratio: 9/16; background: #000; border-radius: 20px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 20px 100px rgba(0,0,0,1); }
                .short-video-container iframe { width: 100%; height: 100%; }

                @media (max-width: 768px) {
                    .hero-carousel { height: 95vh; }
                    .hero-content { padding: 0 5%; padding-top: 20vh; }
                    .hero-content h1 { font-size: 2.2rem; text-align: left; }
                    .hero-content p { font-size: 0.95rem; text-align: left; -webkit-line-clamp: 5; line-height: 1.5; margin-bottom: 25px; }
                    .hero-btns { flex-direction: column; width: 100%; align-items: stretch; margin-top: 20px; gap: 10px; }
                    .hero-btns button { width: 100%; justify-content: center; padding: 12px; font-size: 0.9rem; }
                    
                    .main-content { margin-top: 0; padding-top: 20px; }
                    .row-title { font-size: 1.25rem; font-weight: 800; }
                    .anime-card { flex: 0 0 140px; }
                    .anime-card img { height: 210px; }
                    .anime-card-info { opacity: 1; padding: 10px; background: linear-gradient(to top, rgba(0,0,0,0.9), transparent); }
                    .anime-card-info h3 { font-size: 0.8rem; }
                    
                    .carousel-indicators { bottom: 280px; left: 5%; transform: none; }
                    .about-grid { grid-template-columns: 1fr !important; text-align: center; }
                    .about-image img { height: 300px !important; }
                }

                .about-otaku-section { padding: 100px 0; border-top: 1px solid #222; }
                .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
                .about-image img { width: 100%; height: 500px; object-fit: cover; border-radius: 12px; box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
                .about-text h2 { font-size: 2.5rem; margin: 20px 0; font-weight: 800; }
                .about-text p { font-size: 1.1rem; color: #aaa; line-height: 1.8; margin-bottom: 20px; }
                .badge { background: #E50914; color: white; padding: 5px 12px; font-weight: bold; border-radius: 4px; font-size: 0.85rem; width: fit-content; }
            `}</style>
        </div>
    );
};

export default Home;
