import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, Bell, User, LogOut, Shield } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [isScrolled, setIsScrolled] = useState(false);
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
                    {user && <Link to="/my-purchases">Minhas Compras</Link>}
                    {user?.role === 'admin' && <Link to="/admin">Admin</Link>}
                </div>
            </div>
            <div className="nav-right">
                <Search className="nav-icon" />
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
            `}</style>
        </nav>
    );
};

export default Navbar;
