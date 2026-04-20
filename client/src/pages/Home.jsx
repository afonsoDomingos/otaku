import React, { useState, useEffect } from 'react';
import API from '../api';
import { Play, Info, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

const Home = () => {
    const [animes, setAnimes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [featured, setFeatured] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await API.get('/animes');
                setAnimes(data);
                
                const cats = [...new Set(data.map(a => a.category))];
                setCategories(cats);
                
                if (data.length > 0) {
                    setFeatured(data[0]); // Pega o primeiro como destaque principal
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching animes", error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="skeleton-container">
                <div className="skeleton-hero"></div>
                <div className="skeleton-row"></div>
                <style>{`
                    .skeleton-container { padding-top: 70px; }
                    .skeleton-hero { height: 70vh; background: #222; margin-bottom: 20px; animation: pulse 1.5s infinite; }
                    .skeleton-row { height: 200px; width: 92%; margin: 40px auto; background: #222; animation: pulse 1.5s infinite; }
                    @keyframes pulse { 0% { opacity: 0.5; } 50% { opacity: 0.8; } 100% { opacity: 0.5; } }
                `}</style>
            </div>
        );
    }

    return (
        <div className="home-page">
            {featured && (
                <div className="hero" style={{ 
                    backgroundImage: `linear-gradient(to top, #141414 5%, transparent 40%), linear-gradient(to right, rgba(0,0,0,0.8) 30%, transparent 70%), url(${featured.thumbnail})` 
                }}>
                    <div className="hero-content">
                        <div className="featured-badge">
                            <Flame size={16} fill="#E50914" color="#E50914" />
                            <span>EM DESTAQUE</span>
                        </div>
                        <h1>{featured.title}</h1>
                        <p>{featured.description}</p>
                        <div className="hero-btns">
                            <Link to={`/anime/${featured._id}`} className="btn-primary" style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                <Play fill="white" /> Assitir Agora
                            </Link>
                            <button className="btn-secondary" style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                <Info /> Mais Informações
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="main-content">
                {/* Novidades Row */}
                <div className="row-container">
                    <h2 className="row-title">Novidades no OtakuZone</h2>
                    <div className="row-scroll">
                        {animes.slice().reverse().slice(0, 6).map(anime => (
                            <Link to={`/anime/${anime._id}`} key={`new-${anime._id}`} className="anime-card">
                                <img src={anime.thumbnail} alt={anime.title} />
                                <div className="anime-card-info">
                                    <h3>{anime.title}</h3>
                                    <p>{anime.seasons.length} Temporadas</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Category Rows */}
                {categories.map(cat => (
                    <div key={cat} className="row-container">
                        <h2 className="row-title">{cat}</h2>
                        <div className="row-scroll">
                            {animes.filter(a => a.category === cat).map(anime => (
                                <Link to={`/anime/${anime._id}`} key={anime._id} className="anime-card">
                                    <img src={anime.thumbnail} alt={anime.title} />
                                    <div className="anime-card-info">
                                        <h3>{anime.title}</h3>
                                        <p>{anime.seasons.length} Temporadas</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <Footer />

            <style>{`
                .home-page {
                    background-color: #141414;
                }
                .hero {
                    height: 85vh;
                    background-size: cover;
                    background-position: center 20%;
                    display: flex;
                    align-items: center;
                    padding: 0 4%;
                }
                .featured-badge {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    background: rgba(0,0,0,0.5);
                    width: fit-content;
                    padding: 4px 12px;
                    border-radius: 4px;
                    margin-bottom: 15px;
                    font-size: 0.8rem;
                    font-weight: bold;
                    letter-spacing: 1px;
                }
                .hero-content {
                    max-width: 650px;
                    text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
                }
                .hero-content h1 {
                    font-size: clamp(2.5rem, 8vw, 4.5rem);
                    margin-bottom: 20px;
                    line-height: 1.1;
                    font-weight: 800;
                }
                .hero-content p {
                    font-size: 1.2rem;
                    margin-bottom: 30px;
                    color: #fff;
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    max-width: 500px;
                }
                .hero-btns {
                    display: flex;
                    gap: 15px;
                }
                .main-content {
                    position: relative;
                    margin-top: -100px;
                    z-index: 2;
                    background: linear-gradient(transparent, #141414 10%);
                    padding-bottom: 100px;
                }
                @media (max-width: 768px) {
                    .hero { height: 70vh; }
                    .hero-content h1 { font-size: 2.5rem; }
                    .main-content { margin-top: -50px; }
                }
            `}</style>
        </div>
    );
};

export default Home;
