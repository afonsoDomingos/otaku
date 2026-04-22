import React, { useState, useRef, useEffect } from 'react';
import { Music, Pause, Play, Volume2 } from 'lucide-react';

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
        <div className="music-player-widget">
            <audio 
                ref={audioRef} 
                src="/Lil Matimbe feat Vibe - otaku.mp3.mpeg" 
                loop 
                onEnded={() => setIsPlaying(false)}
            />
            
            <div className={`player-container ${isPlaying ? 'playing' : ''}`} onClick={togglePlay} title="Tocar Trilha OtakuZone">
                {isPlaying && (
                    <div className="visualizer">
                        <div className="bar"></div>
                        <div className="bar"></div>
                        <div className="bar"></div>
                        <div className="bar"></div>
                    </div>
                )}
                <div className="icon-wrapper">
                    {isPlaying ? <Pause size={20} /> : <Music size={20} />}
                </div>
                <span className="player-text">
                    {isPlaying ? 'A Tocar: Trilha Otaku' : 'Trilha OtakuZone'}
                </span>
            </div>

            <style>{`
                .music-player-widget {
                    position: fixed;
                    bottom: 40px;
                    left: 40px;
                    z-index: 9999;
                }

                .player-container {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    background: rgba(20, 20, 20, 0.85);
                    backdrop-filter: blur(10px);
                    padding: 10px 20px;
                    border-radius: 50px;
                    border: 1px solid rgba(229, 9, 20, 0.3);
                    color: white;
                    cursor: pointer;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    max-width: 50px;
                    overflow: hidden;
                    white-space: nowrap;
                }

                .player-container:hover {
                    max-width: 250px;
                    border-color: #E50914;
                    box-shadow: 0 15px 40px rgba(229, 9, 20, 0.2);
                }

                .player-container.playing {
                    max-width: 250px;
                    border-color: #E50914;
                    background: rgba(229, 9, 20, 0.1);
                }

                .icon-wrapper {
                    min-width: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #E50914;
                    animation: pulse-music 2s infinite;
                }

                @keyframes pulse-music {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.1); opacity: 0.8; }
                    100% { transform: scale(1); opacity: 1; }
                }

                .player-text {
                    font-size: 0.85rem;
                    font-weight: 700;
                    letter-spacing: 0.5px;
                }

                .visualizer {
                    display: flex;
                    align-items: flex-end;
                    gap: 2px;
                    height: 15px;
                }

                .bar {
                    width: 3px;
                    background: #E50914;
                    border-radius: 1px;
                }

                .playing .bar:nth-child(1) { height: 100%; animation: equalize 0.8s infinite ease-in-out; }
                .playing .bar:nth-child(2) { height: 60%; animation: equalize 0.5s infinite ease-in-out; }
                .playing .bar:nth-child(3) { height: 80%; animation: equalize 0.7s infinite ease-in-out; }
                .playing .bar:nth-child(4) { height: 40%; animation: equalize 0.6s infinite ease-in-out; }

                @keyframes equalize {
                    0%, 100% { transform: scaleY(0.5); }
                    50% { transform: scaleY(1); }
                }

                @media (max-width: 768px) {
                    .music-player-widget {
                        bottom: 85px; /* Above the bottom navigation if exists */
                        left: 20px;
                    }
                    .player-container {
                        padding: 8px 12px;
                    }
                }
            `}</style>
        </div>
    );
};

export default MusicPlayer;
