import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

const THEME = {
  gold: '#D4AF37',
  goldGradient: 'linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%)',
  glass: 'rgba(255, 255, 255, 0.03)',
  bg: '#000000',
  radius: '16px'
};

// URL del tuo Google Script
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwAKCHMbtAuFICRwJ4eijB1r6gnvYxq6BORDbRARhjpag32dvHusUayux87X0b7naq26Q/exec";

const styles = {
  container: { 
    minHeight: '100vh', 
    backgroundColor: THEME.bg, 
    color: '#fff', 
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif', 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center',
    padding: '20px',
    width: '100%',
    boxSizing: 'border-box'
  },
  homeContent: { width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  header: { textAlign: 'center', marginBottom: '30px' },
  brandTitle: { fontSize: '3.5rem', fontWeight: '800', margin: '0', color: THEME.gold, letterSpacing: '-2px' },
  subtitle: { color: '#fff', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '4px', opacity: 0.7 },
  mainButton: {
    background: THEME.goldGradient, color: '#000', border: 'none', padding: '16px 40px',
    borderRadius: '14px', fontSize: '1rem', fontWeight: '700', width: '100%', cursor: 'pointer', marginTop: '20px'
  },
  infoCard: {
    padding: '20px', background: THEME.glass, borderRadius: THEME.radius,
    width: '100%', border: '1px solid rgba(255,255,255,0.05)', marginTop: '15px'
  },
  contactBtn: {
    background: THEME.goldGradient, color: '#000', border: 'none', padding: '10px 15px',
    borderRadius: '10px', fontSize: '0.8rem', fontWeight: '700', marginTop: '12px', cursor: 'pointer'
  },
  serviceCard: {
    padding: '16px', background: THEME.glass, borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)',
    marginBottom: '10px', display: 'flex', justifyContent: 'space-between', cursor: 'pointer', width: '100%'
  },
  inputField: {
    padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)',
    background: THEME.glass, color: '#fff', fontSize: '1rem', width: '100%', marginTop: '10px', boxSizing: 'border-box'
  }
};

export default function App() {
  const navigate = useNavigate();
  const [dataSel, setDataSel] = useState('');
  const [oraSel, setOraSel] = useState('');
  const [nome, setNome] = useState('');
  const [telefono, setTelefono] = useState('');
  const [loading, setLoading] = useState(false);
  const [chiuso, setChiuso] = useState(false);

  const handleDateChange = (val) => {
    setDataSel(val);
    setOraSel('');
    const d = new Date(val).getDay();
    setChiuso(d === 0 || d === 1); 
  };

  const inviaPrenotazione = async () => {
    if (!nome || !telefono) return alert("Inserisci Nome e Telefono!");
    setLoading(true);
    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({ nome, telefono, servizio: localStorage.getItem('serv'), data: dataSel, ora: oraSel })
      });
      navigate('/successo');
    } catch (e) { alert("Errore. Riprova."); }
    setLoading(false);
  };

  const getTimes = () => {
    if (!dataSel || chiuso) return [];
    const d = new Date(dataSel).getDay();
    if (d === 6) return ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"];
    return ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00"];
  };

  const servizi = [
    {n: "Combo Taglio + Barba Deluxe", p: "25,00 €"},
    {n: "Taglio uomo", p: "17,00 €"},
    {n: "Taglio senior", p: "15,00 €"},
    {n: "Taglio ragazzo", p: "15,00 €"},
    {n: "Taglio bambino", p: "12,00 €"},
    {n: "Combo Taglio + Barba", p: "20,00 €"},
    {n: "Barba deluxe", p: "10,00 €"}
  ];

  return (
    <div style={styles.container}>
      <Routes>
        <Route path="/" element={
          <div style={styles.homeContent}>
            <div style={styles.header}>
              <h1 style={styles.brandTitle}>DonBlendz</h1>
              <p style={styles.subtitle}>BarberShop - APP</p>
            </div>
            <button onClick={() => navigate('/servizi')} style={styles.mainButton}>PRENOTA ORA</button>
            <div style={styles.infoCard}>
              <h3 style={{color: THEME.gold, fontSize: '0.8rem', marginBottom: '10px'}}>ORARI</h3>
              <p style={{fontSize: '0.9rem', color: '#ccc'}}>
                Mar - Ven: 09:00 - 12:30 / 14:00 - 19:30<br/>
                Sabato: 09:00 - 17:30 (Continuato)<br/>
                Dom - Lun: Chiuso
              </p>
            </div>
            <div style={styles.infoCard}>
              <h3 style={{color: THEME.gold, fontSize: '0.8rem', marginBottom: '10px'}}>CONTATTI & INFO</h3>
              <button onClick={() => window.open('https://wa.me/393447875378')} style={styles.contactBtn}>SCRIVI SU WHATSAPP</button>
            </div>
          </div>
        } />

        <Route path="/servizi" element={
          <div style={{width: '100%', maxWidth: '400px'}}>
            <button onClick={() => navigate('/')} style={{color:THEME.gold, background:'none', border:'none', marginBottom:'10px'}}>← Indietro</button>
            <h2 style={{textAlign:'center'}}>Scegli Servizio</h2>
            {servizi.map(s => (
              <div key={s.n} onClick={() => { localStorage.setItem('serv', s.n); navigate('/data'); }} style={styles.serviceCard}>
                <span>{s.n}</span><span style={{color: THEME.gold}}>{s.p}</span>
              </div>
            ))}
          </div>
        } />

        <Route path="/data" element={
          <div style={{width: '100%', maxWidth: '400px', textAlign: 'center'}}>
            <button onClick={() => navigate('/servizi')} style={{color:THEME.gold, background:'none', border:'none', marginBottom:'10px'}}>← Indietro</button>
            <h2>Data e Ora</h2>
            <input type="date" onChange={(e) => handleDateChange(e.target.value)} style={styles.inputField} />
            {dataSel && !chiuso && (
              <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'10px', marginTop:'20px'}}>
                {getTimes().map(t => (
                  <button key={t} onClick={() => setOraSel(t)} style={{padding:'12px', borderRadius:'10px', border: oraSel===t ? '1px solid #fff' : '1px solid #222', background: oraSel===t ? THEME.goldGradient : 'transparent', color: oraSel===t ? '#000' : '#fff'}}>{t}</button>
                ))}
              </div>
            )}
            {oraSel && <button onClick={() => navigate('/dati')} style={styles.mainButton}>CONTINUA</button>}
          </div>
        } />

        <Route path="/dati" element={
          <div style={{width: '100%', maxWidth: '400px', textAlign: 'center'}}>
            <h2>I tuoi Dati</h2>
            <input type="text" placeholder="Nome e Cognome" value={nome} onChange={(e) => setNome(e.target.value)} style={styles.inputField} />
            <input type="tel" placeholder="Cellulare" value={telefono} onChange={(e) => setTelefono(e.target.value)} style={styles.inputField} />
            <button onClick={inviaPrenotazione} style={styles.mainButton} disabled={loading}>{loading ? "CARICAMENTO..." : "CONFERMA"}</button>
          </div>
        } />

        <Route path="/successo" element={
          <div style={{textAlign:'center', paddingTop: '50px'}}>
            <h1 style={{fontSize: '4rem'}}>✅</h1>
            <h2 style={{color: THEME.gold}}>PRENOTATO!</h2>
            <p>Grazie {nome}, ti aspettiamo il {dataSel} alle {oraSel}.</p>
            <button onClick={() => navigate('/')} style={styles.mainButton}>TORNA ALLA HOME</button>
          </div>
        } />
      </Routes>
    </div>
  );
}
