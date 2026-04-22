import React, { useState, useRef, useEffect } from 'react';
import { Music, Pause, Play, Volume2, Download } from 'lucide-react';

const MusicPlayer = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [showVisualizer, setShowVisualizer] = useState(false);
    const audioRef = useRef(null);

    const togglePlay = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <div className="music-nav-item">
            <audio 
                ref={audioRef} 
                src="/Lil Matimbe feat Vibe - otaku.mp3.mpeg" 
                loop 
                onEnded={() => setIsPlaying(false)}
            />
            
            <div className={`music-btn ${isPlaying ? 'playing' : ''}`} onClick={togglePlay} title="Trilha OtakuZone">
                <div className="music-icon-wrapper">
                    {isPlaying ? (
                        <div className="nav-visualizer">
                            <div className="v-bar"></div>
                            <div className="v-bar"></div>
                            <div className="v-bar"></div>
                        </div>
                    ) : <Music size={18} />}
                </div>
                <span className="music-label">{isPlaying ? 'Tocando' : 'Trilha'}</span>
            </div>
            
            <a 
                href="/Lil Matimbe feat Vibe - otaku.mp3.mpeg" 
                download="OtakuZone - Trilha Sonora.mp3"
                className="music-download-btn"
                title="Baixar Trilha"
            >
                <Download size={14} />
            </a>

            <style>{`
                .music-nav-item {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .music-download-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.05);
                    color: #888;
                    transition: all 0.3s;
                    border: 1px solid rgba(255,255,255,0.1);
                }

                .music-download-btn:hover {
                    background: var(--primary);
                    color: white;
                    border-color: var(--primary);
                    transform: scale(1.1);
                }

                .music-btn {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    background: rgba(255, 255, 255, 0.05);
                    padding: 6px 12px;
                    border-radius: 20px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    cursor: pointer;
                    transition: all 0.3s;
                    color: #fff;
                }

                .music-btn:hover {
                    background: rgba(229, 9, 20, 0.1);
                    border-color: rgba(229, 9, 20, 0.5);
                    transform: translateY(-2px);
                }

                .music-btn.playing {
                    background: rgba(229, 9, 20, 0.2);
                    border-color: var(--primary);
                    box-shadow: 0 0 15px rgba(229, 9, 20, 0.3);
                }

                .music-icon-wrapper {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--primary);
                }

                .music-label {
                    font-size: 0.75rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .nav-visualizer {
                    display: flex;
                    align-items: flex-end;
                    gap: 2px;
                    height: 12px;
                }

                .v-bar {
                    width: 2px;
                    background: var(--primary);
                    border-radius: 1px;
                }

                .playing .v-bar:nth-child(1) { height: 100%; animation: equalize-nav 0.8s infinite ease-in-out; }
                .playing .v-bar:nth-child(2) { height: 60%; animation: equalize-nav 0.5s infinite ease-in-out; }
                .playing .v-bar:nth-child(3) { height: 80%; animation: equalize-nav 0.7s infinite ease-in-out; }

                @keyframes equalize-nav {
                    0%, 100% { transform: scaleY(0.5); }
                    50% { transform: scaleY(1); }
                }

                @media (max-width: 768px) {
                    .music-label { display: none; }
                    .music-btn { padding: 8px; border-radius: 50%; }
                }
            `}</style>
        </div>
    );
};

export default MusicPlayer;
