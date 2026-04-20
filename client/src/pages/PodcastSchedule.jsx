import React, { useState } from 'react';
import API from '../api';
import { Youtube, Music, Send, CheckCircle, Upload, MessageSquare, Info } from 'lucide-react';
import Footer from '../components/Footer';

const PodcastSchedule = () => {
    const [formData, setFormData] = useState({
        animeExperience: '',
        proposedTopics: '',
        contactWhatsApp: '',
        proof: null
    });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const suggestedTopics = [
        "O Crescimento da Cultura Otaku em Moçambique",
        "Debate: Por que os vilões de anime são tão cativantes?",
        "Animes que mudaram a nossa percepção de mundo",
        "A evolução do traço: Do clássico ao CGI moderno",
        "Adaptações de Mangá: Fidelidade vs Criatividade"
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.proof) return alert("Por favor, anexe o comprovativo de 250 MT.");

        setLoading(true);
        const data = new FormData();
        data.append('animeExperience', formData.animeExperience);
        data.append('proposedTopics', formData.proposedTopics);
        data.append('contactWhatsApp', formData.contactWhatsApp);
        data.append('proof', formData.proof);

        try {
            await API.post('/interviews', data);
            setSubmitted(true);
        } catch (error) {
            alert("Erro ao enviar pedido. Verifique os dados.");
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="container" style={{paddingTop: '150px', textAlign: 'center', minHeight: '80vh'}}>
                <CheckCircle size={80} color="#E50914" />
                <h1 style={{marginTop: '20px'}}>Pedido Enviado com Sucesso!</h1>
                <p style={{fontSize: '1.2rem', color: '#aaa', marginTop: '10px'}}>Nossa equipe entrará em contacto via WhatsApp em breve para agendar sua entrevista.</p>
                <button className="btn-primary" onClick={() => window.location.href = '/'} style={{marginTop: '30px'}}>Voltar ao Início</button>
            </div>
        );
    }

    return (
        <div className="podcast-page">
            <div className="podcast-hero">
                <div className="container">
                    <div className="badge">PARTICIPE NO PODCAST</div>
                    <h1>Quer ser Entrevistado no Universo Otaku?</h1>
                    <p>Venha debater animes, mangás e cultura nerd no maior podcast otaku do país!</p>
                </div>
            </div>

            <div className="container schedule-grid">
                <div className="requirements-section">
                    <h2>🚀 Condições para Participar</h2>
                    <div className="req-card">
                        <div className="req-item">
                            <Youtube color="#FF0000" />
                            <div>
                                <strong>Seguir no YouTube</strong>
                                <a href="https://www.youtube.com/@Universo_Otaku_Podcast" target="_blank">@Universo_Otaku_Podcast</a>
                            </div>
                        </div>
                        <div className="req-item">
                            <Music color="#000000" />
                            <div>
                                <strong>Seguir no TikTok</strong>
                                <a href="https://www.tiktok.com/@universo_otaku4/" target="_blank">@universo_otaku4</a>
                            </div>
                        </div>
                        <div className="req-item">
                            <Info color="#E50914" />
                            <div>
                                <strong>Contribuição Logística</strong>
                                <p>Valor fixo de 250 MT para suporte técnico e produção.</p>
                            </div>
                        </div>
                    </div>

                    <div className="suggestions">
                        <h3>💡 Ideias de Tópicos para Debater</h3>
                        <ul>
                            {suggestedTopics.map((topic, i) => <li key={i}><MessageSquare size={14} /> {topic}</li>)}
                        </ul>
                    </div>
                </div>

                <div className="form-section">
                    <form onSubmit={handleSubmit} className="schedule-form">
                        <div className="input-block">
                            <label>Sua Experiência com Animes</label>
                            <textarea 
                                placeholder="Quais animes você assistiu? Há quanto tempo é fã?" 
                                value={formData.animeExperience}
                                onChange={e => setFormData({...formData, animeExperience: e.target.value})}
                                required
                            />
                        </div>
                        <div className="input-block">
                            <label>Tópicos que Deseja Debater</label>
                            <textarea 
                                placeholder="Sobre o que você quer falar no podcast?" 
                                value={formData.proposedTopics}
                                onChange={e => setFormData({...formData, proposedTopics: e.target.value})}
                                required
                            />
                        </div>
                        <div className="input-block">
                            <label>WhatsApp de Contacto</label>
                            <input 
                                type="text" 
                                placeholder="Ex: 84XXXXXXX" 
                                value={formData.contactWhatsApp}
                                onChange={e => setFormData({...formData, contactWhatsApp: e.target.value})}
                                required
                            />
                        </div>
                        <div className="upload-block">
                            <label>Comprovativo (250 MT)</label>
                            <div className="file-input">
                                <label htmlFor="proof"><Upload size={18} /> {formData.proof ? formData.proof.name : "Selecionar Comprovativo"}</label>
                                <input type="file" id="proof" onChange={e => setFormData({...formData, proof: e.target.files[0]})} hidden required />
                            </div>
                        </div>

                        <button type="submit" className="auth-btn" disabled={loading}>
                            {loading ? "Enviando..." : "Solicitar Agendamento"}
                        </button>
                    </form>
                </div>
            </div>

            <Footer />

            <style>{`
                .podcast-page { background: #141414; min-height: 100vh; padding-top: 70px; }
                .podcast-hero { padding: 80px 4%; background: linear-gradient(rgba(0,0,0,0.8), #141414), url('https://w0.peakpx.com/wallpaper/403/16/HD-wallpaper-anime-setup-room-anime-art.jpg'); background-size: cover; background-position: center; border-bottom: 2px solid #333; margin-bottom: 40px; }
                .podcast-hero h1 { font-size: 3.2rem; font-weight: 800; max-width: 800px; margin-top: 20px; }
                .badge { background: #E50914; color: white; padding: 5px 12px; font-weight: bold; border-radius: 4px; font-size: 0.85rem; width: fit-content; text-transform: uppercase; }

                .schedule-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 50px; padding-bottom: 100px; }
                .req-card { background: #222; padding: 30px; border-radius: 12px; margin-top: 20px; display: flex; flex-direction: column; gap: 20px; border: 1px solid #333; }
                .req-item { display: flex; gap: 15px; align-items: flex-start; }
                .req-item strong { display: block; margin-bottom: 5px; }
                .req-item a { color: #0084ff; }
                
                .suggestions { margin-top: 40px; }
                .suggestions h3 { margin-bottom: 15px; }
                .suggestions ul { list-style: none; display: flex; flex-direction: column; gap: 12px; }
                .suggestions li { color: #ccc; font-size: 0.95rem; display: flex; align-items: center; gap: 10px; background: rgba(255,255,255,0.05); padding: 10px; border-radius: 4px; }
                
                .schedule-form { background: #222; padding: 40px; border-radius: 12px; position: sticky; top: 100px; }
                .input-block { margin-bottom: 25px; }
                .input-block label { display: block; margin-bottom: 10px; font-weight: 600; color: #ddd; }
                .input-block textarea, .input-block input { width: 100%; padding: 12px; background: #111; border: 1px solid #444; color: white; border-radius: 4px; }
                .input-block textarea { height: 100px; resize: none; }
                
                .upload-block { margin-bottom: 30px; }
                .file-input label { display: flex; align-items: center; gap: 10px; background: #333; padding: 12px; border-radius: 4px; cursor: pointer; justify-content: center; border: 1px dashed #666; }

                @media (max-width: 968px) {
                    .schedule-grid { grid-template-columns: 1fr; }
                    .podcast-hero h1 { font-size: 2.2rem; }
                    .schedule-form { position: static; }
                }
            `}</style>
        </div>
    );
};

export default PodcastSchedule;
