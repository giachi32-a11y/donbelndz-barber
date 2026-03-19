import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

const THEME = {
  gold: '#D4AF37',
  goldGradient: 'linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%)',
  glass: 'rgba(255, 255, 255, 0.03)',
  bg: '#000000',
  radius: '16px'
};

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
    overflowX: 'hidden',
    boxSizing: 'border-box',
    paddingTop: 'env(safe-area-inset-top)', 
    paddingBottom: 'calc(env(safe-area-inset-bottom) + 20px)',
    paddingLeft: '20px',
    paddingRight: '20px',
    width: '100%'
  },
  homeContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    width: '100%',
    paddingBottom: '40px'
  },
  header: { textAlign: 'center', marginBottom: '30px' },
  brandTitle: { 
    fontSize: '3.5rem', 
    fontWeight: '800', 
    margin: '0', 
    letterSpacing: '-2px', 
    color: THEME.gold 
  },
  subtitle: { 
    color: '#ffffff', 
    textTransform: 'uppercase', 
    fontSize: '0.8rem', 
    letterSpacing: '4px', 
    fontWeight: '600', 
    marginTop: '5px',
    opacity: 0.7
  },
  mainButton: {
    background: THEME.goldGradient,
    color: '#000',
    border: 'none',
    padding: '16px 40px',
    borderRadius: '14px',
    fontSize: '1rem',
    fontWeight: '700',
    width: '100%',
    maxWidth: '280px',
    cursor: 'pointer',
    textAlign: 'center',
    boxShadow: '0 8px 16px rgba(212, 175, 55, 0.15)'
  },
  infoCard: {
    padding: '22px',
    background: THEME.glass,
    borderRadius: THEME.radius,
    width: '100%',
    maxWidth: '350px',
    border: '1px solid rgba(255,255,255,0.05)', 
    marginTop: '20px',
    textAlign: 'left',
    boxSizing: 'border-box'
  },
  serviceCard: {
    padding: '14px 18px',
    background: THEME.glass,
    borderRadius: '12px',
    width: '100%',
    maxWidth: '380px',
    border: '1px solid rgba(255,255,255,0.05)', 
    marginBottom: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    boxSizing: 'border-box'
  },
  inputField: {
    padding: '18px',
    borderRadius: '14px',
    border: '1px solid rgba(255,255,255,0.1)',
    background: THEME.glass,
    color: '#fff',
    fontSize: '1rem',
    width: '100%',
    maxWidth: '300px',
    textAlign: 'left',
    outline: 'none',
    marginTop: '15px',
    boxSizing: 'border-box'
  }
};

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [dataSel, setDataSel] = useState('');
  const [oraSel, setOraSel] = useState('');
  const [nome, setNome] = useState('');
  const [telefono, setTelefono] = useState('');
  const [loading, setLoading] = useState(false);
  const [chiuso, setChiuso] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const handleDateChange = (val) => {
    setDataSel(val);
    setOraSel('');
    const d = new Date(val).getDay();
    setChiuso(d === 0 || d === 1); 
  };

  const inviaPrenotazione = async () => {
    if (!nome || !telefono) {
      alert("Per favore, inserisci nome e telefono.");
      return;
    }
    setLoading(true);
    const payload = {
      nome: nome,
      telefono: telefono,
      servizio: localStorage.getItem('serv'),
      data: dataSel,
      ora: oraSel
    };

    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify(payload)
      });
      navigate('/conferma-finale');
    } catch (e) {
      alert("Errore di connessione. Riprova.");
    } finally {
      setLoading(false);
    }
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
              <h3 style={{color: THEME.gold, fontSize: '0.8rem', letterSpacing: '2px', marginBottom: '10px'}}>LOCATION</h3>
              <p style={{fontSize: '0.9rem', color: '#ccc', margin: 0}}>📍 via della colombina N^2, Campi Bisenzio (FI)</p>
            </div>
          </div>
        } />

        <Route path="/servizi" element={
          <div style={{width: '100%', maxWidth: '400px', paddingTop: '20px'}}>
            <button onClick={() => navigate('/')} style={{background:'none', border:'none', color:THEME.gold, marginBottom:'10px'}}>← Home</button>
            <h2 style={{fontSize: '2rem', marginBottom: '25px', textAlign:'center'}}>Scegli Servizio</h2>
            {servizi.map(s => (
              <div key={s.n} onClick={() => { localStorage.setItem('serv', s.n); navigate('/data-ora'); }} style={styles.serviceCard}>
                <span>{s.n}</span>
                <span style={{color: THEME.gold, fontWeight: '800'}}>{s.p}</span>
              </div>
            ))}
          </div>
        } />

        <Route path="/data-ora" element={
          <div style={{width: '100%', maxWidth: '360px', textAlign: 'center', paddingTop: '20px'}}>
            <button onClick={() => navigate('/servizi')} style={{background:'none', border:'none', color:THEME.gold, marginBottom:'20px'}}>← Servizi</button>
            <h2 style={{fontSize:'1.6rem', marginBottom:'20px'}}>Data e Ora</h2>
            <input type="date" onChange={(e) => handleDateChange(e.target.value)} style={{...styles.inputField, textAlign:'center'}} />
            
            {dataSel && !chiuso && (
              <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'10px', marginTop:'30px'}}>
                {getTimes().map(t => (
                  <button key={t} onClick={() => setOraSel(t)} 
                          style={{padding:'14px 0', borderRadius:'12px', border: oraSel === t ? `1px solid ${THEME.gold}` : '1px solid #222', background: oraSel === t ? THEME.goldGradient : 'rgba(255,255,255,0.05)', color: oraSel === t ? '#000' : '#fff', fontWeight:'700'}}>
                    {t}
                  </button>
                ))}
              </div>
            )}
            {oraSel && (
              <button onClick={() => navigate('/contatti')} style={{...styles.mainButton, marginTop:'40px', width:'100%'}}>CONTINUA</button>
            )}
          </div>
        } />

        <Route path="/contatti" element={
          <div style={{width: '100%', maxWidth: '360px', textAlign: 'center', paddingTop: '20px'}}>
            <button onClick={() => navigate('/data-ora')} style={{background:'none', border:'none', color:THEME.gold, marginBottom:'20px'}}>← Indietro</button>
            <h2 style={{fontSize:'1.6rem', marginBottom:'10px'}}>I tuoi dati</h2>
            <p style={{color:'#999', fontSize:'0.9rem', marginBottom:'20px'}}>Serve per segnare il tuo nome in agenda</p>
            
            <input type="text" placeholder="Tuo Nome e Cognome" value={nome} onChange={(e) => setNome(e.target.value)} style={styles.inputField} />
            <input type="tel" placeholder="Cellulare" value={telefono} onChange={(e) => setTelefono(e.target.value)} style={styles.inputField} />

            <button 
              disabled={loading}
              onClick={inviaPrenotazione} 
              style={{...styles.mainButton, marginTop:'40px', width:'100%', opacity: loading ? 0.5 : 1}}
            >
              {loading ? "INVIO IN CORSO..." : "CONFERMA PRENOTAZIONE"}
            </button>
          </div>
        } />

        <Route path="/conferma-finale" element={
          <div style={{textAlign:'center', paddingTop:'100px', width:'100%', maxWidth:'300px'}}>
            <div style={{fontSize:'60px', marginBottom:'20px'}}>✅</div>
            <h2 style={{color: THEME.gold, fontSize:'2rem'}}>CONFERMATO!</h2>
            <p style={{lineHeight:'1.6', marginTop:'20px', fontSize:'1.1rem'}}>
              Ciao <strong>{nome}</strong>, la tua prenotazione per <strong>{localStorage.getItem('serv')}</strong> è stata registrata correttamente.<br/><br/>
              Ci vediamo il <strong>{dataSel}</strong> alle ore <strong>{oraSel}</strong>!
            </p>
            <button onClick={() => { setNome(''); setOraSel(''); navigate('/'); }} style={{...styles.mainButton, marginTop:'40px'}}>TORNA ALLA HOME</button>
          </div>
        } />
      </Routes>
    </div>
  );
}
