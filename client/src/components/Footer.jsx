import React from 'react';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-socials">
                    <a href="https://www.youtube.com/@Universo_Otaku_Podcast" target="_blank" rel="noreferrer" title="YouTube" className="youtube-text">
                        <span>YouTube</span>
                    </a>
                    <a href="https://www.tiktok.com/@universo_otaku4" target="_blank" rel="noreferrer" title="TikTok" className="tiktok-icon">
                        <span>TikTok</span>
                    </a>
                </div>
                <div className="footer-links">
                    <div className="footer-column">
                        <p>Dúvidas? Ligue 800 800 800</p>
                        <a href="#">FAQ</a>
                        <a href="#">Relações com investidores</a>
                        <a href="#">Formas de assistir</a>
                    </div>
                    <div className="footer-column">
                        <a href="#">Centro de ajuda</a>
                        <a href="#">Carreiras</a>
                        <a href="#">Termos de uso</a>
                    </div>
                    <div className="footer-column">
                        <a href="#">Conta</a>
                        <a href="#">Resgatar cartões-presente</a>
                        <a href="#">Privacidade</a>
                    </div>
                    <div className="footer-column">
                        <a href="#">Media Center</a>
                        <a href="#">Comprar cartões-presente</a>
                        <a href="#">Preferências de cookies</a>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} OtakuZoneFlix - Todos os direitos reservados.</p>
                </div>
            </div>
            <style>{`
                .footer {
                    background-color: #141414;
                    color: #757575;
                    padding: 50px 4% 20px;
                    font-size: 0.9rem;
                    border-top: 8px solid #222;
                }
                .footer-socials {
                    display: flex;
                    gap: 25px;
                    margin-bottom: 25px;
                    color: white;
                }
                .footer-socials a {
                    color: white;
                    opacity: 0.8;
                    transition: opacity 0.2s;
                    display: flex;
                    align-items: center;
                }
                .footer-socials a:hover {
                    opacity: 1;
                }
                .tiktok-icon span, .youtube-text span {
                    font-weight: bold;
                    font-size: 0.8rem;
                    border: 1px solid white;
                    padding: 2px 8px;
                    border-radius: 4px;
                }
                .youtube-text span {
                    border-color: var(--primary);
                    color: var(--primary);
                }
                .footer-content {
                    max-width: 1000px;
                    margin: 0 auto;
                }
                .footer-links {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                    gap: 20px;
                    margin-bottom: 30px;
                }
                .footer-column {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                .footer-column a {
                    color: #757575;
                    text-decoration: none;
                }
                .footer-column a:hover {
                    text-decoration: underline;
                }
                .footer-bottom {
                    text-align: center;
                    padding-top: 20px;
                    border-top: 1px solid #333;
                }
            `}</style>
        </footer>
    );
};

export default Footer;
