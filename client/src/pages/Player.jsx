import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api';
import { ChevronLeft, List } from 'lucide-react';

const Player = () => {
    const { animeId, seasonIndex, episodeIndex } = useParams();
    const [anime, setAnime] = useState(null);
    const [episode, setEpisode] = useState(null);

    useEffect(() => {
        const fetchAnime = async () => {
            const { data } = await API.get(`/animes/${animeId}`);
            setAnime(data);
            setEpisode(data.seasons[seasonIndex].episodes[episodeIndex]);
        };
        fetchAnime();
    }, [animeId, seasonIndex, episodeIndex]);

    if (!episode) return <div style={{paddingTop: '100px', textAlign: 'center'}}>Carregando player...</div>;

    return (
        <div className="player-page">
            <div className="player-header">
                <Link to={`/anime/${animeId}`} className="back-btn"><ChevronLeft /> Voltar</Link>
                <div className="player-title">
                    <span>{anime.title}</span> - {anime.seasons[seasonIndex].title} - {episode.title}
                </div>
            </div>

            <div className="video-container">
                {/* Netflix style player placeholder */}
                <iframe 
                    src={episode.videoUrl} 
                    title={episode.title}
                    frameBorder="0" 
                    allowFullScreen
                    className="main-video"
                ></iframe>
            </div>

            <div className="episodes-sidebar">
                <h3><List size={18} /> Episódios</h3>
                <div className="episodes-list">
                    {anime.seasons[seasonIndex].episodes.map((ep, idx) => (
                        <Link 
                            key={idx} 
                            to={`/player/${animeId}/${seasonIndex}/${idx}`}
                            className={`ep-item ${parseInt(episodeIndex) === idx ? 'active' : ''}`}
                        >
                            <span className="ep-num">{idx + 1}</span>
                            <span className="ep-name">{ep.title}</span>
                        </Link>
                    ))}
                </div>
            </div>

            <style>{`
                .player-page { height: 100vh; background: black; display: flex; flex-direction: column; }
                .player-header { height: 70px; display: flex; align-items: center; padding: 0 4%; gap: 20px; background: rgba(0,0,0,0.5); position: absolute; top: 0; width: 100%; z-index: 10; opacity: 0; transition: opacity 0.3s; }
                .player-page:hover .player-header { opacity: 1; }
                
                .back-btn { display: flex; align-items: center; gap: 5px; font-weight: bold; }
                .player-title { font-size: 1.1rem; }
                .player-title span { color: var(--primary); font-weight: bold; }

                .video-container { flex: 1; display: flex; align-items: center; justify-content: center; background: #000; }
                .main-video { width: 100%; height: 100%; max-height: 100vh; border: none; }

                .episodes-sidebar { width: 300px; background: #111; position: absolute; right: 0; top: 70px; bottom: 0; border-left: 1px solid #333; transform: translateX(100%); transition: transform 0.3s; padding: 20px; }
                .player-page:hover .episodes-sidebar { transform: translateX(0); }
                
                .episodes-list { margin-top: 20px; display: flex; flex-direction: column; gap: 10px; }
                .ep-item { padding: 12px; border-radius: 4px; background: #222; display: flex; gap: 15px; align-items: center; }
                .ep-item.active { border: 1px solid var(--primary); background: #333; }
                .ep-num { font-weight: bold; color: #888; }
                .ep-name { font-size: 0.9rem; }
            `}</style>
        </div>
    );
};

export default Player;
