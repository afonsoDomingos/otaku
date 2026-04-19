import React, { useState, useEffect } from 'react';
import API from '../api';
import { Link } from 'react-router-dom';
import { Film, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const MyPurchases = () => {
    const [purchases, setPurchases] = useState([]);

    useEffect(() => {
        const fetchPurchases = async () => {
            const { data } = await API.get('/purchases/my-purchases');
            setPurchases(data);
        };
        fetchPurchases();
    }, []);

    return (
        <div className="container" style={{paddingTop: '100px'}}>
            <h1 style={{marginBottom: '30px'}}>Minhas Compras</h1>
            
            {purchases.length === 0 ? (
                <div style={{textAlign: 'center', padding: '50px'}}>
                    <p style={{color: '#aaa'}}>Você ainda não comprou nenhuma temporada.</p>
                    <Link to="/" className="btn-primary" style={{marginTop: '20px', display: 'inline-block'}}>Explorar Catálogo</Link>
                </div>
            ) : (
                <div className="purchases-list">
                    {purchases.map(p => {
                        const seasonIndex = p.anime.seasons.findIndex(s => s._id === p.season);
                        return (
                            <div key={p._id} className="purchase-item">
                                <img src={p.anime.thumbnail} alt={p.anime.title} className="purchase-thumb" />
                                <div className="purchase-info">
                                    <h3>{p.anime.title}</h3>
                                    <p>Temporada: {p.anime.seasons[seasonIndex]?.title}</p>
                                    <div className={`status-badge ${p.status}`}>
                                        {p.status === 'approved' && <><CheckCircle size={14} /> Aprovado</>}
                                        {p.status === 'pending' && <><Clock size={14} /> Pendente</>}
                                        {p.status === 'rejected' && <><AlertCircle size={14} /> Rejeitado</>}
                                    </div>
                                </div>
                                <div className="purchase-actions">
                                    {p.status === 'approved' ? (
                                        <Link to={`/player/${p.anime._id}/${seasonIndex}/0`} className="btn-primary">Assistir</Link>
                                    ) : (
                                        <Link to={`/anime/${p.anime._id}`} className="btn-secondary">Ver Detalhes</Link>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <style>{`
                .purchases-list { display: flex; flex-direction: column; gap: 20px; }
                .purchase-item { 
                    background: var(--surface); 
                    padding: 20px; 
                    border-radius: 8px; 
                    display: flex; 
                    align-items: center; 
                    gap: 30px; 
                    border: 1px solid var(--border);
                }
                .purchase-thumb { width: 120px; height: 180px; object-fit: cover; border-radius: 4px; }
                .purchase-info { flex: 1; }
                .purchase-info h3 { font-size: 1.5rem; margin-bottom: 10px; }
                
                .status-badge { display: flex; align-items: center; gap: 8px; font-size: 0.9rem; font-weight: bold; margin-top: 15px; }
                .status-badge.approved { color: #4caf50; }
                .status-badge.pending { color: #ff9800; }
                .status-badge.rejected { color: #f44336; }
            `}</style>
        </div>
    );
};

export default MyPurchases;
