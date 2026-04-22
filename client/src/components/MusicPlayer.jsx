import React, { useState, useRef, useEffect } from 'react';
import { Music, Pause, Play, Volume2, Download } from 'lucide-react';
import API from '../api';

const MusicPlayer = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [isDownloading, setIsDownloading] = useState(false);
    const audioRef = useRef(null);

    const togglePlay = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
            // Track play only when starting
            API.post('/analytics/music/play').catch(e => console.error(e));
        }
        setIsPlaying(!isPlaying);
    };

    const handleDownload = async () => {
        const fileUrl = "/Lil Matimbe feat Vibe - otaku.mp3.mpeg";
        const fileName = "OtakuZone - Trilha Sonora.mp3";
        
        setIsDownloading(true);
        setDownloadProgress(0);

        try {
            const response = await fetch(fileUrl);
            const reader = response.body.getReader();
            const contentLength = +response.headers.get('Content-Length');
            
            let receivedLength = 0;
            let chunks = [];
            
            while(true) {
                const {done, value} = await reader.read();
                if (done) break;
                chunks.push(value);
                receivedLength += value.length;
                setDownloadProgress(Math.round((receivedLength / contentLength) * 100));
            }

            const blob = new Blob(chunks);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            
            // Track download
            API.post('/analytics/music/download').catch(e => console.error(e));
        } catch (error) {
            alert("Erro ao baixar a trilha.");
        } finally {
            setTimeout(() => {
                setIsDownloading(false);
                setDownloadProgress(0);
            }, 1000);
        }
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
                <span className="music-label">{isPlaying ? 'Lil Matimbe Ft Vibe - Otaku' : 'Trilha'}</span>
            </div>
            
            <button 
                onClick={handleDownload}
                className={`music-download-btn ${isDownloading ? 'loading' : ''}`}
                title="Baixar Trilha"
                disabled={isDownloading}
            >
                {isDownloading ? (
                    <div className="dl-progress-container">
                        <svg viewBox="0 0 36 36" className="circular-chart">
                            <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                            <path className="circle" strokeDasharray={`${downloadProgress}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        </svg>
                        <span className="dl-percent">{downloadProgress}%</span>
                    </div>
                ) : <Download size={14} />}
            </button>

            <style>{`
                .music-nav-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    background: rgba(255,255,255,0.03);
                    padding: 4px 12px;
                    border-radius: 20px;
                    border: 1px solid rgba(255,255,255,0.05);
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
                    cursor: pointer;
                    position: relative;
                }

                .music-download-btn:hover:not(:disabled) {
                    background: var(--primary);
                    color: white;
                    border-color: var(--primary);
                    transform: scale(1.1);
                }

                .dl-progress-container {
                    position: relative;
                    width: 28px;
                    height: 28px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .circular-chart { display: block; width: 100%; height: 100%; }
                .circle-bg { fill: none; stroke: rgba(255,255,255,0.1); stroke-width: 3.8; }
                .circle { fill: none; stroke: var(--primary); stroke-width: 3.8; stroke-linecap: round; transition: stroke-dasharray 0.3s ease; }
                .dl-percent { position: absolute; font-size: 8px; font-weight: bold; color: #fff; }

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
                    white-space: nowrap;
                    max-width: 250px;
                    overflow: hidden;
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
                    font-size: 0.7rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    overflow: hidden;
                    text-overflow: ellipsis;
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
                    .music-label { font-size: 0.7rem; max-width: 120px; display: block; white-space: nowrap; overflow: visible; }
                    .music-nav-item { padding: 4px; background: none; border: none; gap: 6px; }
                    .nav-visualizer { display: none; }
                }
            `}</style>
        </div>
    );
};

export default MusicPlayer;
