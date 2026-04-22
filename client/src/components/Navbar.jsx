import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSearch } from '../context/SearchContext';
import { Search, Bell, User, LogOut, X } from 'lucide-react';
import MusicPlayer from './MusicPlayer';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { searchQuery, setSearchQuery } = useSearch();
    const [isScrolled, setIsScrolled] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [imgError, setImgError] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setImgError(false); // Reset error when user changes
    }, [user]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
            <div className="nav-left">
                <Link to="/" className="logo">OTAKUZONE<span>FLIX</span></Link>
                <div style={{ marginRight: '20px' }}>
                    <MusicPlayer />
                </div>
                <div className="nav-links">
                    <Link to="/">Início</Link>
                    <Link to="/mangas">Mangás</Link>
                    <Link to="/podcast-agenda">Podcast</Link>
                    {user && <Link to="/my-purchases">Compras</Link>}
                    {user?.role === 'admin' && <Link to="/admin">Admin</Link>}
                </div>
            </div>
            <div className="nav-right">
                <div className={`search-box ${showSearch ? 'active' : ''}`}>
                    <Search className="nav-icon" onClick={() => setShowSearch(!showSearch)} />
                    {showSearch && (
                        <>
                            <input 
                                type="text" 
                                placeholder="Títulos, gêneros..." 
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    if(window.location.pathname !== '/') navigate('/');
                                }}
                                autoFocus
                            />
                            <X size={16} className="close-search" onClick={() => {
                                setShowSearch(false);
                                setSearchQuery('');
                            }} />
                        </>
                    )}
                </div>
                <Bell className="nav-icon" />
                {user ? (
                    <div className="user-menu">
                        <div className="nav-avatar-wrapper">
                            {!imgError && user.profilePic ? (
                                <img 
                                    src={user.profilePic} 
                                    alt="Profile" 
                                    className="nav-avatar" 
                                    onError={() => setImgError(true)}
                                />
                            ) : (
                                <div className="nav-avatar-fallback">
                                    <User size={16} />
                                </div>
                            )}
                        </div>
                        <div className="dropdown">
                            <p>{user.name}</p>
                            <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem', padding: '5px 0' }}><User size={16} /> Perfil</Link>
                            <button onClick={logout} style={{ marginTop: '5px' }}><LogOut size={16} /> Sair</button>
                        </div>
                    </div>
                ) : (
                    <Link to="/login" className="btn-primary nav-login-btn">Login</Link>
                )}
            </div>

            <style>{`
                .navbar {
                    position: fixed;
                    top: 0;
                    width: 100%;
                    height: 70px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0 4%;
                    z-index: 1000;
                    transition: background-color 0.3s ease;
                    background: linear-gradient(to bottom, rgba(0,0,0,0.7) 10%, transparent);
                }
                .navbar.scrolled {
                    background-color: #141414;
                }
                .logo {
                    font-size: 1.8rem;
                    font-weight: 900;
                    color: var(--primary);
                    margin-right: 25px;
                    letter-spacing: -1px;
                    display: inline-block;
                    text-shadow: 0 0 10px rgba(229, 9, 20, 0.8), 0 0 20px rgba(229, 9, 20, 0.4);
                    animation: logo-pulse 3s ease-in-out infinite alternate;
                    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), text-shadow 0.3s;
                }
                .logo span {
                    color: white;
                    text-shadow: 0 0 10px rgba(255, 255, 255, 0.6);
                }
                @keyframes logo-pulse {
                    0% { text-shadow: 0 0 10px rgba(229, 9, 20, 0.6), 0 0 20px rgba(229, 9, 20, 0.2); }
                    100% { text-shadow: 0 0 15px rgba(229, 9, 20, 1), 0 0 30px rgba(229, 9, 20, 0.6), 0 0 45px rgba(229, 9, 20, 0.2); }
                }
                .logo:hover {
                    transform: scale(1.08) rotate(-1deg);
                    animation-play-state: paused;
                    text-shadow: 0 0 25px rgba(229, 9, 20, 1), 0 0 50px rgba(229, 9, 20, 0.8);
                }
                .nav-left {
                    display: flex;
                    align-items: center;
                }
                .nav-links {
                    display: flex;
                    gap: 20px;
                }
                .nav-links a {
                    font-size: 0.95rem;
                    color: #e5e5e5;
                    transition: all 0.3s;
                    position: relative;
                    padding: 5px 0;
                    font-weight: 500;
                }
                .nav-links a::after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    height: 2px;
                    background: linear-gradient(90deg, transparent, var(--primary), transparent);
                    background-size: 200% 100%;
                    animation: katana-slash 3s linear infinite;
                    opacity: 0.4;
                    border-radius: 2px;
                }
                @keyframes katana-slash {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
                .nav-links a:hover {
                    color: #fff;
                    text-shadow: 0 0 12px rgba(229, 9, 20, 0.8);
                }
                .nav-links a:hover::after {
                    animation-play-state: paused;
                    opacity: 1;
                    background: var(--primary);
                    box-shadow: 0 0 8px var(--primary);
                }
                .nav-right {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                }
                .nav-icon {
                    cursor: pointer;
                    width: 20px;
                    color: white;
                }
                .nav-avatar-wrapper {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    overflow: hidden;
                    border: 2px solid transparent;
                    transition: border-color 0.3s;
                    cursor: pointer;
                }
                .user-menu:hover .nav-avatar-wrapper {
                    border-color: var(--primary);
                }
                .nav-avatar {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .nav-avatar-fallback {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #333;
                    color: #fff;
                }
                .user-menu {
                    position: relative;
                }
                .user-menu:hover .dropdown {
                    display: block;
                }
                .dropdown {
                    display: none;
                    position: absolute;
                    top: 100%;
                    right: 0;
                    background: rgba(0,0,0,0.9);
                    border: 1px solid #333;
                    padding: 10px;
                    min-width: 150px;
                    border-radius: 4px;
                }
                .dropdown p {
                    font-size: 0.8rem;
                    margin-bottom: 10px;
                    border-bottom: 1px solid #333;
                    padding-bottom: 5px;
                }
                .search-box {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    background: transparent;
                    border: none;
                    transition: all 0.3s ease;
                    padding: 5px;
                }
                .search-box.active {
                    background: rgba(0,0,0,0.8);
                    border: 1px solid var(--primary);
                    border-radius: 6px;
                    box-shadow: 0 0 0 4px rgba(229, 9, 20, 0.15), 0 0 15px rgba(229, 9, 20, 0.2);
                }
                .search-box input {
                    background: transparent;
                    border: none;
                    box-shadow: none;
                    transform: none;
                    color: white;
                    outline: none;
                    width: 200px;
                    font-size: 0.9rem;
                    padding: 0;
                }
                .search-box input:focus {
                    background: transparent;
                    border: none;
                    box-shadow: none;
                    transform: none;
                }
                .close-search {
                    cursor: pointer;
                    color: #ccc;
                }
                .dropdown button {
                    background: none;
                    color: white;
                    width: 100%;
                    text-align: left;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 0.8rem;
                }
                .nav-login-btn { padding: 8px 20px; font-size: 0.9rem; }
                @media (max-width: 768px) {
                    .navbar { height: 60px; padding: 0 15px; }
                    .logo { font-size: 1.2rem; margin-right: 10px; letter-spacing: -0.5px; }
                    .nav-left { flex: 1; overflow: hidden; }
                    .nav-links { gap: 12px; overflow-x: auto; white-space: nowrap; scrollbar-width: none; padding-bottom: 5px; }
                    .nav-links::-webkit-scrollbar { display: none; }
                    .nav-links a { font-size: 0.85rem; padding: 5px 0; }
                    .nav-right { gap: 12px; }
                    .nav-icon { width: 18px; }
                    .search-box input { width: 100%; font-size: 0.85rem; }
                    .user-menu p { display: none; } /* Hide user name on very tiny screens */
                    .nav-login-btn { padding: 6px 12px; font-size: 0.8rem; }
                }
            `}</style>
        </nav>
    );
};

export default Navbar;
