import React, { useState, useEffect } from 'react';
import API from '../api';
import { Check, X, ExternalLink, User as UserIcon, Film, Plus, Trash2, Upload, PlusCircle } from 'lucide-react';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('purchases');
    const [purchases, setPurchases] = useState([]);
    const [animes, setAnimes] = useState([]);
    const [mangas, setMangas] = useState([]);
    const [shorts, setShorts] = useState([]);
    const [interviews, setInterviews] = useState([]);
    const [stats, setStats] = useState({ pending: 0, totalSales: 0, revenue: 0, approvedCount: 0 });
    
    const [newAnime, setNewAnime] = useState({ 
        title: '', category: '', description: '', thumbnail: '', 
        seasons: [{ title: 'Temporada 1', price: 100, episodes: [{ title: 'Episódio 1', videoUrl: '' }] }] 
    });
    const [newShort, setNewShort] = useState({ title: '', url: '' });
    const [uploading, setUploading] = useState(false);

    const fetchData = async () => {
        try {
            const [pRes, aRes, mRes, sRes, iRes] = await Promise.all([
                API.get('/purchases/admin'),
                API.get('/animes'),
                API.get('/mangas'),
                API.get('/shorts'),
                API.get('/interviews/admin')
            ]);
            const purchases = Array.isArray(pRes.data) ? pRes.data : [];
            const animeList = Array.isArray(aRes.data) ? aRes.data : [];
            setPurchases(purchases);
            setAnimes(animeList);
            setMangas(Array.isArray(mRes.data) ? mRes.data : []);
            setShorts(Array.isArray(sRes.data) ? sRes.data : []);
            setInterviews(Array.isArray(iRes.data) ? iRes.data : []);
            
            const approved = purchases.filter(p => p.status === 'approved');
            setStats({
                pending: purchases.filter(p => p.status === 'pending').length,
                totalSales: purchases.length,
                revenue: approved.reduce((acc, p) => acc + (p.price || 0), 0),
                approvedCount: approved.length
            });
        } catch (e) { console.error(e); }
    };

    useEffect(() => { fetchData(); }, []);

    const handlePurchaseAction = async (id, status) => {
        try {
            await API.put(`/purchases/${id}`, { status });
            fetchData();
        } catch (error) { alert("Erro ao processar."); }
    };

    const handleDelete = async (type, id) => {
        if (!window.confirm(`Remover este ${type}?`)) return;
        try {
            await API.delete(`/${type}s/${id}`);
            fetchData();
        } catch (error) { alert("Erro ao deletar."); }
    };

    const handleFileUpload = async (e, target) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        try {
            const { data } = await API.post('/animes/upload', formData);
            if (target === 'thumbnail') setNewAnime({...newAnime, thumbnail: data.url});
            else {
                const updated = [...newAnime.seasons];
                updated[target.sIdx].episodes[target.eIdx].videoUrl = data.url;
                setNewAnime({...newAnime, seasons: updated});
            }
        } catch (error) { alert("Erro no upload."); } finally { setUploading(false); }
    };

    return (
        <div className="admin-page container" style={{paddingTop: '100px'}}>
            <h1 style={{marginBottom: '30px'}}>Painel Admin</h1>
            <div className="admin-tabs">
                {['purchases', 'catalog', 'mangas', 'shorts', 'podcast'].map(tab => (
                    <button key={tab} className={activeTab === tab ? 'active' : ''} onClick={() => setActiveTab(tab)}>
                        {tab === 'purchases' ? 'Vendas' : tab === 'catalog' ? 'Animes' : tab === 'mangas' ? 'Mangás' : tab === 'shorts' ? 'Shorts' : 'Podcast'}
                    </button>
                ))}
            </div>

            {activeTab === 'purchases' && (
                <div className="purchases-tab">
                    <div className="stats-row">
                        <div className="stat-card"><h3>Pendentes</h3><p>{stats.pending}</p></div>
                        <div className="stat-card revenue"><h3>Receita</h3><p>{stats.revenue} MT</p></div>
                    </div>
                    <div className="purchases-table">
                        <table>
                            <thead><tr><th>Usuário</th><th>Anime</th><th>Proof</th><th>Ação</th></tr></thead>
                            <tbody>
                                {purchases.map(p => (
                                    <tr key={p._id}>
                                        <td>{p.user?.name}</td>
                                        <td>{p.anime?.title}</td>
                                        <td><a href={p.paymentProof} target="_blank" rel="noreferrer" className="proof-link">Ver <ExternalLink size={14} /></a></td>
                                        <td>
                                            {p.status === 'pending' && (
                                                <div className="action-btns">
                                                    <button className="approve" onClick={() => handlePurchaseAction(p._id, 'approved')}><Check size={18} /></button>
                                                    <button className="reject" onClick={() => handlePurchaseAction(p._id, 'rejected')}><X size={18} /></button>
                                                </div>
                                            )}
                                            <span className={`status-tag ${p.status}`}>{p.status}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'catalog' && (
                <div className="catalog-manager">
                    <div className="add-anime-form">
                        <h2>Novo Anime</h2>
                        <input type="text" placeholder="Título" value={newAnime.title} onChange={e => setNewAnime({...newAnime, title: e.target.value})} />
                        <button className="auth-btn" onClick={async () => { await API.post('/animes', newAnime); fetchData(); }}>Salvar</button>
                    </div>
                    <div className="admin-anime-grid">
                        {animes.map(a => (
                            <div key={a._id} className="admin-anime-card">
                                <img src={a.thumbnail} alt="" />
                                <div className="card-controls"><h4>{a.title}</h4><button onClick={() => handleDelete('anime', a._id)}><Trash2 size={16} /></button></div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'mangas' && (
                <div className="admin-anime-grid">
                    {mangas.map(m => (
                        <div key={m._id} className="admin-anime-card">
                            <img src={m.thumbnail} alt="" />
                            <div className="card-controls"><h4>{m.title}</h4><button onClick={() => handleDelete('manga', m._id)}><Trash2 size={16} /></button></div>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'shorts' && (
                <div className="shorts-manager">
                    <div className="add-anime-form">
                        <input type="text" placeholder="URL Shorts" value={newShort.url} onChange={e => setNewShort({...newShort, url: e.target.value})} />
                        <button className="auth-btn" onClick={async () => { 
                            const yId = newShort.url.includes('shorts/') ? newShort.url.split('shorts/')[1].split('?')[0] : newShort.url.split('v=')[1]?.split('&')[0];
                            await API.post('/shorts', { title: 'New Short', url: newShort.url, youtubeId: yId });
                            fetchData();
                        }}>Adicionar</button>
                    </div>
                    <div className="admin-anime-grid">
                        {shorts.map(s => (
                            <div key={s._id} className="admin-anime-card" style={{height: '250px'}}>
                                <img src={`https://img.youtube.com/vi/${s.youtubeId}/hqdefault.jpg`} alt="" />
                                <button onClick={() => handleDelete('short', s._id)}><Trash2 size={16} /></button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'podcast' && (
                <div className="purchases-table">
                    <table>
                        <thead><tr><th>Nome</th><th>WhatsApp</th><th>Temas</th><th>Proof</th></tr></thead>
                        <tbody>
                            {interviews.map(i => (
                                <tr key={i._id}>
                                    <td>{i.user?.name}</td>
                                    <td>{i.contactWhatsApp}</td>
                                    <td>{i.proposedTopics}</td>
                                    <td><a href={i.paymentProof} target="_blank" rel="noreferrer" className="proof-link">Link <ExternalLink size={14} /></a></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <style>{`
                .admin-tabs { display: flex; gap: 20px; border-bottom: 1px solid #333; margin-bottom: 30px; overflow-x: auto; }
                .admin-tabs button { background: none; color: #888; padding: 10px 20px; border-bottom: 2px solid transparent; white-space: nowrap; }
                .admin-tabs button.active { color: var(--primary); border-bottom-color: var(--primary); }
                .stat-card { background: var(--surface); padding: 15px; border-radius: 8px; flex: 1; min-width: 150px; }
                .purchases-table { background: var(--surface); border-radius: 8px; overflow-x: auto; }
                table { width: 100%; border-collapse: collapse; min-width: 600px; }
                th, td { padding: 12px; text-align: left; border-bottom: 1px solid #333; font-size: 0.9rem; }
                .status-tag { font-size: 0.7rem; padding: 2px 6px; border-radius: 4px; text-transform: uppercase; margin-left: 10px; }
                .status-tag.approved { background: #2e7d32; }
                .status-tag.pending { background: #555; }
                .admin-anime-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 15px; }
                .admin-anime-card { background: #222; border-radius: 6px; overflow: hidden; position: relative; }
                .admin-anime-card img { width: 100%; height: 180px; object-fit: cover; }
                .card-controls { padding: 8px; display: flex; justify-content: space-between; align-items: center; }
                .card-controls h4 { font-size: 0.8rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
            `}</style>
        </div>
    );
};

export default AdminDashboard;
