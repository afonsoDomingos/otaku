import React, { useState, useEffect } from 'react';
import API from '../api';
import { Play, Info, Flame } from 'lucide-react';
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
                .main-content { position: relative; z-index: 5; padding-top: 20px; padding-bottom: 100px; }
                .row-container { padding-left: 4%; margin-bottom: 40px; }
                .row-title { font-size: 1.6rem; margin-bottom: 20px; font-weight: 700; color: #e5e5e5; }
                .row-scroll { display: flex; gap: 15px; overflow-x: auto; padding-bottom: 20px; scrollbar-width: none; }
                .row-scroll::-webkit-scrollbar { display: none; }
                .short-card { flex: 0 0 160px; cursor: pointer; transition: transform 0.3s; }
                .short-card:hover { transform: scale(1.05); }
                .short-thumbnail { width: 100%; aspect-ratio: 9/16; border-radius: 8px; overflow: hidden; position: relative; border: 1px solid #333; }
                .short-thumbnail img { width: 100%; height: 100%; object-fit: cover; }
                .short-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; opacity: 0; transition: 0.3s; }
                .short-card:hover .short-overlay { opacity: 1; }
                .short-card h3 { font-size: 0.85rem; margin-top: 10px; font-weight: 500; color: #ccc; }

                /* Short Player Modal */
                .short-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.95); z-index: 1000; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(10px); }
                .short-modal-content { position: relative; display: flex; flex-direction: column; align-items: center; width: 100%; max-width: 400px; animation: modal-zoom 0.4s ease-out; }
                @keyframes modal-zoom { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
                
                .short-video-container { width: 100%; aspect-ratio: 9/16; background: #000; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 50px rgba(0,0,0,0.8); border: 1px solid #333; }
                .short-video-container iframe { width: 100%; height: 100%; }
                
                .close-short { position: absolute; top: -50px; right: 0; background: none; border: none; color: white; cursor: pointer; opacity: 0.7; transition: 0.3s; }
                .close-short:hover { opacity: 1; transform: rotate(90deg); }
                
                .short-modal-info { text-align: center; margin-top: 15px; }
                .short-modal-info h2 { font-size: 1.2rem; font-weight: 600; color: white; }

                @media (max-width: 768px) {
                    .hero-carousel { height: 75vh; }
                    .hero-content h1 { font-size: 2.8rem; }
                    .hero-content p { font-size: 1.1rem; -webkit-line-clamp: 2; }
                    .carousel-indicators { bottom: 180px; }
                    .short-modal-content { max-width: 90%; }
                }
            `}</style>
        </div>
    );
};

export default Home;
