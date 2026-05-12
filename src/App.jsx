import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import StaffDashboard from './StaffDashboard'; 

const THEME = {
  gold: '#D4AF37',
  goldGradient: 'linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%)',
  glass: 'rgba(255, 255, 255, 0.03)',
  bg: '#000000',
  radius: '16px'
};

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzkw1S_kuhvlxR19LuWgMVgbMzmIqkHNWEZAf-j-9QC4uEmsx3ICpwyk4wLcF3TOdw9JQ/exec";

const styles = {
  splash: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: '#000', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', zIndex: 9999, transition: 'opacity 0.8s ease' },
  splashImage: { width: '160px', height: '160px', marginBottom: '20px', animation: 'fadeInScale 1.5s ease', borderRadius: '25px', objectFit: 'contain' },
  loadingText: { color: '#fff', fontSize: '0.7rem', letterSpacing: '5px', marginTop: '10px', opacity: 0.5, animation: 'pulse 2s infinite' },
  container: { minHeight: '100vh', backgroundColor: THEME.bg, color: '#fff', fontFamily: '-apple-system, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', overflowX: 'hidden', boxSizing: 'border-box', paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'calc(env(safe-area-inset-bottom) + 20px)', paddingLeft: '20px', paddingRight: '20px', width: '100%' },
  homeContent: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, width: '100%', paddingBottom: '40px', position: 'relative' },
  header: { textAlign: 'center', marginBottom: '30px' },
  brandTitle: { fontSize: '3.5rem', fontWeight: '800', margin: '0', letterSpacing: '-2px', color: THEME.gold },
  subtitle: { color: '#ffffff', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '4px', fontWeight: '600', marginTop: '5px', opacity: 0.7 },
  installButton: { background: 'transparent', color: THEME.gold, border: `1px solid ${THEME.gold}`, padding: '10px 24px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '700', marginBottom: '15px', cursor: 'pointer' },
  mainButton: { background: THEME.goldGradient, color: '#000', border: 'none', padding: '16px 40px', borderRadius: '14px', fontSize: '1rem', fontWeight: '700', width: '100%', maxWidth: '280px', cursor: 'pointer', textAlign: 'center', boxShadow: '0 8px 16px rgba(212, 175, 55, 0.15)' },
  secButton: { background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '12px 30px', borderRadius: '14px', fontSize: '0.9rem', fontWeight: '600', width: '100%', maxWidth: '280px', cursor: 'pointer', marginTop: '15px' },
  infoCard: { padding: '22px', background: THEME.glass, borderRadius: THEME.radius, width: '100%', maxWidth: '350px', border: '1px solid rgba(255,255,255,0.05)', marginTop: '20px', textAlign: 'left', boxSizing: 'border-box' },
  contactBtn: { background: THEME.goldGradient, color: '#000', border: 'none', padding: '10px 15px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: '700', marginTop: '12px', cursor: 'pointer', display: 'inline-block', textDecoration: 'none' },
  serviceCard: { padding: '14px 18px', background: THEME.glass, borderRadius: '12px', width: '100%', maxWidth: '380px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', boxSizing: 'border-box' },
  dateInput: { padding: '18px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)', background: THEME.glass, color: '#fff', fontSize: '1.1rem', width: '100%', maxWidth: '300px', textAlign: 'center', outline: 'none', marginTop: '20px' },
  inputField: { padding: '18px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)', background: THEME.glass, color: '#fff', fontSize: '1rem', width: '100%', maxWidth: '300px', marginTop: '15px', outline: 'none', boxSizing: 'border-box' },
  apptCard: { padding: '15px', background: THEME.glass, borderRadius: '12px', width: '100%', maxWidth: '300px', border: '1px solid rgba(255,255,255,0.05)', margin: '0 auto 10px auto', textAlign: 'left', boxSizing: 'border-box' },
  staffBtn: { position: 'absolute', top: '0px', right: '0px', background: 'transparent', color: THEME.gold, border: 'none', fontSize: '0.7rem', fontWeight: 'bold', letterSpacing: '1px', opacity: 0.5, cursor: 'pointer', padding: '10px' }
};

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [showSplash, setShowSplash] = useState(true);
  const [dataSel, setDataSel] = useState('');
  const [oraSel, setOraSel] = useState('');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [loading, setLoading] = useState(false);
  const [chiuso, setChiuso] = useState(false);
  const [isPast, setIsPast] = useState(false);
  const [occupati, setOccupati] = useState([]);
  const [showInstall, setShowInstall] = useState(false);
  const [servizioExtra, setServizioExtra] = useState(null);
  const [datiExtra, setDatiExtra] = useState({ nome: '', email: '', tel: '' });
  const [mieiAppuntamenti, setMieiAppuntamenti] = useState([]);
  const [telRicerca, setTelRicerca] = useState('');
  const [stepDisdetta, setStepDisdetta] = useState('ricerca'); 
  const [codiceInserito, setCodiceInserito] = useState('');
  const [appuntamentoDaCancellare, setAppuntamentoDaCancellare] = useState(null);
  const [fasciaOraria, setFasciaOraria] = useState('Qualsiasi orario');

  useEffect(() => {
    const timer = setTimeout(() => { setShowSplash(false); }, 2800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    setShowInstall(!isStandalone);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const todayStr = new Date().toISOString().split('T')[0];

  const isFestivo = (data) => {
    const festivi = ["-01-01", "-01-06", "-04-25", "-06-02", "-08-15", "-11-01", "-12-08", "-12-25", "-12-26", "2026-04-06"];
    const monthDay = data.substring(4); 
    return festivi.includes(monthDay) || festivi.includes(data);
  };

  const handleInstallClick = () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    if (isIOS) alert("PRO TIP: Clicca l'icona 'Condividi' in basso e seleziona 'Aggiungi alla schermata Home'.");
    else alert("Clicca i tre puntini in alto a destra e seleziona 'Installa applicazione'.");
  };

  const checkOccupati = async (data) => {
    setLoading(true);
    try {
      const serv = localStorage.getItem('serv') || "";
      const resp = await fetch(`${SCRIPT_URL}?date=${data}&service=${encodeURIComponent(serv)}`);
      const dataOccupati = await resp.json();
      setOccupati(Array.isArray(dataOccupati) ? dataOccupati : []);
    } catch (e) { setOccupati([]); }
    setLoading(false);
  };

  const handleDateChange = (val) => {
    if (!val) return;
    setDataSel(val);
    setOraSel('');
    const selectedDate = new Date(val + "T00:00:00");
    const todayNoTime = new Date(todayStr + "T00:00:00");
    if (selectedDate < todayNoTime) { setIsPast(true); return; }
    setIsPast(false);
    const d = selectedDate.getDay();
    const isChiuso = d === 0 || d === 1 || isFestivo(val);
    setChiuso(isChiuso);
    if (!isChiuso) checkOccupati(val);
  };

  const inviaPrenotazione = async () => {
    if (!nome || !telefono || !email) return alert("Per favore, inserisci nome, email e telefono.");
    if (!email.includes("@") || !email.includes(".")) return alert("Inserisci una email valida.");
    if (loading) return; 
    const cleanTel = telefono.replace(/\s+/g, ''); 
    setLoading(true);
    try {
      await fetch(SCRIPT_URL, { 
        method: 'POST', 
        mode: 'no-cors', 
        body: JSON.stringify({ nome, email, telefono: cleanTel, servizio: localStorage.getItem('serv'), data: dataSel, ora: oraSel }) 
      });
      navigate('/conferma-finale');
    } catch (e) { alert("Errore nell'invio. Riprova."); } finally { setLoading(false); }
  };

  // --- CORREZIONE FUNZIONE LISTA ATTESA ---
  const inviaListaAttesa = async () => {
    if (!nome || !telefono || !email) return alert("Per favore, inserisci nome, email e telefono.");
    if (!email.includes("@") || !email.includes(".")) return alert("Inserisci una email valida.");
    
    setLoading(true);
    try {
      await fetch(SCRIPT_URL, { 
        method: 'POST', 
        body: JSON.stringify({ 
          action: 'addToWaitingList',
          nome: nome, 
          email: email, 
          tel: telefono.replace(/\s+/g, ''), 
          dataScelta: dataSel + " (" + fasciaOraria + ")"
        }) 
      });
      alert("Sei stato inserito in lista d'attesa! Ti contatteremo se si libera un posto.");
      navigate('/');
    } catch (e) { alert("Errore nell'invio. Riprova."); } finally { setLoading(false); }
  };

  const cercaAppuntamenti = async () => {
    if (!telRicerca) return alert("Inserisci il tuo numero di telefono.");
    setLoading(true);
    try {
      const resp = await fetch(`${SCRIPT_URL}?action=getUserEvents&tel=${encodeURIComponent(telRicerca.replace(/\s+/g, ''))}`);
      const data = await resp.json();
      setMieiAppuntamenti(data);
      if (data.length === 0) alert("Nessun appuntamento trovato per questo numero.");
    } catch (e) { alert("Errore nella ricerca."); } finally { setLoading(false); }
  };

  const richiediCodiceDisdetta = async (appt) => {
    setLoading(true);
    setAppuntamentoDaCancellare(appt);
    try {
      await fetch(SCRIPT_URL, { 
        method: 'POST', 
        mode: 'no-cors', 
        body: JSON.stringify({ action: 'sendOTP', tel: telRicerca.replace(/\s+/g, '') }) 
      });
      alert("Abbiamo inviato un codice di conferma alla tua email.");
      setStepDisdetta('codice');
    } catch (e) { alert("Errore nell'invio del codice."); } finally { setLoading(false); }
  };

  const confermaDisdetta = async () => {
    if (!codiceInserito) return alert("Inserisci il codice ricevuto per email.");
    setLoading(true);
    try {
      await fetch(SCRIPT_URL, { 
        method: 'POST', 
        mode: 'no-cors', 
        body: JSON.stringify({ 
          action: 'deleteEventSecure', 
          eventId: appuntamentoDaCancellare.id, 
          otp: codiceInserito,
          tel: telRicerca.replace(/\s+/g, '')
        }) 
      });
      alert("Richiesta inviata. Se il codice è corretto, l'appuntamento verrà rimosso e riceverai una conferma via email.");
      setMieiAppuntamenti(mieiAppuntamenti.filter(a => a.id !== appuntamentoDaCancellare.id));
      setStepDisdetta('ricerca');
      setCodiceInserito('');
    } catch (e) { alert("Errore durante la cancellazione."); } finally { setLoading(false); }
  };

  const getTimes = () => {
    if (!dataSel || chiuso || isPast) return [];
    if (dataSel.endsWith("-12-31")) return ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00"];
    if (dataSel.endsWith("-05-01")) return ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00"];
    const d = new Date(dataSel).getDay();
    if (d === 6) return ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"];
    return ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00"];
  };

  const servizi = [{n: "Combo Taglio + Barba Deluxe", p: "25,00 €"}, {n: "Taglio uomo", p: "17,00 €"}, {n: "Taglio senior", p: "15,00 €"}, {n: "Taglio ragazzo", p: "15,00 €"}, {n: "Taglio bambino", p: "12,00 €"}, {n: "Combo Taglio + Barba", p: "20,00 €"}, {n: "Barba deluxe", p: "10,00 €"}];
  const slots = getTimes();
  const tuttoPieno = slots.length > 0 && slots.every(t => occupati.includes(t));

  return (
    <>
      <style>
        {`
          @keyframes fadeInScale { 0% { opacity: 0; transform: scale(0.8); } 100% { opacity: 1; transform: scale(1); } }
          @keyframes pulse { 0% { transform: scale(1); opacity: 0.8; } 50% { transform: scale(1.05); opacity: 1; } 100% { transform: scale(1); opacity: 0.8; } }
        `}
      </style>

      {showSplash && (
        <div style={styles.splash}>
          <img src="https://raw.githubusercontent.com/giachi32-a11y/donbelndz-barber/main/logo512.png" alt="Logo" style={styles.splashImage} onError={(e) => { e.target.src = "logo512.png"; }} />
          <div style={styles.loadingText}>V 2.4</div>
        </div>
      )}

      <div style={{...styles.container, opacity: showSplash ? 0 : 1, transition: 'opacity 1s ease'}}>
        <Routes>
          <Route path="/" element={
            <div style={styles.homeContent}>
              <button onClick={() => navigate('/staff-access')} style={styles.staffBtn}>AREA STAFF</button>
              <div style={styles.header}><h1 style={styles.brandTitle}>DonBlendz</h1><p style={styles.subtitle}>BarberShop - APP</p></div>
              {showInstall && <button onClick={handleInstallClick} style={styles.installButton}>📲 INSTALLA APP SU HOME</button>}
              <button onClick={() => navigate('/servizi')} style={styles.mainButton}>PRENOTA ORA</button>
              <button onClick={() => navigate('/miei-appuntamenti')} style={styles.secButton}>I MIEI APPUNTAMENTI</button>
              <div style={styles.infoCard}>
                <h3 style={{color: THEME.gold, fontSize: '0.8rem', letterSpacing: '2px', marginBottom: '10px'}}>ORARI NEGOZIO ⌚️</h3>
                <p style={{fontSize: '0.9rem', lineHeight: '1.6', margin: 0, color: '#ccc'}}>
                  <span style={{color: '#fff'}}>Mar - Ven:</span> 09:00 - 12:30 / 14:00 - 19:30<br/>
                  <span style={{color: '#fff'}}>Sabato:</span> 09:00 - 17:30 (Continuato)<br/>
                  <span style={{color: '#fff'}}>Dom - Lun:</span> Chiuso
                </p>
                <hr style={{border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', margin: '15px 0'}} />
                <h3 style={{color: THEME.gold, fontSize: '0.9rem', letterSpacing: '2px', marginBottom: '10px'}}>LOCATION 📍</h3>
                <p style={{fontSize: '0.9rem', color: '#ccc', margin: 0}}>Via della Colombina N^2 - Campi Bisenzio (FI)</p>
                <hr style={{border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', margin: '15px 0'}} />
                <h3 style={{color: THEME.gold, fontSize: '0.9rem'}}>DOMANDE? ☝️</h3>
                <p style={{fontSize: '0.9rem', color: '#ccc', marginBottom: '10px'}}>Scrivici su whatsapp!</p>
                <a href="https://wa.me/393447875378?text=Ciao%20Danilo%2C%20vorrei%20un'informazione%3A" target="_blank" rel="noopener noreferrer" style={{...styles.contactBtn, marginTop: '15px', textAlign: 'center', width: '100%', boxSizing: 'border-box'}}>CONTATTA SU WHATSAPP 💬</a>
              </div>
            </div>
          } />

          <Route path="/staff-access" element={<StaffDashboard onBack={() => navigate('/')} />} />

          <Route path="/miei-appuntamenti" element={
            <div style={{width: '100%', maxWidth: '360px', textAlign: 'center', paddingTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              <button onClick={() => navigate('/')} style={{background:'none', border:'none', color:THEME.gold, alignSelf: 'flex-start'}}>← Home</button>
              <h2 style={{fontWeight:'800', color: '#fff' , marginBottom: '10px', fontSize: '1.6rem', letterSpacing: '1px', textTransform: 'uppercase'}}>I TUOI APPUNTAMENTI</h2>
              {stepDisdetta === 'ricerca' ? (
                <>
                  <p style={{fontSize:'0.85rem', opacity:0.7, marginBottom:'20px'}}>Inserisci il tuo numero per gestire le prenotazioni</p>
                  <input type="tel" placeholder="Cellulare" value={telRicerca} onChange={(e) => setTelRicerca(e.target.value)} style={styles.inputField} />
                  <button onClick={cercaAppuntamenti} style={{...styles.mainButton, marginTop:'20px', width:'100%'}} disabled={loading}>{loading ? "RICERCA..." : "VEDI APPUNTAMENTI"}</button>
                  <div style={{marginTop:'30px', width:'100%'}}>
                    {mieiAppuntamenti.map(a => (
                      <div key={a.id} style={styles.apptCard}>
                        <div style={{fontWeight:'700', color:THEME.gold}}>{a.title}</div>
                        <div style={{fontSize:'0.9rem', margin:'5px 0'}}>📅 {new Date(a.start).toLocaleDateString('it-IT')} ore {new Date(a.start).toLocaleTimeString('it-IT', {hour: '2-digit', minute:'2-digit'})}</div>
                        {a.canDelete ? ( <button onClick={() => richiediCodiceDisdetta(a)} style={{background:'#FF453A', color:'#fff', border:'none', padding:'8px 15px', borderRadius:'8px', fontSize:'0.75rem', fontWeight:'700', marginTop:'10px', cursor:'pointer'}}>DISDICI</button> ) : ( <div style={{fontSize:'0.75rem', color:'#FF453A', fontWeight:'600', marginTop:'10px'}}>Disdetta non possibile per oggi. Contattaci su WhatsApp.</div> )}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div style={styles.infoCard}>
                  <h3 style={{color: THEME.gold, textAlign: 'center'}}>Verifica Identità</h3>
                  <p style={{fontSize:'0.85rem', textAlign: 'center', color: '#ccc'}}>Inserisci il codice di 6 cifre inviato alla tua email per confermare la cancellazione.</p>
                  <input type="text" maxLength="6" placeholder="000000" value={codiceInserito} onChange={(e) => setCodiceInserito(e.target.value)} style={{...styles.inputField, textAlign: 'center', fontSize: '1.8rem', letterSpacing: '8px', color: THEME.gold}} />
                  <button onClick={confermaDisdetta} style={{...styles.mainButton, marginTop:'20px', width:'100%'}} disabled={loading}>{loading ? "VERIFICA..." : "CONFERMA ANNULLAMENTO"}</button>
                  <button onClick={() => { setStepDisdetta('ricerca'); setCodiceInserito(''); }} style={{...styles.secButton, width:'100%', border: 'none'}}>Indietro</button>
                </div>
              )}
            </div>
          } />

        <Route path="/servizi" element={
  <div style={{width: '100%', maxWidth: '400px', paddingTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
    <button onClick={() => navigate('/')} style={{background:'none', border:'none', color:THEME.gold, marginBottom:'5px', alignSelf: 'flex-start'}}>← Home</button>
    
    {/* BLOCCO: SERVIZI STYLING (Spazi ridotti) */}
    <div style={{marginBottom: '15px', textAlign: 'center', width: '100%'}}>
      <h2 style={{fontWeight:'800', color: THEME.gold, marginBottom: '2px', fontSize: '1.6rem', letterSpacing: '1px'}}>SERVIZI DI STYLING</h2>
      <p style={{fontSize: '0.8rem', color: '#888', marginBottom: '12px', fontStyle: 'italic'}}>Comprensivi di taglio</p>
      {[
        {n: "Decolorazione", p: "70,00 €"},
        {n: "Mesh", p: "60,00 €"}
      ].map(s => (
        <div key={s.n} onClick={() => { localStorage.setItem('serv', s.n); navigate('/prenota'); }} 
             style={{...styles.serviceCard, border: `1px solid ${THEME.gold}44`, background: 'rgba(212, 175, 55, 0.05)', margin: '0 auto 8px auto', padding: '12px 18px'}}>
          <span style={{fontWeight: '700'}}>{s.n.toUpperCase()}</span>
          <span style={{color: THEME.gold, fontWeight: '800'}}>{s.p}</span>
        </div>
      ))}
    </div>

    {/* TITOLO SERVIZI CLASSICI (Spazio superiore minimizzato) */}
    <div style={{textAlign: 'center', marginBottom: '12px', width: '100%'}}>
      <h2 style={{fontWeight:'800', color: THEME.gold, marginBottom: '2px', fontSize: '1.6rem', letterSpacing: '1px', textTransform: 'uppercase'}}>SERVIZI CLASSICI</h2>
      <p style={{fontSize: '0.8rem', color: '#888', fontStyle: 'italic'}}>Taglio ragazzo: fino medie e/o superiori</p>
    </div>
    
    <div style={{width: '100%'}}>
      {servizi.map(s => (
        <div key={s.n} onClick={() => { localStorage.setItem('serv', s.n); navigate('/prenota'); }} 
             style={{...styles.serviceCard, margin: '0 auto 6px auto', padding: '12px 18px'}}>
          <span style={{fontWeight: '600'}}>{s.n}</span>
          <span style={{color: THEME.gold, fontWeight: '800'}}>{s.p}</span>
        </div>
      ))}
    </div>
  </div>
} />

         <Route path="/prenota" element={
  <div style={{width: '100%', maxWidth: '360px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '20px'}}>
    <button onClick={() => navigate('/servizi')} style={{background:'none', border:'none', color:THEME.gold, alignSelf: 'flex-start'}}>← Servizi</button>
    <h2 style={{fontWeight:'800', color: '#fff' , marginBottom: '20px', fontSize: '1.6rem', letterSpacing: '1px', textTransform: 'uppercase'}}>SCEGLI DATA E ORA</h2>
    
    {/* CONTENITORE PROFESSIONALE PER IL CALENDARIO */}
    <div style={{position: 'relative', width: '100%', maxWidth: '300px', height: '55px'}}>
      <label style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: THEME.goldGradient,
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: '0 4px 15px rgba(212, 175, 55, 0.2)',
        zIndex: 1
      }}>
        <span style={{
          color: '#000',
          fontWeight: '800',
          fontSize: '0.9rem',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}>
          {dataSel ? dataSel.split('-').reverse().join('/') : "📅 APRI CALENDARIO"}
        </span>
        
        {/* L'input è qui ma è totalmente invisibile, serve solo ad attivare il click */}
        <input 
          type="date" 
          min={todayStr} 
          onChange={(e) => handleDateChange(e.target.value)} 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: 0, // Lo rende invisibile al 100%
            cursor: 'pointer',
            zIndex: 2,
            appearance: 'none',
            WebkitAppearance: 'none'
          }} 
        />
      </label>
    </div>

    {loading && <p style={{color: THEME.gold, marginTop: '15px'}}>Controllo agenda...</p>}
    
    {isPast && <div style={{color:'#FF453A', marginTop:'20px', fontWeight:'700'}}>Non puoi prenotare nel passato.</div>}
    {dataSel && chiuso && !isPast && <div style={{color:'#FF453A', marginTop:'20px', fontWeight:'700'}}>Siamo chiusi. Scegli un altro giorno.</div>}
    
    {dataSel && !chiuso && !loading && !isPast && (
      <>
        <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'10px', width:'100%', marginTop:'30px'}}>
          {getTimes().map(t => {
            const isBusy = occupati.includes(t);
            return ( <button key={t} disabled={isBusy} onClick={() => setOraSel(t)} style={{padding:'14px 0', borderRadius:'12px', border: oraSel === t ? `1px solid ${THEME.gold}` : '1px solid #222', background: isBusy ? '#111' : (oraSel === t ? THEME.goldGradient : 'rgba(255,255,255,0.05)'), color: isBusy ? '#444' : (oraSel === t ? '#000' : '#fff'), fontWeight:'700', textDecoration: isBusy ? 'line-through' : 'none'}}>{isBusy ? "Pieno" : t}</button> );
          })}
        </div>
        {tuttoPieno && (
          <div style={{marginTop: '30px', padding: '20px', background: 'rgba(212, 175, 55, 0.05)', borderRadius: '14px', border: `1px solid ${THEME.gold}`, width: '100%', boxSizing: 'border-box'}}>
            <p style={{fontSize: '0.9rem', marginBottom: '10px'}}>Posti esauriti!</p>
            <button onClick={() => navigate('/lista-attesa')} style={{...styles.mainButton, fontSize: '0.85rem', padding: '12px 20px'}}> AVVISAMI SE SI LIBERA UN POSTO 🔔 </button>
          </div>
        )}
      </>
    )}
    {oraSel && <button onClick={() => navigate('/dati-cliente')} style={{...styles.mainButton, marginTop:'40px', width:'100%'}}>CONTINUA</button>}
  </div>
} />



          <Route path="/lista-attesa" element={
            <div style={{width: '100%', maxWidth: '360px', textAlign: 'center', paddingTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              <button onClick={() => navigate('/prenota')} style={{background:'none', border:'none', color:THEME.gold, alignSelf: 'flex-start'}}>← Indietro</button>
              <h2 style={{fontWeight:'800', color: THEME.gold, marginBottom: '2px', fontSize: '1.6rem', letterSpacing: '1px', textTransform: 'uppercase'}}>LISTA D'ATTESA</h2>
              <p style={{fontSize: '0.85rem', opacity: 0.7, marginBottom: '20px'}}>Ti contatteremo se si libera un posto per il {dataSel}</p>
              <input type="text" placeholder="Nome e Cognome" value={nome} onChange={(e) => setNome(e.target.value)} style={styles.inputField} />
              <input type="email" placeholder="Email (per avviso)" value={email} onChange={(e) => setEmail(e.target.value)} style={styles.inputField} />
              <input type="tel" placeholder="Cellulare" value={telefono} onChange={(e) => setTelefono(e.target.value)} style={styles.inputField} />
              <p style={{fontSize: '0.85rem', marginTop: '20px', color: THEME.gold}}>Fascia oraria preferita:</p>
              <select value={fasciaOraria} onChange={(e) => setFasciaOraria(e.target.value)} style={{...styles.inputField, marginTop: '10px', appearance: 'none'}}>
                <option value="Qualsiasi orario">Qualsiasi orario</option>
                <option value="Solo Mattina">Solo Mattina (09:00 - 12:30)</option>
                <option value="Solo Pomeriggio">Solo Pomeriggio (14:00 - 19:30)</option>
              </select>
              <button disabled={loading} onClick={inviaListaAttesa} style={{...styles.mainButton, marginTop:'30px', width:'100%', opacity: loading ? 0.5 : 1}}>{loading ? "INVIO..." : "ISCRIVITI ALLA LISTA"}</button>
            </div>
          } />

          <Route path="/dati-cliente" element={
            <div style={{width: '100%', maxWidth: '360px', textAlign: 'center', paddingTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              <button onClick={() => navigate('/prenota')} style={{background:'none', border:'none', color:THEME.gold, alignSelf: 'flex-start'}}>← Indietro</button>
              <h2 style={{fontWeight:'800', color: '#fff' , marginBottom: '2px', fontSize: '1.6rem', letterSpacing: '1px', textTransform: 'uppercase'}}>I TUOI RECAPITI</h2>
              <input type="text" placeholder="Nome e Cognome" value={nome} onChange={(e) => setNome(e.target.value)} style={styles.inputField} />
              <input type="email" placeholder="La tua Email" value={email} onChange={(e) => setEmail(e.target.value)} style={styles.inputField} />
              <input type="tel" placeholder="Cellulare" value={telefono} onChange={(e) => setTelefono(e.target.value)} style={styles.inputField} />
              <button disabled={loading} onClick={inviaPrenotazione} style={{...styles.mainButton, marginTop:'40px', width:'100%', opacity: loading ? 0.5 : 1}}>{loading ? "INVIO..." : "CONFERMA PRENOTAZIONE"}</button>
            </div>
          } />

          <Route path="/conferma-finale" element={
            <div style={{textAlign:'center', paddingTop:'80px', display:'flex', flexDirection:'column', alignItems:'center'}}>
              <div style={{fontSize:'60px'}}>✅</div>
              <h2 style={{color: THEME.gold, fontSize:'2rem'}}>CONFERMATO!</h2>
              <p>Ciao {nome}, ci vediamo il {dataSel} alle {oraSel}!</p>
              <p style={{fontSize:'0.8rem', opacity:0.6, marginTop:'10px'}}>Riceverai un'email di conferma all'indirizzo {email}</p>
              <button onClick={() => { setNome(''); setOraSel(''); setEmail(''); navigate('/'); }} style={{...styles.mainButton, marginTop:'40px'}}>TORNA ALLA HOME</button>
            </div>
          } />
        </Routes>
      </div>
    </>
  );
}
