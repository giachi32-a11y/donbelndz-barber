import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

const THEME = {
  gold: '#D4AF37',
  goldGradient: 'linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%)',
  glass: 'rgba(255, 255, 255, 0.03)',
  bg: '#000000',
  radius: '16px'
};

// NUOVO URL AGGIORNATO
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxL1ZKJGJJPGwrYaOPDQ5CHGwmoFqb_H9zbydEZvGVPmlaTacWoaKXhlOxrVhlF7BMevg/exec";

const styles = {
  container: { minHeight: '100vh', backgroundColor: THEME.bg, color: '#fff', fontFamily: '-apple-system, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', overflowX: 'hidden', boxSizing: 'border-box', paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'calc(env(safe-area-inset-bottom) + 20px)', paddingLeft: '20px', paddingRight: '20px', width: '100%' },
  homeContent: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, width: '100%', paddingBottom: '40px' },
  header: { textAlign: 'center', marginBottom: '30px' },
  brandTitle: { fontSize: '3.5rem', fontWeight: '800', margin: '0', letterSpacing: '-2px', color: THEME.gold },
  subtitle: { color: '#ffffff', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '4px', fontWeight: '600', marginTop: '5px', opacity: 0.7 },
  installButton: { background: 'transparent', color: THEME.gold, border: `1px solid ${THEME.gold}`, padding: '10px 24px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '700', marginBottom: '15px', cursor: 'pointer' },
  mainButton: { background: THEME.goldGradient, color: '#000', border: 'none', padding: '16px 40px', borderRadius: '14px', fontSize: '1rem', fontWeight: '700', width: '100%', maxWidth: '280px', cursor: 'pointer', textAlign: 'center', boxShadow: '0 8px 16px rgba(212, 175, 55, 0.15)' },
  infoCard: { padding: '22px', background: THEME.glass, borderRadius: THEME.radius, width: '100%', maxWidth: '350px', border: '1px solid rgba(255,255,255,0.05)', marginTop: '20px', textAlign: 'left', boxSizing: 'border-box' },
  contactBtn: { background: THEME.goldGradient, color: '#000', border: 'none', padding: '10px 15px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: '700', marginTop: '12px', cursor: 'pointer', display: 'inline-block', textDecoration: 'none' },
  serviceCard: { padding: '14px 18px', background: THEME.glass, borderRadius: '12px', width: '100%', maxWidth: '380px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', boxSizing: 'border-box' },
  dateInput: { padding: '18px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)', background: THEME.glass, color: '#fff', fontSize: '1.1rem', width: '100%', maxWidth: '300px', textAlign: 'center', outline: 'none', marginTop: '20px' },
  inputField: { padding: '18px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)', background: THEME.glass, color: '#fff', fontSize: '1rem', width: '100%', maxWidth: '300px', marginTop: '15px', outline: 'none', boxSizing: 'border-box' },
  calendarLink: { display: 'inline-block', marginTop: '20px', padding: '12px 24px', backgroundColor: '#4285F4', color: 'white', borderRadius: '10px', textDecoration: 'none', fontWeight: '700', fontSize: '0.9rem' }
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
  const [isPast, setIsPast] = useState(false);
  const [occupati, setOccupati] = useState([]);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    setShowInstall(!isStandalone);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const todayStr = new Date().toISOString().split('T')[0];

  const isFestivo = (data) => {
    const festivi = ["-01-01", "-01-06", "-04-25", "-05-01", "-06-02", "-08-15", "-11-01", "-12-08", "-12-25", "-12-26", "2026-04-06"];
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
    if (!nome || !telefono) return alert("Per favore, inserisci nome e telefono.");
    const cleanTel = telefono.replace(/\s+/g, ''); 
    const isPhoneValid = /^[3][0-9]{9}$/.test(cleanTel); 
    const isTooSimple = /^(.)\1+$/.test(cleanTel); 
    if (!isPhoneValid || isTooSimple) return alert("Numero di telefono non valido.");

    setLoading(true);
    try {
      await fetch(SCRIPT_URL, { method: 'POST', mode: 'no-cors', body: JSON.stringify({ nome, telefono: cleanTel, servizio: localStorage.getItem('serv'), data: dataSel, ora: oraSel }) });
      navigate('/conferma-finale');
    } catch (e) { alert("Errore nell'invio. Riprova."); }
    finally { setLoading(false); }
  };

  const getGoogleCalendarLink = () => {
    const serv = localStorage.getItem('serv') || "Barbiere";
    const dateClean = dataSel.replace(/-/g, "");
    const timeClean = oraSel.replace(/:/g, "");
    const start = `${dateClean}T${timeClean}00`;
    // Imposta fine a +30 minuti approssimativi per il link
    const end = `${dateClean}T${timeClean.slice(0,2)}5900`;
    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent("✂️ Appuntamento: " + serv)}&dates=${start}/${end}&details=${encodeURIComponent("Promemoria prenotazione da Don Blendz Barbershop")}&sf=true&output=xml`;
  };

  const getTimes = () => {
    if (!dataSel || chiuso || isPast) return [];
    if (dataSel.endsWith("-12-31")) return ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00"];
    const d = new Date(dataSel).getDay();
    if (d === 6) return ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"];
    return ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00"];
  };

  const servizi = [{n: "Combo Taglio + Barba Deluxe", p: "25,00 €"}, {n: "Taglio uomo", p: "17,00 €"}, {n: "Taglio senior", p: "15,00 €"}, {n: "Taglio ragazzo", p: "15,00 €"}, {n: "Taglio bambino", p: "12,00 €"}, {n: "Combo Taglio + Barba", p: "20,00 €"}, {n: "Barba deluxe", p: "10,00 €"}];

  return (
    <div style={styles.container}>
      <Routes>
        <Route path="/" element={
          <div style={styles.homeContent}>
            <div style={styles.header}><h1 style={styles.brandTitle}>DonBlendz</h1><p style={styles.subtitle}>BarberShop - APP</p></div>
            {showInstall && <button onClick={handleInstallClick} style={styles.installButton}>📲 INSTALLA APP SU HOME</button>}
            <button onClick={() => navigate('/servizi')} style={styles.mainButton}>PRENOTA ORA</button>
            <div style={styles.infoCard}>
              <h3 style={{color: THEME.gold, fontSize: '0.8rem', letterSpacing: '2px', marginBottom: '10px'}}>ORARI</h3>
              <p style={{fontSize: '0.9rem', lineHeight: '1.6', margin: 0, color: '#ccc'}}>
                <span style={{color: '#fff'}}>Mar - Ven:</span> 09:00 - 12:30 / 14:00 - 19:30<br/>
                <span style={{color: '#fff'}}>Sabato:</span> 09:00 - 17:30 (Continuato)<br/>
                <span style={{color: '#fff'}}>Dom - Lun:</span> Chiuso
              </p>
            </div>
            <div style={styles.infoCard}>
              <h3 style={{color: THEME.gold, fontSize: '0.8rem', letterSpacing: '2px', marginBottom: '10px'}}>LOCATION</h3>
              <p style={{fontSize: '0.9rem', color: '#ccc', margin: 0}}>📍 via della colombina N^2, Campi Bisenzio (FI)</p>
            </div>
            <div style={styles.infoCard}>
              <h3 style={{color: THEME.gold, fontSize: '0.8rem', letterSpacing: '2px', marginBottom: '10px'}}>CONTATTI</h3>
              <p style={{fontSize: '0.85rem', color: '#ccc', margin: 0, lineHeight: '1.4'}}>Per informazioni o disdire un appuntamento clicca qua:</p>
              <button onClick={() => window.open(`https://wa.me/393447875378?text=${encodeURIComponent("Ciao Danilo, avrei bisogno di un'informazione o disdire un appuntamento.")}`)} style={styles.contactBtn}>SCRIVI SU WHATSAPP</button>
            </div>
          </div>
        } />

        <Route path="/servizi" element={
          <div style={{width: '100%', maxWidth: '400px', paddingTop: '20px'}}>
            <button onClick={() => navigate('/')} style={{background:'none', border:'none', color:THEME.gold, marginBottom:'10px'}}>← Home</button>
            <h2 style={{textAlign:'center', fontWeight:'700'}}>Scegli Servizio</h2>
            {servizi.map(s => (
              <div key={s.n} onClick={() => { localStorage.setItem('serv', s.n); navigate('/prenota'); }} style={styles.serviceCard}>
                <span style={{fontWeight: '600'}}>{s.n}</span><span style={{color: THEME.gold, fontWeight: '800'}}>{s.p}</span>
              </div>
            ))}
          </div>
        } />

        <Route path="/prenota" element={
          <div style={{width: '100%', maxWidth: '360px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '20px'}}>
            <button onClick={() => navigate('/servizi')} style={{background:'none', border:'none', color:THEME.gold, alignSelf: 'flex-start'}}>← Servizi</button>
            <h2 style={{fontSize:'1.6rem', marginBottom:'20px'}}>Scegli data e ora</h2>
            <input type="date" min={todayStr} onChange={(e) => handleDateChange(e.target.value)} style={styles.dateInput} />
            {loading && <p style={{color: THEME.gold, marginTop: '10px'}}>Controllo agenda...</p>}
            {isPast && <div style={{color:'#FF453A', marginTop:'20px', fontWeight:'700'}}>Non puoi prenotare nel passato.</div>}
            {dataSel && chiuso && !isPast && <div style={{color:'#FF453A', marginTop:'20px', fontWeight:'700'}}>Siamo chiusi. Scegli un altro giorno.</div>}
            {dataSel && !chiuso && !loading && !isPast && (
              <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'10px', width:'100%', marginTop:'30px'}}>
                {getTimes().map(t => {
                  const isBusy = occupati.includes(t);
                  return (
                    <button key={t} disabled={isBusy} onClick={() => setOraSel(t)} style={{padding:'14px 0', borderRadius:'12px', border: oraSel === t ? `1px solid ${THEME.gold}` : '1px solid #222', background: isBusy ? '#111' : (oraSel === t ? THEME.goldGradient : 'rgba(255,255,255,0.05)'), color: isBusy ? '#444' : (oraSel === t ? '#000' : '#fff'), fontWeight:'700', textDecoration: isBusy ? 'line-through' : 'none'}}>{isBusy ? "Pieno" : t}</button>
                  );
                })}
              </div>
            )}
            {oraSel && <button onClick={() => navigate('/dati-cliente')} style={{...styles.mainButton, marginTop:'40px', width:'100%'}}>CONTINUA</button>}
          </div>
        } />

        <Route path="/dati-cliente" element={
          <div style={{width: '100%', maxWidth: '360px', textAlign: 'center', paddingTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <button onClick={() => navigate('/prenota')} style={{background:'none', border:'none', color:THEME.gold, alignSelf: 'flex-start'}}>← Indietro</button>
            <h2 style={{fontSize:'1.6rem'}}>I tuoi dati</h2>
            <input type="text" placeholder="Nome e Cognome" value={nome} onChange={(e) => setNome(e.target.value)} style={styles.inputField} />
            <input type="tel" placeholder="Cellulare" value={telefono} onChange={(e) => setTelefono(e.target.value)} style={styles.inputField} />
            <button disabled={loading} onClick={inviaPrenotazione} style={{...styles.mainButton, marginTop:'40px', width:'100%', opacity: loading ? 0.5 : 1}}>{loading ? "INVIO..." : "CONFERMA PRENOTAZIONE"}</button>
          </div>
        } />

        <Route path="/conferma-finale" element={
          <div style={{textAlign:'center', paddingTop:'80px', display:'flex', flexDirection:'column', alignItems:'center'}}>
            <div style={{fontSize:'60px'}}>✅</div>
            <h2 style={{color: THEME.gold, fontSize:'2rem'}}>CONFERMATO!</h2>
            <p>Ciao {nome}, ci vediamo il {dataSel} alle {oraSel}!</p>
            
            {/* TASTO AGGIUNGI AL CALENDARIO */}
            <a href={getGoogleCalendarLink()} target="_blank" rel="noopener noreferrer" style={styles.calendarLink}>
              AGGIUNGI PROMEMORIA AL MIO CALENDARIO 🗓️
            </a>

            <button onClick={() => { setNome(''); setOraSel(''); navigate('/'); }} style={{...styles.mainButton, marginTop:'40px'}}>TORNA ALLA HOME</button>
          </div>
        } />
      </Routes>
    </div>
  );
}
