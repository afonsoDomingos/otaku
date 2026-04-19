import React, { useState, useEffect } from 'react';
import API from '../api';
import { Play, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
    const [animes, setAnimes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [featured, setFeatured] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await API.get('/animes');
                setAnimes(data);
                
                // Extract unique categories
                const cats = [...new Set(data.map(a => a.category))];
                setCategories(cats);
                
                // Set a featured anime
                if (data.length > 0) {
                    setFeatured(data[Math.floor(Math.random() * data.length)]);
                }
            } catch (error) {
                console.error("Error fetching animes", error);
            }
        };
        fetchData();
    }, []);

    if (animes.length === 0) return <div style={{paddingTop: '100px', textAlign: 'center'}}>Carregando catálogo...</div>;

    return (
        <div className="home-page">
            {featured && (
                <div className="hero" style={{ backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.8) 20%, transparent), url(${featured.thumbnail})` }}>
                    <div className="hero-content">
                        <h1>{featured.title}</h1>
                        <p>{featured.description}</p>
                        <div className="hero-btns">
                            <Link to={`/anime/${featured._id}`} className="btn-primary" style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                <Play fill="white" /> Ver Temporadas
                            </Link>
                            <button className="btn-secondary" style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                <Info /> Saiba Mais
                            </button>
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
                                    <p>{anime.seasons.length} Temporadas</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            ))}

            <style>{`
                .home-page {
                    padding-bottom: 50px;
                }
                .hero {
                    height: 80vh;
                    background-size: cover;
                    background-position: center 20%;
                    display: flex;
                    align-items: center;
                    padding: 0 4%;
                }
                .hero-content {
                    max-width: 600px;
                }
                .hero-content h1 {
                    font-size: 3.5rem;
                    margin-bottom: 20px;
                }
                .hero-content p {
                    font-size: 1.2rem;
                    margin-bottom: 30px;
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                .hero-btns {
                    display: flex;
                    gap: 15px;
                }
            `}</style>
        </div>
    );
};

export default Home;
