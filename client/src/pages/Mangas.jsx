import React, { useState, useEffect } from 'react';
import API from '../api';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { BookOpen } from 'lucide-react';

const Mangas = () => {
    const [mangas, setMangas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMangas = async () => {
            try {
                const { data } = await API.get('/mangas');
                setMangas(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchMangas();
        window.scrollTo(0, 0);
    }, []);

    if (loading) return <div className="loading-screen">Carregando mangás...</div>;

    return (
        <div className="mangas-page">
            <div className="mangas-hero">
                <div className="container">
                    <h1>Explore o Universo de Mangás</h1>
                    <p>Leia suas histórias favoritas, do clássico ao moderno, direto na OtakuZone.</p>
                </div>
            </div>

            <div className="container">
                <div className="mangas-grid">
                    {mangas.length > 0 ? (
                        mangas.map(manga => (
                            <div key={manga._id} className="manga-item">
                                <Link to={`/manga/${manga._id}`} className="anime-card">
                                    <img src={manga.thumbnail} alt={manga.title} />
                                    <div className="anime-card-info">
                                        <h3>{manga.title}</h3>
                                        <p>{manga.chapters?.length || 0} Capítulos</p>
                                    </div>
                                </Link>
                            </div>
                        ))
                    ) : (
                        <div className="empty-state">
                            <BookOpen size={48} />
                            <p>Em breve teremos o maior catálogo de mangás para você!</p>
                        </div>
                    )}
                </div>
            </div>

            <Footer />

            <style>{`
                .mangas-page { background: #141414; min-height: 100vh; padding-top: 70px; }
                .mangas-hero { padding: 60px 4%; background: linear-gradient(rgba(0,0,0,0.5), #141414), url('https://w0.peakpx.com/wallpaper/32/731/HD-wallpaper-manga-background-panel.jpg'); background-size: cover; margin-bottom: 40px; }
                .mangas-hero h1 { font-size: 3rem; margin-bottom: 15px; font-weight: 800; }
                .mangas-hero p { font-size: 1.2rem; color: #ccc; max-width: 600px; }
                
                .mangas-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 30px; padding: 40px 0; min-height: 40vh; }
                .empty-state { grid-column: 1 / -1; text-align: center; color: #757575; padding: 100px 0; }
                .empty-state p { margin-top: 20px; font-size: 1.1rem; }

                .anime-card { position: relative; border-radius: 8px; overflow: hidden; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); cursor: pointer; box-shadow: 0 10px 20px rgba(0,0,0,0.5); display: block; }
                .anime-card:hover { transform: scale(1.05) translateY(-10px); z-index: 10; box-shadow: 0 15px 30px rgba(229, 9, 20, 0.3); }
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

                @media (max-width: 768px) {
                    .mangas-hero h1 { font-size: 2.2rem; }
                    .mangas-grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 15px; }
                    .anime-card img { height: 240px; }
                    .anime-card-info { opacity: 1; background: linear-gradient(to top, rgba(0,0,0,0.8), transparent); }
                }
            `}</style>
        </div>
    );
};

export default Mangas;
