import React, { useState, useEffect } from 'react';
import API from '../api';
import { Check, X, ExternalLink, User as UserIcon, Film, Plus, Trash2, Upload, PlusCircle } from 'lucide-react';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('purchases');
    const [purchases, setPurchases] = useState([]);
    const [animes, setAnimes] = useState([]);
    const [mangas, setMangas] = useState([]);
    const [shorts, setShorts] = useState([]);
    const [stats, setStats] = useState({ pending: 0, totalSales: 0, revenue: 0, approvedCount: 0 });
    
    // Form states
    const [newAnime, setNewAnime] = useState({ title: '', description: '', category: 'Ação', thumbnail: '', seasons: [] });
    const [newManga, setNewManga] = useState({ title: '', description: '', category: 'Shonen', thumbnail: '', chapters: [] });
    const [newShort, setNewShort] = useState({ title: '', url: '' });
    const [uploading, setUploading] = useState(false);

    const fetchData = async () => {
        const [pRes, aRes, mRes, sRes] = await Promise.all([
            API.get('/purchases/admin'),
            API.get('/animes'),
            API.get('/mangas'),
            API.get('/shorts')
        ]);
        setPurchases(pRes.data);
        setAnimes(aRes.data);
        setMangas(mRes.data);
        setShorts(sRes.data);
        const approvedPurchases = pRes.data.filter(p => p.status === 'approved');
        const revenue = pRes.data.reduce((acc, p) => p.status === 'approved' ? acc + (p.price || 0) : acc, 0);
        
        setStats({
            pending: pRes.data.filter(p => p.status === 'pending').length,
            totalSales: pRes.data.length,
            revenue: revenue,
            approvedCount: approvedPurchases.length
        });
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handlePurchaseAction = async (id, status) => {
        try {
            await API.put(`/purchases/${id}`, { status });
            fetchData();
        } catch (error) { alert("Erro ao processar ação."); }
    };

    const handleFileUpload = async (e, target) => {
        const file = e.target.files[0];
        if (!file) return;
        
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        
        try {
            const { data } = await API.post('/animes/upload', formData);
            if (target === 'thumbnail') {
                setNewAnime({ ...newAnime, thumbnail: data.url });
            } else if (target.type === 'video') {
                const updatedSeasons = [...newAnime.seasons];
                updatedSeasons[target.sIdx].episodes[target.eIdx].videoUrl = data.url;
                setNewAnime({ ...newAnime, seasons: updatedSeasons });
            }
        } catch (error) { alert("Erro no upload."); }
        finally { setUploading(false); }
    };

    const addSeason = () => {
        setNewAnime({
            ...newAnime,
            seasons: [...newAnime.seasons, { title: `Temporada ${newAnime.seasons.length + 1}`, price: 0, episodes: [] }]
        });
    };

    const addEpisode = (sIdx) => {
        const updatedSeasons = [...newAnime.seasons];
        updatedSeasons[sIdx].episodes.push({ title: '', videoUrl: '', duration: '' });
        setNewAnime({ ...newAnime, seasons: updatedSeasons });
    };

    const handleCreateAnime = async () => {
        try {
            await API.post('/animes', newAnime);
            alert("Anime criado com sucesso!");
            setNewAnime({ title: '', description: '', category: 'Ação', thumbnail: '', seasons: [] });
            fetchData();
        } catch (error) { alert("Erro ao criar anime."); }
    };

    const handleDeleteAnime = async (id) => {
        if (!window.confirm("Tem certeza que deseja remover este anime?")) return;
        try {
            await API.delete(`/animes/${id}`);
            fetchData();
        } catch (error) { alert("Erro ao deletar."); }
    };

    const handleCreateShort = async () => {
        try {
            await API.post('/shorts', newShort);
            alert("Short adicionado!");
            setNewShort({ title: '', url: '' });
            fetchData();
        } catch (error) { alert(error.response?.data?.message || "Erro ao adicionar short"); }
    };

    const handleDeleteShort = async (id) => {
        if (!window.confirm("Remover este short?")) return;
        try {
            await API.delete(`/shorts/${id}`);
            fetchData();
        } catch (error) { alert("Erro ao deletar"); }
    };

    return (
        <div className="admin-page container" style={{paddingTop: '100px'}}>
            <h1 style={{marginBottom: '30px'}}>Painel de Administração</h1>
            
            <div className="admin-tabs">
                <button className={activeTab === 'purchases' ? 'active' : ''} onClick={() => setActiveTab('purchases')}>Vendas</button>
                <button className={activeTab === 'catalog' ? 'active' : ''} onClick={() => setActiveTab('catalog')}>Animes</button>
                <button className={activeTab === 'mangas' ? 'active' : ''} onClick={() => setActiveTab('mangas')}>Mangás</button>
                <button className={activeTab === 'shorts' ? 'active' : ''} onClick={() => setActiveTab('shorts')}>Shorts</button>
            </div>

            {activeTab === 'purchases' ? (
                <>
                    <div className="stats-row">
                        <div className="stat-card"><h3>Pedidos Pendentes</h3><p>{stats.pending}</p></div>
                        <div className="stat-card"><h3>Total de Vendas</h3><p>{stats.totalSales}</p></div>
                        <div className="stat-card revenue"><h3>Faturamento</h3><p>MT {stats.revenue?.toLocaleString()}</p></div>
                        <div className="stat-card approved"><h3>Aprovados</h3><p>{stats.approvedCount}</p></div>
                    </div>

                    <h2 style={{margin: '40px 0 20px'}}>Gerenciar Comprovativos</h2>
                    <div className="purchases-table">
                        <table>
                            <thead>
                                <tr><th>Usuário</th><th>Anime / Temporada</th><th>Data</th><th>Comprovativo</th><th>Status</th><th>Ações</th></tr>
                            </thead>
                            <tbody>
                                {purchases.map(p => (
                                    <tr key={p._id}>
                                        <td><UserIcon size={16} /> {p.user?.name}</td>
                                        <td><Film size={16} /> {p.anime?.title}</td>
                                        <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                                        <td><a href={p.paymentProof} target="_blank" rel="noreferrer" className="proof-link">Ver Comprovativo <ExternalLink size={14} /></a></td>
                                        <td><span className={`status-tag ${p.status}`}>{p.status}</span></td>
                                        <td>
                                            {p.status === 'pending' && (
                                                <div className="action-btns">
                                                    <button className="approve" onClick={() => handlePurchaseAction(p._id, 'approved')}><Check size={18} /></button>
                                                    <button className="reject" onClick={() => handlePurchaseAction(p._id, 'rejected')}><X size={18} /></button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            ) : activeTab === 'catalog' ? (
                <div className="catalog-manager">
                    <div className="add-anime-form">
                        <h2>Adicionar Novo Anime</h2>
                        <div className="form-grid">
                            <input type="text" placeholder="Título do Anime" value={newAnime.title} onChange={e => setNewAnime({...newAnime, title: e.target.value})} />
                            <input type="text" placeholder="Categoria" value={newAnime.category} onChange={e => setNewAnime({...newAnime, category: e.target.value})} />
                            <textarea placeholder="Descrição" value={newAnime.description} onChange={e => setNewAnime({...newAnime, description: e.target.value})} />
                            
                            <div className="upload-box">
                                <label>Capa (Thumbnail)</label>
                                <input type="file" onChange={e => handleFileUpload(e, 'thumbnail')} />
                                {newAnime.thumbnail && <img src={newAnime.thumbnail} alt="preview" style={{width: '100px', marginTop: '10px'}} />}
                            </div>
                        </div>

                        <div className="seasons-manager">
                            <h3>Temporadas</h3>
                            {newAnime.seasons.map((s, sIdx) => (
                                <div key={sIdx} className="season-form-block">
                                    <input type="text" placeholder="Nome da Temporada" value={s.title} onChange={e => {
                                        const updated = [...newAnime.seasons]; updated[sIdx].title = e.target.value; setNewAnime({...newAnime, seasons: updated});
                                    }} />
                                    <input type="number" placeholder="Preço (MT)" value={s.price} onChange={e => {
                                        const updated = [...newAnime.seasons]; updated[sIdx].price = parseInt(e.target.value); setNewAnime({...newAnime, seasons: updated});
                                    }} />
                                    
                                    <div className="episodes-manager">
                                        <h4>Episódios</h4>
                                        {s.episodes.map((ep, eIdx) => (
                                            <div key={eIdx} className="episode-form-row">
                                                <input type="text" placeholder="Título do Episódio" value={ep.title} onChange={e => {
                                                    const updated = [...newAnime.seasons]; updated[sIdx].episodes[eIdx].title = e.target.value; setNewAnime({...newAnime, seasons: updated});
                                                }} />
                                                <div className="video-upload">
                                                    <label><Upload size={14} /> Upload Vídeo</label>
                                                    <input type="file" accept="video/*" onChange={e => handleFileUpload(e, { type: 'video', sIdx, eIdx })} />
                                                    {ep.videoUrl && <span className="success-text">OK</span>}
                                                </div>
                                            </div>
                                        ))}
                                        <button onClick={() => addEpisode(sIdx)} className="btn-secondary small"><Plus size={14} /> Add Episódio</button>
                                    </div>
                                </div>
                            ))}
                            <button onClick={addSeason} className="btn-secondary"><PlusCircle size={14} /> Add Temporada</button>
                        </div>

                        <button onClick={handleCreateAnime} className="auth-btn" disabled={uploading}>
                            {uploading ? "Aguarde o Upload..." : "Salvar Anime no Catálogo"}
                        </button>
                    </div>

                    <div className="anime-list-admin">
                        <h2>Animes Atuais</h2>
                        <div className="admin-anime-grid">
                            {animes.map(a => (
                                <div key={a._id} className="admin-anime-card">
                                    <img src={a.thumbnail} alt="" />
                                    <div className="card-controls">
                                        <h4>{a.title}</h4>
                                        <button className="reject" onClick={() => handleDeleteAnime(a._id)}><Trash2 size={16} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : activeTab === 'mangas' ? (
                <div className="catalog-manager">
                    <div className="anime-list-admin">
                        <h2>Gerenciar Mangás</h2>
                        <div className="admin-anime-grid">
                            {mangas.map(m => (
                                <div key={m._id} className="admin-anime-card">
                                    <img src={m.thumbnail} alt="" />
                                    <div className="card-controls">
                                        <h4>{m.title}</h4>
                                        <button className="reject" onClick={() => handleDeleteManga(m._id)}><Trash2 size={16} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="catalog-manager">
                    <div className="add-anime-form">
                        <h2>Adicionar Novo Short do YouTube</h2>
                        <div className="form-grid">
                            <input type="text" placeholder="Título do Short" value={newShort.title} onChange={e => setNewShort({...newShort, title: e.target.value})} />
                            <input type="text" placeholder="Link do YouTube Shorts" value={newShort.url} onChange={e => setNewShort({...newShort, url: e.target.value})} />
                        </div>
                        <button onClick={handleCreateShort} className="auth-btn">Adicionar Short</button>
                    </div>

                    <div className="anime-list-admin" style={{marginTop: '40px'}}>
                        <h2>Shorts Atuais</h2>
                        <div className="admin-anime-grid">
                            {shorts.map(s => (
                                <div key={s._id} className="admin-anime-card" style={{aspectRatio: '9/16', height: '300px'}}>
                                    <img src={`https://img.youtube.com/vi/${s.youtubeId}/hqdefault.jpg`} alt="" />
                                    <div className="card-controls">
                                        <h4>{s.title}</h4>
                                        <button className="reject" onClick={() => handleDeleteShort(s._id)}><Trash2 size={16} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .admin-tabs { display: flex; gap: 20px; border-bottom: 1px solid #333; margin-bottom: 30px; }
                .admin-tabs button { background: none; color: #888; padding: 10px 20px; font-size: 1rem; border-bottom: 2px solid transparent; }
                .admin-tabs button.active { color: var(--primary); border-bottom-color: var(--primary); }
                
                .add-anime-form { background: var(--surface); padding: 30px; border-radius: 8px; margin-bottom: 40px; }
                .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
                .form-grid input, .form-grid textarea { background: #111; border: 1px solid #333; color: white; padding: 12px; border-radius: 4px; }
                .form-grid textarea { grid-column: span 2; height: 100px; }
                
                .season-form-block { background: #222; padding: 20px; border-radius: 4px; margin-top: 15px; }
                .episode-form-row { display: grid; grid-template-columns: 1fr auto; gap: 15px; margin-bottom: 10px; }
                .video-upload { position: relative; }
                .video-upload input { position: absolute; opacity: 0; width: 100%; cursor: pointer; }
                .video-upload label { display: flex; align-items: center; gap: 8px; background: #333; padding: 8px 15px; border-radius: 4px; font-size: 0.8rem; }
                .success-text { color: #4caf50; font-weight: bold; font-size: 0.8rem; margin-left: 5px; }

                .admin-anime-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 20px; margin-top: 20px; }
                .admin-anime-card { background: #222; border-radius: 8px; overflow: hidden; }
                .admin-anime-card img { width: 100%; height: 200px; object-fit: cover; }
                .card-controls { padding: 10px; display: flex; justify-content: space-between; align-items: center; }
                .card-controls h4 { font-size: 0.9rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

                .stats-row { display: flex; gap: 20px; }
                .stat-card { background: var(--surface); padding: 20px; border-radius: 8px; flex: 1; border-left: 5px solid var(--primary); }
                .stat-card h3 { font-size: 0.9rem; color: #aaa; margin-bottom: 10px; }
                .stat-card.revenue { border-left-color: #4caf50; }
                .stat-card.approved { border-left-color: #2196f3; }
                
                .purchases-table { background: var(--surface); border-radius: 8px; overflow: hidden; margin-top: 20px; }
                table { width: 100%; border-collapse: collapse; }
                th, td { padding: 15px 20px; text-align: left; border-bottom: 1px solid #333; }
                th { background: #222; font-size: 0.8rem; text-transform: uppercase; color: #888; }
                
                .proof-link { color: #0084ff; display: flex; alignItems: center; gap: 5px; }
                .status-tag { padding: 4px 8px; border-radius: 4px; font-size: 0.7rem; font-weight: bold; text-transform: uppercase; }
                .status-tag.pending { background: #555; color: white; }
                .status-tag.approved { background: #2e7d32; color: white; }
                .status-tag.rejected { background: #c62828; color: white; }
                
                .action-btns { display: flex; gap: 10px; }
                .action-btns button { padding: 5px; border-radius: 4px; color: white; }
            `}</style>
        </div>
    );
};

export default AdminDashboard;
