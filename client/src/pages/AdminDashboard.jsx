import React, { useState, useEffect } from 'react';
import API from '../api';
import { Check, X, ExternalLink, User as UserIcon, Film, Plus, Trash2, Upload, PlusCircle, Edit2 } from 'lucide-react';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('purchases');
    const [purchases, setPurchases] = useState([]);
    const [animes, setAnimes] = useState([]);
    const [mangas, setMangas] = useState([]);
    const [shorts, setShorts] = useState([]);
    const [interviews, setInterviews] = useState([]);
    const [guests, setGuests] = useState([]);
    const [partners, setPartners] = useState([]);
    const [stats, setStats] = useState({ pending: 0, totalSales: 0, revenue: 0, approvedCount: 0 });
    
    const [newAnime, setNewAnime] = useState({ 
        title: '', category: '', description: '', thumbnail: '', 
        seasons: [{ title: 'Temporada 1', price: 100, episodes: [{ title: 'Episódio 1', videoUrl: '' }] }] 
    });
    const [newManga, setNewManga] = useState({ title: '', description: '', thumbnail: '', author: '', genre: '', price: 0, chapters: [] });
    const [newShort, setNewShort] = useState({ title: '', url: '' });
    const [newGuest, setNewGuest] = useState({ name: '', photo: '', role: 'Convidado Especial', podcastUrl: '' });
    const [editingGuestId, setEditingGuestId] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadTarget, setUploadTarget] = useState('');
    const [uploadFileName, setUploadFileName] = useState('');
    const [uploadError, setUploadError] = useState('');

    const fetchData = async () => {
        try {
            const [pRes, aRes, mRes, sRes, iRes, gRes, prRes] = await Promise.all([
                API.get('/purchases/admin'),
                API.get('/animes'),
                API.get('/mangas'),
                API.get('/shorts'),
                API.get('/interviews/admin'),
                API.get('/guests').catch(() => ({ data: [] })),
                API.get('/partners/admin').catch(() => ({ data: [] }))
            ]);
            const purchases = Array.isArray(pRes.data) ? pRes.data : [];
            const animeList = Array.isArray(aRes.data) ? aRes.data : [];
            setPurchases(purchases);
            setAnimes(animeList);
            setMangas(Array.isArray(mRes.data) ? mRes.data : []);
            setShorts(Array.isArray(sRes.data) ? sRes.data : []);
            setInterviews(Array.isArray(iRes.data) ? iRes.data : []);
            setGuests(Array.isArray(gRes.data) ? gRes.data : []);
            setPartners(Array.isArray(prRes.data) ? prRes.data : []);
            
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
        const isVideo = file.type.startsWith('video');
        const maxSize = isVideo ? 500 * 1024 * 1024 : 10 * 1024 * 1024;
        if (file.size > maxSize) {
            const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
            setUploadError(`Ficheiro "${file.name}" tem ${sizeMB}MB. O limite é ${isVideo ? '500MB para vídeos' : '10MB para imagens'}.`);
            setTimeout(() => setUploadError(''), 6000);
            return;
        }
        setUploadError('');
        const targetKey = typeof target === 'string' ? target : `ep_${target.sIdx}_${target.eIdx}`;
        setUploading(true);
        setProcessing(false);
        setUploadProgress(0);
        setUploadTarget(targetKey);
        setUploadFileName(file.name);
        const formData = new FormData();
        formData.append('file', file);
        try {
            const { data } = await API.post('/animes/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (ev) => {
                    const pct = Math.round((ev.loaded * 100) / ev.total);
                    setUploadProgress(pct);
                    if (pct === 100) setProcessing(true);
                }
            });
            if (target === 'anime') setNewAnime(prev => ({...prev, thumbnail: data.url}));
            else if (target === 'manga') setNewManga(prev => ({...prev, thumbnail: data.url}));
            else if (target === 'short') setNewShort(prev => ({...prev, url: data.url}));
            else if (target === 'guest') setNewGuest(prev => ({...prev, photo: data.url}));
            else if (target.mIdx !== undefined) {
                setNewManga(prev => {
                    const updated = [...prev.chapters];
                    updated[target.mIdx].pages[target.pIdx] = data.url;
                    return {...prev, chapters: updated};
                });
            } else if (target.sIdx !== undefined) {
                setNewAnime(prev => {
                    const updated = [...prev.seasons];
                    updated[target.sIdx].episodes[target.eIdx].videoUrl = data.url;
                    return {...prev, seasons: updated};
                });
            }
        } catch (error) {
            const msg = error.response?.data?.message || error.message || 'Erro desconhecido';
            alert(`Erro no upload: ${msg}`);
        } finally {
            setUploading(false);
            setProcessing(false);
            setUploadProgress(0);
            setUploadTarget('');
            setUploadFileName('');
        }
    };

    const handleAddGuest = async (e) => {
        e.preventDefault();
        try {
            if (editingGuestId) {
                await API.put(`/guests/${editingGuestId}`, newGuest);
            } else {
                await API.post('/guests', newGuest);
            }
            setNewGuest({ name: '', photo: '', role: 'Convidado Especial', podcastUrl: '' });
            setEditingGuestId(null);
            fetchData();
        } catch (error) { alert("Erro ao guardar convidado."); }
    };

    const handleEditGuestClick = (guest) => {
        setNewGuest({ name: guest.name, photo: guest.photo, role: guest.role, podcastUrl: guest.podcastUrl || '' });
        setEditingGuestId(guest._id);
    };

    return (
        <div className="admin-page container" style={{paddingTop: '100px'}}>

            {/* ── File Size Error Banner ── */}
            {uploadError && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 10000,
                    background: '#7f1d1d', borderBottom: '2px solid #ef4444',
                    padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px'
                }}>
                    <span style={{ fontSize: '0.88rem', color: '#fecaca', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        ⚠️ <strong>Ficheiro demasiado grande:</strong> {uploadError}
                    </span>
                    <button onClick={() => setUploadError('')} style={{ background: 'transparent', color: '#fca5a5', fontSize: '1.2rem', padding: '0 6px', flexShrink: 0 }}>✕</button>
                </div>
            )}

            {/* ── Global Upload/Processing Status Bar ── */}
            {uploading && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999,
                    background: '#1a1a1a', borderBottom: '1px solid #333',
                    padding: '10px 20px', display: 'flex', flexDirection: 'column', gap: '6px'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.85rem', color: '#ccc', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {processing
                                ? <span style={{ color: '#f5a623' }}>⚙️ A processar no Cloudinary... aguarda</span>
                                : <><Upload size={14} color="#e50914" /> A enviar: <strong style={{color:'#fff'}}>{uploadFileName}</strong></>}
                        </span>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: processing ? '#f5a623' : '#e50914' }}>
                            {processing ? 'Processando...' : `${uploadProgress}%`}
                        </span>
                    </div>
                    <div style={{ background: '#333', borderRadius: '4px', overflow: 'hidden', height: '5px' }}>
                        {processing ? (
                            <div style={{
                                height: '100%', background: 'linear-gradient(90deg, #f5a623, #e50914, #f5a623)',
                                backgroundSize: '200% 100%',
                                animation: 'shimmer 1.4s linear infinite'
                            }} />
                        ) : (
                            <div style={{ width: `${uploadProgress}%`, background: '#e50914', height: '100%', transition: 'width 0.2s' }} />
                        )}
                    </div>
                </div>
            )}

            <h1 style={{marginBottom: '30px'}}>Painel Admin</h1>
            <div className="admin-tabs">
                {['purchases', 'catalog', 'mangas', 'shorts', 'podcast', 'convidados', 'parcerias'].map(tab => (
                    <button key={tab} className={activeTab === tab ? 'active' : ''} onClick={() => setActiveTab(tab)}>
                        {tab === 'purchases' ? 'Vendas' : tab === 'catalog' ? 'Animes' : tab === 'mangas' ? 'Mangás' : tab === 'shorts' ? 'Shorts' : tab === 'podcast' ? 'Podcast' : tab === 'convidados' ? 'Convidados' : 'Parcerias'}
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
                    <div className="add-anime-form" style={{ background: '#222', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                        <h2>{newAnime._id ? 'Editar Anime' : 'Novo Anime'}</h2>
                        <div style={{ display: 'flex', gap: '15px', flexDirection: 'column', marginTop: '15px' }}>
                            <input type="text" placeholder="Título" value={newAnime.title} onChange={e => setNewAnime({...newAnime, title: e.target.value})} />
                            <input type="text" placeholder="Categoria (ex: Ação, Drama)" value={newAnime.category || ''} onChange={e => setNewAnime({...newAnime, category: e.target.value})} />
                            {/* Thumbnail: URL + Upload */}
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                                <div style={{ flex: 1, minWidth: '200px' }}>
                                    <label style={{ fontSize: '0.75rem', color: '#aaa', marginBottom: '4px', display: 'block' }}>Capa (Thumbnail)</label>
                                    <input type="text" placeholder="Cole um URL de imagem" value={newAnime.thumbnail || ''} onChange={e => setNewAnime({...newAnime, thumbnail: e.target.value})} style={{ marginBottom: '6px' }} />
                                    <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: uploading && uploadTarget==='anime' ? 'wait' : 'pointer', background: '#333', padding: '8px 12px', borderRadius: '4px', fontSize: '0.85rem', border: '1px dashed #555' }}>
                                        <Upload size={14} /> {uploading && uploadTarget==='anime' ? `${uploadProgress}%` : 'Ou faz upload de imagem'}
                                        <input type="file" hidden onChange={e => handleFileUpload(e, 'anime')} accept="image/*" disabled={uploading} />
                                    </label>
                                    {uploading && uploadTarget==='anime' && (
                                        <div style={{ marginTop: '6px', background: '#333', borderRadius: '4px', overflow: 'hidden', height: '6px' }}>
                                            <div style={{ width: `${uploadProgress}%`, background: '#e50914', height: '100%', transition: 'width 0.3s' }} />
                                        </div>
                                    )}
                                </div>
                                {newAnime.thumbnail && (
                                    <div style={{ width: '80px', flexShrink: 0 }}>
                                        <label style={{ fontSize: '0.75rem', color: '#aaa', marginBottom: '4px', display: 'block' }}>Preview</label>
                                        <img src={newAnime.thumbnail} alt="preview" style={{ width: '80px', height: '110px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #444' }} onError={e => e.target.style.display='none'} />
                                    </div>
                                )}
                            </div>
                            
                            <textarea placeholder="Descrição Mínima" value={newAnime.description || ''} onChange={e => setNewAnime({...newAnime, description: e.target.value})} rows="3" />
                            
                            <div className="seasons-editor" style={{ background: '#111', padding: '15px', borderRadius: '6px' }}>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '10px' }}>Temporadas</h3>
                                {newAnime.seasons?.map((s, sIdx) => (
                                    <div key={sIdx} className="season-edit-box" style={{ padding: '15px', background: '#333', marginBottom: '15px', borderRadius: '4px' }}>
                                        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                                            <input type="text" placeholder="Nome da Temporada" value={s.title} onChange={e => { const updated = [...newAnime.seasons]; updated[sIdx].title = e.target.value; setNewAnime({...newAnime, seasons: updated})}} />
                                            <input type="number" placeholder="Preço (MT)" value={s.price} onChange={e => { const updated = [...newAnime.seasons]; updated[sIdx].price = e.target.value; setNewAnime({...newAnime, seasons: updated})}} style={{ width: '120px' }} />
                                            <button className="auth-btn" style={{ margin: 0, padding: '0 15px', width: 'auto', background: '#e50914' }} onClick={() => { const updated = [...newAnime.seasons]; updated.splice(sIdx, 1); setNewAnime({...newAnime, seasons: updated}) }}>Remover</button>
                                        </div>

                                        <h4 style={{ fontSize: '0.9rem', color: '#aaa', marginBottom: '10px' }}>Episódios desta Temporada</h4>
                                        {s.episodes?.map((ep, eIdx) => (
                                            <div key={eIdx} style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                                                <input type="text" placeholder="Ep 1" value={ep.title} onChange={e => { const updated = [...newAnime.seasons]; updated[sIdx].episodes[eIdx].title = e.target.value; setNewAnime({...newAnime, seasons: updated})}} style={{ width: '150px' }} />
                                                <input type="text" placeholder="URL Ext/Cloudinary Vídeo" value={ep.videoUrl} onChange={e => { const updated = [...newAnime.seasons]; updated[sIdx].episodes[eIdx].videoUrl = e.target.value; setNewAnime({...newAnime, seasons: updated})}} />
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '90px' }}>
                                                    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', cursor: uploading ? 'wait' : 'pointer', background: uploading && uploadTarget===`ep_${sIdx}_${eIdx}` ? '#1a1a1a' : '#222', padding: '0 10px', borderRadius: '4px', height: '38px', fontSize: '0.75rem', color: '#aaa', whiteSpace: 'nowrap' }}>
                                                        {uploading && uploadTarget===`ep_${sIdx}_${eIdx}`
                                                            ? (processing ? <span style={{color:'#f5a623'}}>⚙️ {uploadProgress}%</span> : <><Upload size={12} color="#e50914" /> {uploadProgress}%</>)
                                                            : <><Upload size={12} color="#aaa" /> Vídeo</>}
                                                        <input type="file" hidden onChange={e => handleFileUpload(e, {sIdx, eIdx})} accept="video/*" disabled={uploading} />
                                                    </label>
                                                    {uploading && uploadTarget===`ep_${sIdx}_${eIdx}` && (
                                                        <div style={{ background: '#333', borderRadius: '4px', overflow: 'hidden', height: '3px' }}>
                                                            {processing
                                                                ? <div style={{ height: '100%', background: 'linear-gradient(90deg,#f5a623,#e50914,#f5a623)', backgroundSize:'200% 100%', animation:'shimmer 1.4s linear infinite' }} />
                                                                : <div style={{ width: `${uploadProgress}%`, background: '#e50914', height: '100%', transition: 'width 0.2s' }} />}
                                                        </div>
                                                    )}
                                                </div>
                                                <button onClick={() => { const updated = [...newAnime.seasons]; updated[sIdx].episodes.splice(eIdx,1); setNewAnime({...newAnime, seasons: updated})}} style={{ background: 'transparent' }}><X size={18} color="#aaa" /></button>
                                            </div>
                                        ))}
                                        <button className="auth-btn" style={{ margin: '10px 0 0', padding: '8px 15px', background: '#444', width: 'auto', fontSize: '0.9rem' }} onClick={() => { const updated = [...newAnime.seasons]; updated[sIdx].episodes.push({ title: `Episódio ${(s.episodes?.length||0)+1}`, videoUrl: '' }); setNewAnime({...newAnime, seasons: updated}) }}>+ Adicionar Episódio</button>
                                    </div>
                                ))}
                                <button className="auth-btn" style={{ margin: '0', padding: '10px', background: '#2e7d32', width: '100%', fontSize: '0.95rem' }} onClick={() => setNewAnime({...newAnime, seasons: [...(newAnime.seasons||[]), { title: `Temporada ${(newAnime.seasons?.length||0)+1}`, price: 100, episodes: [] }]})}>+ Nova Temporada</button>
                            </div>
                            

                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button className="auth-btn" onClick={async () => { 
                                    if (newAnime._id) {
                                        await API.put(`/animes/${newAnime._id}`, newAnime);
                                    } else {
                                        await API.post('/animes', newAnime); 
                                    }
                                    setNewAnime({ title: '', category: '', description: '', thumbnail: '', seasons: [{ title: 'Temporada 1', price: 100, episodes: [{ title: 'Episódio 1', videoUrl: '' }] }] });
                                    fetchData(); 
                                }}>Salvar Anime Completo</button>
                                {newAnime._id && (
                                    <button className="auth-btn" style={{ background: '#555' }} onClick={() => setNewAnime({ title: '', category: '', description: '', thumbnail: '', seasons: [{ title: 'Temporada 1', price: 100, episodes: [{ title: 'Episódio 1', videoUrl: '' }] }] })}>Cancelar</button>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="admin-anime-grid">
                        {animes.map(a => (
                            <div key={a._id} className="admin-anime-card">
                                <img src={a.thumbnail} alt="" />
                                <div className="card-controls" style={{ padding: '8px' }}>
                                    <h4 style={{ flex: 1 }}>{a.title}</h4>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button onClick={() => setNewAnime(JSON.parse(JSON.stringify(a)))}><Edit2 size={16} color="#aaa" /></button>
                                        <button onClick={() => handleDelete('anime', a._id)}><Trash2 size={16} color="#e50914" /></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'mangas' && (
                <div className="catalog-manager">
                    <div className="add-anime-form" style={{ background: '#222', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                        <h2>{newManga._id ? 'Editar Mangá' : 'Novo Mangá'}</h2>
                        <div style={{ display: 'flex', gap: '15px', flexDirection: 'column', marginTop: '15px' }}>
                            <input type="text" placeholder="Título" value={newManga.title} onChange={e => setNewManga({...newManga, title: e.target.value})} />
                            {/* Thumbnail: URL + Upload */}
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                                <div style={{ flex: 1, minWidth: '200px' }}>
                                    <label style={{ fontSize: '0.75rem', color: '#aaa', marginBottom: '4px', display: 'block' }}>Capa (Thumbnail)</label>
                                    <input type="text" placeholder="Cole um URL de imagem" value={newManga.thumbnail || ''} onChange={e => setNewManga({...newManga, thumbnail: e.target.value})} style={{ marginBottom: '6px' }} />
                                    <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: uploading && uploadTarget==='manga' ? 'wait' : 'pointer', background: '#333', padding: '8px 12px', borderRadius: '4px', fontSize: '0.85rem', border: '1px dashed #555' }}>
                                        <Upload size={14} /> {uploading && uploadTarget==='manga' ? `${uploadProgress}%` : 'Ou faz upload de imagem'}
                                        <input type="file" hidden onChange={e => handleFileUpload(e, 'manga')} accept="image/*" disabled={uploading} />
                                    </label>
                                    {uploading && uploadTarget==='manga' && (
                                        <div style={{ marginTop: '6px', background: '#333', borderRadius: '4px', overflow: 'hidden', height: '6px' }}>
                                            <div style={{ width: `${uploadProgress}%`, background: '#e50914', height: '100%', transition: 'width 0.3s' }} />
                                        </div>
                                    )}
                                </div>
                                {newManga.thumbnail && (
                                    <div style={{ width: '80px', flexShrink: 0 }}>
                                        <label style={{ fontSize: '0.75rem', color: '#aaa', marginBottom: '4px', display: 'block' }}>Preview</label>
                                        <img src={newManga.thumbnail} alt="preview" style={{ width: '80px', height: '110px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #444' }} onError={e => e.target.style.display='none'} />
                                    </div>
                                )}
                            </div>
                            
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <input type="text" placeholder="Autor" value={newManga.author || ''} onChange={e => setNewManga({...newManga, author: e.target.value})} />
                                <input type="text" placeholder="Gênero" value={newManga.genre || ''} onChange={e => setNewManga({...newManga, genre: e.target.value})} />
                                <input type="number" placeholder="Preço (MT)" value={newManga.price || 0} onChange={e => setNewManga({...newManga, price: Number(e.target.value)})} />
                            </div>
                            <textarea placeholder="Descrição do Mangá" value={newManga.description || ''} onChange={e => setNewManga({...newManga, description: e.target.value})} rows="3" />

                            <div className="seasons-editor" style={{ background: '#111', padding: '15px', borderRadius: '6px' }}>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '10px' }}>Capítulos</h3>
                                {newManga.chapters?.map((c, cIdx) => (
                                    <div key={cIdx} className="season-edit-box" style={{ padding: '15px', background: '#333', marginBottom: '15px', borderRadius: '4px' }}>
                                        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                                            <input type="number" placeholder="Nº" value={c.number} onChange={e => { const updated = [...newManga.chapters]; updated[cIdx].number = e.target.value; setNewManga({...newManga, chapters: updated})}} style={{ width: '80px' }} />
                                            <input type="text" placeholder="Título do Capítulo" value={c.title} onChange={e => { const updated = [...newManga.chapters]; updated[cIdx].title = e.target.value; setNewManga({...newManga, chapters: updated})}} />
                                            <button className="auth-btn" style={{ margin: 0, padding: '0 15px', width: 'auto', background: '#e50914' }} onClick={() => { const updated = [...newManga.chapters]; updated.splice(cIdx, 1); setNewManga({...newManga, chapters: updated}) }}>Remover</button>
                                        </div>

                                        <h4 style={{ fontSize: '0.9rem', color: '#aaa', marginBottom: '10px' }}>Páginas (URLs)</h4>
                                        {c.pages?.map((pg, pIdx) => (
                                            <div key={pIdx} style={{ display: 'flex', gap: '10px', marginBottom: '8px', alignItems: 'center' }}>
                                                <input type="text" placeholder="URL da Página / Imagem" value={pg} onChange={e => { const updated = [...newManga.chapters]; updated[cIdx].pages[pIdx] = e.target.value; setNewManga({...newManga, chapters: updated})}} />
                                                <label style={{ cursor: uploading ? 'wait' : 'pointer', background: '#444', padding: '10px', borderRadius: '4px', display: 'flex', alignItems: 'center' }}>
                                                    <Upload size={16} />
                                                    <input type="file" hidden onChange={e => handleFileUpload(e, {mIdx: cIdx, pIdx: pIdx})} accept="image/*" disabled={uploading} />
                                                </label>
                                                <button onClick={() => { const updated = [...newManga.chapters]; updated[cIdx].pages.splice(pIdx,1); setNewManga({...newManga, chapters: updated})}} style={{ background: 'transparent' }}><X size={18} color="#aaa" /></button>
                                            </div>
                                        ))}
                                        <button className="auth-btn" style={{ margin: '10px 0 0', padding: '8px 15px', background: '#444', width: 'auto', fontSize: '0.9rem' }} onClick={() => { const updated = [...newManga.chapters]; updated[cIdx].pages.push(''); setNewManga({...newManga, chapters: updated}) }}>+ Adicionar Página</button>
                                    </div>
                                ))}
                                <button className="auth-btn" style={{ margin: '0', padding: '10px', background: '#2e7d32', width: '100%', fontSize: '0.95rem' }} onClick={() => setNewManga({...newManga, chapters: [...(newManga.chapters||[]), { number: (newManga.chapters?.length||0)+1, title: '', pages: [] }]})}>+ Novo Capítulo</button>
                            </div>
                            


                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button className="auth-btn" onClick={async () => { 
                                    if (newManga._id) {
                                        await API.put(`/mangas/${newManga._id}`, newManga);
                                    } else {
                                        await API.post('/mangas', newManga); 
                                    }
                                    setNewManga({ title: '', description: '', thumbnail: '', author: '', genre: '', price: 0, chapters: [] });
                                    fetchData(); 
                                }}>Salvar Mangá Completo</button>
                                {newManga._id && (
                                    <button className="auth-btn" style={{ background: '#555' }} onClick={() => setNewManga({ title: '', description: '', thumbnail: '', author: '', genre: '', price: 0, chapters: [] })}>Cancelar</button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="admin-anime-grid">
                        {mangas.map(m => (
                            <div key={m._id} className="admin-anime-card">
                                <img src={m.thumbnail} alt="" />
                                <div className="card-controls" style={{ padding: '8px' }}>
                                    <h4 style={{ flex: 1 }}>{m.title}</h4>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button onClick={() => setNewManga(JSON.parse(JSON.stringify(m)))}><Edit2 size={16} color="#aaa" /></button>
                                        <button onClick={() => handleDelete('manga', m._id)}><Trash2 size={16} color="#e50914" /></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'shorts' && (
                <div className="shorts-manager">
                    <div className="add-anime-form" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <input type="text" placeholder="URL Shorts (YouTube ou direto)" value={newShort.url} onChange={e => setNewShort({...newShort, url: e.target.value})} />
                        <label style={{ cursor: uploading ? 'wait' : 'pointer', background: '#333', padding: '12px', borderRadius: '4px', border: '1px dashed #555', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Upload size={18} /> {uploading && uploadTarget==='short' ? '...' : 'Upload'}
                            <input type="file" hidden onChange={e => handleFileUpload(e, 'short')} accept="video/*" disabled={uploading} />
                        </label>
                        <button className="auth-btn" style={{ width: 'auto', margin: 0 }} onClick={async () => { 
                            let yId = '';
                            if (newShort.url.includes('youtube.com') || newShort.url.includes('youtu.be')) {
                                yId = newShort.url.includes('shorts/') ? newShort.url.split('shorts/')[1].split('?')[0] : newShort.url.split('v=')[1]?.split('&')[0];
                            }
                            await API.post('/shorts', { title: 'New Short', url: newShort.url, youtubeId: yId });
                            setNewShort({ title: '', url: '' });
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

            {activeTab === 'convidados' && (
                <div style={{display: 'flex', gap: '30px'}}>
                    <div style={{flex: 1}}>
                        <h2>{editingGuestId ? 'Editar Convidado' : 'Adicionar Convidado'}</h2>
                        <form onSubmit={handleAddGuest} style={{background: 'var(--surface)', padding: '20px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '15px'}}>
                            <input placeholder="Nome (Ex: Meu Mano Denzel)" value={newGuest.name} onChange={e => setNewGuest({...newGuest, name: e.target.value})} required style={{padding: '10px', background: '#111', border: '1px solid #333', color: 'white', borderRadius: '4px'}} />
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <input placeholder="URL da Foto (opcional)" value={newGuest.photo} onChange={e => setNewGuest({...newGuest, photo: e.target.value})} style={{ flex: 1, padding: '10px', background: '#111', border: '1px solid #333', color: 'white', borderRadius: '4px' }} />
                                <label style={{ cursor: uploading ? 'wait' : 'pointer', background: '#333', padding: '10px', borderRadius: '4px', border: '1px dashed #555' }}>
                                    <Upload size={16} />
                                    <input type="file" hidden onChange={e => handleFileUpload(e, 'guest')} accept="image/*" disabled={uploading} />
                                </label>
                            </div>
                            <input placeholder="Papel (Ex: Convidado Especial)" value={newGuest.role} onChange={e => setNewGuest({...newGuest, role: e.target.value})} style={{padding: '10px', background: '#111', border: '1px solid #333', color: 'white', borderRadius: '4px'}} />
                            <input placeholder="Link do Episódio (YouTube)" value={newGuest.podcastUrl} onChange={e => setNewGuest({...newGuest, podcastUrl: e.target.value})} style={{padding: '10px', background: '#111', border: '1px solid #333', color: 'white', borderRadius: '4px'}} />
                            <div style={{display: 'flex', gap: '10px'}}>
                                <button type="submit" style={{flex: 1, padding: '12px', background: 'var(--primary)', color: 'white', borderRadius: '4px', fontWeight: 'bold'}}>
                                    {editingGuestId ? <><Edit2 size={16} /> Atualizar</> : <><Plus size={16} /> Adicionar</>}
                                </button>
                                {editingGuestId && (
                                    <button type="button" onClick={() => {setEditingGuestId(null); setNewGuest({ name: '', photo: '', role: 'Convidado Especial' });}} style={{padding: '12px', background: '#333', color: 'white', borderRadius: '4px', fontWeight: 'bold'}}>
                                        Cancelar
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                    <div style={{flex: 2}}>
                        <h2>Convidados Registados</h2>
                        <div className="admin-anime-grid" style={{gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))'}}>
                            {guests.length === 0 ? (
                                <div style={{gridColumn: '1 / -1', textAlign: 'center', padding: '40px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', color: '#888'}}>
                                    <UserIcon size={40} style={{marginBottom: '10px', opacity: 0.5}} />
                                    <p>Nenhum convidado registado no banco de dados.</p>
                                    <p style={{fontSize: '0.8rem', marginTop: '5px'}}>Adiciona o primeiro convidado usando o formulário à esquerda.</p>
                                </div>
                            ) : (
                                guests.map(g => (
                                    <div key={g._id} className="admin-anime-card" style={{textAlign: 'center', paddingBottom: '10px'}}>
                                        <div style={{width: '100px', height: '100px', margin: '15px auto', borderRadius: '50%', overflow: 'hidden', border: '2px solid #e50914'}}>
                                            <img src={g.photo || 'https://via.placeholder.com/150'} alt={g.name} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                                        </div>
                                        <h4 style={{padding: '0 10px', fontSize: '0.9rem'}}>{g.name}</h4>
                                        <div style={{display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '10px'}}>
                                            <button onClick={() => handleEditGuestClick(g)} style={{background: 'transparent', color: '#3b82f6'}}><Edit2 size={16} /></button>
                                            <button onClick={() => handleDelete('guest', g._id)} style={{background: 'transparent', color: '#ff4444'}}><Trash2 size={16} /></button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'parcerias' && (
                <div className="purchases-table">
                    <h2 style={{padding: '15px 20px', margin: 0, borderBottom: '1px solid #333'}}>Propostas de Parceria</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Empresa / Entidade</th>
                                <th>Email</th>
                                <th>Proposta</th>
                                <th>Data</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {partners.length === 0 ? (
                                <tr><td colSpan="5" style={{textAlign: 'center', padding: '30px'}}>Nenhuma proposta encontrada.</td></tr>
                            ) : (
                                partners.map(p => (
                                    <tr key={p._id}>
                                        <td style={{fontWeight: 'bold'}}>{p.companyName}</td>
                                        <td><a href={`mailto:${p.contactEmail}`} style={{color: '#e50914'}}>{p.contactEmail}</a></td>
                                        <td style={{maxWidth: '300px', whiteSpace: 'pre-wrap', fontSize: '0.85rem', color: '#ccc'}}>{p.proposal}</td>
                                        <td>{new Date(p.createdAt).toLocaleDateString('pt-PT')}</td>
                                        <td>
                                            <button onClick={() => handleDelete('partner', p._id)} style={{background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '6px 10px', borderRadius: '4px'}}>
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
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
                @keyframes shimmer {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
            `}</style>
        </div>
    );
};

export default AdminDashboard;
