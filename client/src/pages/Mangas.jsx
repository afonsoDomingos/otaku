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
                
                .mangas-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; padding: 40px 0; min-height: 40vh; }
                .empty-state { grid-column: 1 / -1; text-align: center; color: #757575; padding: 100px 0; }
                .empty-state p { margin-top: 20px; font-size: 1.1rem; }
            `}</style>
        </div>
    );
};

export default Mangas;
