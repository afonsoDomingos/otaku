import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api';
import { ChevronLeft, ChevronRight, Home } from 'lucide-react';

const MangaReader = () => {
    const { mangaId, chapterIndex } = useParams();
    const navigate = useNavigate();
    const [manga, setManga] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchManga = async () => {
            try {
                const { data } = await API.get(`/mangas/${mangaId}`);
                setManga(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                navigate('/mangas');
            }
        };
        fetchManga();
    }, [mangaId]);

    if (loading) return <div className="loading-screen">Carregando leitor...</div>;

    const chapter = manga.chapters[parseInt(chapterIndex)];

    return (
        <div className="manga-reader-page">
            <div className="reader-controls top">
                <button onClick={() => navigate('/mangas')}><Home size={20} /> Catálogo</button>
                <h2>{manga.title} - Cap {chapter.number}</h2>
                <div className="nav-btns">
                    {parseInt(chapterIndex) > 0 && (
                        <button onClick={() => navigate(`/manga-reader/${mangaId}/${parseInt(chapterIndex) - 1}`)}>
                            <ChevronLeft /> Anterior
                        </button>
                    )}
                    {parseInt(chapterIndex) < manga.chapters.length - 1 && (
                        <button onClick={() => navigate(`/manga-reader/${mangaId}/${parseInt(chapterIndex) + 1}`)}>
                            Próximo <ChevronRight />
                        </button>
                    )}
                </div>
            </div>

            <div className="pages-container">
                {chapter.pages.map((page, idx) => (
                    <img key={idx} src={page} alt={`Page ${idx + 1}`} loading="lazy" />
                ))}
            </div>

            <div className="reader-controls bottom">
                <div className="nav-btns">
                    {parseInt(chapterIndex) > 0 && (
                        <button onClick={() => navigate(`/manga-reader/${mangaId}/${parseInt(chapterIndex) - 1}`)}>
                            Anterior
                        </button>
                    )}
                    {parseInt(chapterIndex) < manga.chapters.length - 1 && (
                        <button onClick={() => navigate(`/manga-reader/${mangaId}/${parseInt(chapterIndex) + 1}`)}>
                            Próximo Capítulo
                        </button>
                    )}
                </div>
            </div>

            <style>{`
                .manga-reader-page { background: #000; min-height: 100vh; color: white; }
                .reader-controls { background: rgba(20,20,20,0.9); padding: 15px 4%; display: flex; justify-content: space-between; align-items: center; position: sticky; z-index: 100; }
                .reader-controls.top { top: 0; }
                .reader-controls.bottom { bottom: 0; justify-content: center; padding: 30px; }
                .nav-btns { display: flex; gap: 15px; }
                .nav-btns button { background: var(--primary); color: white; padding: 8px 20px; border-radius: 4px; display: flex; align-items: center; gap: 5px; font-weight: bold; }
                
                .pages-container { display: flex; flex-direction: column; align-items: center; padding: 20px 0; }
                .pages-container img { max-width: 900px; width: 100%; margin-bottom: 2px; }
                
                @media (max-width: 768px) {
                    .reader-controls h2 { font-size: 1rem; }
                    .pages-container img { width: 100%; }
                }
            `}</style>
        </div>
    );
};

export default MangaReader;
