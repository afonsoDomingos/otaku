import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSearch } from '../context/SearchContext';
import { Search, Bell, User, LogOut, X } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { searchQuery, setSearchQuery } = useSearch();
    const [isScrolled, setIsScrolled] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const navigate = useNavigate();

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
                <div className="nav-links">
                    <Link to="/">Início</Link>
                    <Link to="/mangas">Mangás</Link>
                    {user && <Link to="/my-purchases">Minhas Compras</Link>}
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
                        <User className="nav-icon" />
                        <div className="dropdown">
                            <p>{user.name}</p>
                            <button onClick={logout}><LogOut size={16} /> Sair</button>
                        </div>
                    </div>
                ) : (
                    <Link to="/login" className="btn-primary" style={{ padding: '5px 15px', fontSize: '0.9rem' }}>Login</Link>
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
                    font-weight: 800;
                    color: var(--primary);
                    margin-right: 25px;
                }
                .logo span {
                    color: white;
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
                    font-size: 0.9rem;
                    color: #e5e5e5;
                    transition: color 0.2s;
                }
                .nav-links a:hover {
                    color: #b3b3b3;
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
                    border: 1px solid #fff;
                }
                .search-box input {
                    background: transparent;
                    border: none;
                    color: white;
                    outline: none;
                    width: 200px;
                    font-size: 0.9rem;
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
                @media (max-width: 768px) {
                    .navbar { height: 60px; padding: 0 10px; }
                    .logo { font-size: 1.1rem; margin-right: 10px; letter-spacing: -0.5px; }
                    .nav-links { gap: 8px; }
                    .nav-links a { font-size: 0.65rem; font-weight: 700; text-transform: uppercase; }
                    .nav-right { gap: 10px; }
                    .nav-icon { width: 16px; }
                    .search-box input { width: 80px; font-size: 0.8rem; }
                }
            `}</style>
        </nav>
    );
};

export default Navbar;
