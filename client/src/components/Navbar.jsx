import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSearch } from '../context/SearchContext';
import { Search, Bell, User, LogOut, X, Menu, ChevronDown } from 'lucide-react';
import MusicPlayer from './MusicPlayer';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { searchQuery, setSearchQuery } = useSearch();
    const [isScrolled, setIsScrolled] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [imgError, setImgError] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setImgError(false);
    }, [user]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleUserMenu = (e) => {
        e.stopPropagation();
        setUserMenuOpen(!userMenuOpen);
    };

    useEffect(() => {
        const closeMenus = () => {
            setUserMenuOpen(false);
            setMobileMenuOpen(false);
        };
        window.addEventListener('click', closeMenus);
        return () => window.removeEventListener('click', closeMenus);
    }, []);

    return (
        <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
            <div className="nav-left">
                <button className="mobile-menu-btn" onClick={(e) => {
                    e.stopPropagation();
                    setMobileMenuOpen(!mobileMenuOpen);
                }}>
                    <Menu size={24} />
                </button>
                
                <Link to="/" className="logo">OTAKUZONE<span>FLIX</span></Link>
                
                <div className="nav-desktop-links">
                    <Link to="/">Início</Link>
                    <Link to="/mangas">Mangás</Link>
                    <Link to="/podcast-agenda">Podcast</Link>
                    {user && <Link to="/my-purchases">Compras</Link>}
                    {user?.role === 'admin' && <Link to="/admin">Admin</Link>}
                </div>
            </div>

            {/* ── Mobile Sidebar Menu ── */}
            <div className={`mobile-sidebar ${mobileMenuOpen ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
                <div className="sidebar-header">
                    <Link to="/" className="logo" onClick={() => setMobileMenuOpen(false)}>OTAKUZONE<span>FLIX</span></Link>
                    <button className="close-sidebar" onClick={() => setMobileMenuOpen(false)}><X size={28} /></button>
                </div>
                <div className="sidebar-links">
                    <Link to="/" onClick={() => setMobileMenuOpen(false)}>Início</Link>
                    <Link to="/mangas" onClick={() => setMobileMenuOpen(false)}>Mangás</Link>
                    <Link to="/podcast-agenda" onClick={() => setMobileMenuOpen(false)}>Podcast</Link>
                    {user && <Link to="/my-purchases" onClick={() => setMobileMenuOpen(false)}>Minhas Compras</Link>}
                    {user?.role === 'admin' && <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>Painel Admin</Link>}
                    <div style={{ padding: '20px 0', borderTop: '1px solid #222', marginTop: '20px' }}>
                        <MusicPlayer />
                    </div>
                </div>
            </div>

            <div className="nav-right">
                <div className={`search-box ${showSearch ? 'active' : ''}`}>
                    <Search className="nav-icon" onClick={(e) => {
                        e.stopPropagation();
                        setShowSearch(!showSearch);
                    }} />
                    {showSearch && (
                        <>
                            <input 
                                type="text" 
                                placeholder="Procurar..." 
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    if(window.location.pathname !== '/') navigate('/');
                                }}
                                onClick={(e) => e.stopPropagation()}
                                autoFocus
                            />
                            <X size={16} className="close-search" onClick={() => {
                                setShowSearch(false);
                                setSearchQuery('');
                            }} />
                        </>
                    )}
                </div>
                
                <div className="desktop-music">
                    <MusicPlayer />
                </div>

                <Bell className="nav-icon" />
                
                {user ? (
                    <div className="user-menu" onClick={toggleUserMenu}>
                        <div className={`nav-avatar-wrapper ${userMenuOpen ? 'active' : ''}`}>
                            {!imgError && user.profilePic ? (
                                <img src={user.profilePic} alt="Profile" className="nav-avatar" onError={() => setImgError(true)} />
                            ) : (
                                <div className="nav-avatar-fallback"><User size={16} /></div>
                            )}
                        </div>
                        <ChevronDown size={14} className={`chevron ${userMenuOpen ? 'up' : ''}`} />
                        
                        <div className={`dropdown ${userMenuOpen ? 'show' : ''}`} onClick={(e) => e.stopPropagation()}>
                            <p className="user-name-display">{user.name}</p>
                            <Link to="/profile" onClick={() => setUserMenuOpen(false)}><User size={16} /> Perfil</Link>
                            {user.role === 'admin' && <Link to="/admin" onClick={() => setUserMenuOpen(false)}><Plus size={16} /> Admin</Link>}
                            <button onClick={() => { logout(); setUserMenuOpen(false); }} className="logout-btn"><LogOut size={16} /> Sair</button>
                        </div>
                    </div>
                ) : (
                    <Link to="/login" className="nav-login-btn">Entrar</Link>
                )}
            </div>

            <style>{`
                .navbar { position: fixed; top: 0; width: 100%; height: 70px; display: flex; justify-content: space-between; align-items: center; padding: 0 4%; z-index: 1000; transition: all 0.3s; background: linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, transparent); }
                .navbar.scrolled { background: #000; box-shadow: 0 2px 10px rgba(0,0,0,0.5); }
                
                .nav-left, .nav-right { display: flex; align-items: center; gap: 20px; }
                
                .logo { font-size: 1.6rem; font-weight: 900; color: var(--primary); letter-spacing: -1px; text-decoration: none; text-shadow: 0 0 10px rgba(229,9,20,0.5); }
                .logo span { color: white; }
                
                .nav-desktop-links { display: flex; gap: 20px; margin-left: 10px; }
                .nav-desktop-links a { color: #e5e5e5; text-decoration: none; font-size: 0.9rem; font-weight: 500; transition: 0.3s; position: relative; padding: 5px 0; }
                .nav-desktop-links a:hover { color: #fff; }
                .nav-desktop-links a::after { content: ''; position: absolute; bottom: 0; left: 0; width: 0; height: 2px; background: var(--primary); transition: 0.3s; }
                .nav-desktop-links a:hover::after { width: 100%; }

                .mobile-menu-btn { display: none; background: none; border: none; color: white; cursor: pointer; padding: 5px; }

                /* ── User Menu & Dropdown ── */
                .user-menu { position: relative; display: flex; align-items: center; gap: 6px; cursor: pointer; padding: 5px; }
                .nav-avatar-wrapper { width: 32px; height: 32px; border-radius: 4px; overflow: hidden; border: 2px solid transparent; transition: 0.3s; }
                .nav-avatar-wrapper.active { border-color: white; }
                .nav-avatar { width: 100%; height: 100%; object-fit: cover; }
                .nav-avatar-fallback { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: #333; }
                .chevron { color: white; transition: 0.3s; }
                .chevron.up { transform: rotate(180deg); }

                .dropdown { display: none; position: absolute; top: 50px; right: 0; background: rgba(0,0,0,0.95); border: 1px solid #333; min-width: 180px; padding: 10px 0; border-radius: 4px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
                .dropdown.show { display: block; animation: fadeIn 0.2s ease; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
                .dropdown a, .dropdown button { display: flex; align-items: center; gap: 12px; padding: 10px 20px; color: #ddd; text-decoration: none; font-size: 0.85rem; transition: 0.3s; width: 100%; background: none; border: none; text-align: left; cursor: pointer; }
                .dropdown a:hover, .dropdown button:hover { background: rgba(255,255,255,0.1); color: white; }
                .user-name-display { padding: 5px 20px 10px; font-weight: 700; font-size: 0.9rem; border-bottom: 1px solid #333; margin-bottom: 5px; color: #fff; }

                .nav-login-btn { background: var(--primary); color: white; padding: 6px 16px; border-radius: 4px; text-decoration: none; font-weight: 700; font-size: 0.9rem; transition: 0.3s; }
                .nav-login-btn:hover { background: #b00710; }

                .nav-icon { color: white; cursor: pointer; transition: 0.3s; }
                .nav-icon:hover { opacity: 0.8; }

                .search-box { display: flex; align-items: center; gap: 10px; transition: 0.3s; padding: 5px 10px; }
                .search-box.active { background: rgba(255,255,255,0.1); border-radius: 4px; border: 1px solid #555; }
                .search-box input { background: none; border: none; color: white; outline: none; width: 150px; font-size: 0.9rem; }

                /* ── Mobile Sidebar ── */
                .mobile-sidebar { position: fixed; top: 0; left: -100%; width: 280px; height: 100vh; background: #000; z-index: 2000; transition: 0.4s cubic-bezier(0.77,0.2,0.05,1.0); padding: 20px; box-shadow: 10px 0 30px rgba(0,0,0,0.8); }
                .mobile-sidebar.open { left: 0; }
                .sidebar-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
                .close-sidebar { background: none; border: none; color: white; cursor: pointer; }
                .sidebar-links { display: flex; flex-direction: column; gap: 20px; }
                .sidebar-links a { color: #ccc; text-decoration: none; font-size: 1.1rem; font-weight: 600; padding: 10px 0; border-bottom: 1px solid #111; }
                .sidebar-links a:hover { color: white; border-color: var(--primary); }

                @media (max-width: 900px) {
                    .nav-desktop-links, .desktop-music { display: none; }
                    .mobile-menu-btn { display: block; }
                    .logo { font-size: 1.3rem; }
                    .search-box input { width: 100px; }
                }

                @media (max-width: 480px) {
                    .navbar { padding: 0 15px; height: 60px; }
                    .search-box.active { position: absolute; top: 60px; left: 0; right: 0; background: #000; padding: 15px; border-radius: 0; }
                    .search-box.active input { width: 100%; }
                }
            `}</style>
        </nav>
    );
};

export default Navbar;
