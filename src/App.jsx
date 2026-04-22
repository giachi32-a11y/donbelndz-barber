import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

const THEME = {
  gold: '#D4AF37',
  goldGradient: 'linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%)',
  glass: 'rgba(255, 255, 255, 0.03)',
  bg: '#000000',
  radius: '16px'
};

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwEQjvndJRiDY9uOoD1VHSahrDL99_npKMrOkRSdOgivbfNKt1PEuLeUbzM5TyFHh6Oqg/exec";

const styles = {
  splash: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: '#000', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', zIndex: 9999, transition: 'opacity 0.8s ease' },
  splashImage: { width: '160px', height: '160px', marginBottom: '20px', animation: 'fadeInScale 1.5s ease', borderRadius: '25px', objectFit: 'contain' },
  loadingText: { color: '#fff', fontSize: '0.7rem', letterSpacing: '5px', marginTop: '10px', opacity: 0.5, animation: 'pulse 2s infinite' },
  container: { minHeight: '100vh', backgroundColor: THEME.bg, color: '#fff', fontFamily: '-apple-system, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', overflowX: 'hidden', boxSizing: 'border-box', paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'calc(env(safe-area-inset-bottom) + 20px)', paddingLeft: '20px', paddingRight: '20px', width: '100%', position: 'relative' },
  staffAccessBtn: { position: 'absolute', top: '15px', right: '15px', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.1)', padding: '5px 10px', borderRadius: '8px', fontSize: '0.65rem', fontWeight: 'bold', cursor: 'pointer', zIndex: 10 },
  homeContent: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, width: '100%', paddingBottom: '40px' },
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
  apptCard: { padding: '15px', background: THEME.glass, borderRadius: '12px', width: '100%', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '10px', textAlign: 'left' },
  // NUOVO STILE BANNER FERIE
  ferieBanner: { position: 'fixed', top: '20px', left: '20px', right: '20px', background: THEME.goldGradient, color: '#000', padding: '15px 20px', borderRadius: '12px', zIndex: 100, boxShadow: '0 10px 30px rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', animation: 'fadeInScale 0.5s ease' }
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

  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPass, setAdminPass] = useState('');
  const [allEvents, setAllEvents] = useState([]);
  const [waitingList, setWaitingList] = useState([]);
  const [viewStaff, setViewStaff] = useState('agenda');

  // --- STATI FERIE ---
  const [ferieList, setFerieList] = useState([]);
  const [showFerieBanner, setShowFerieBanner] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2800);
    caricaFerie(); // Carica le ferie all'avvio
    return () => clearTimeout(timer);
  }, []);

  const caricaFerie = async () => {
    try {
      const resp = await fetch(`${SCRIPT_URL}?action=getFerie`);
      const list = await resp.json();
      setFerieList(list);
      if (list.length > 0) setShowFerieBanner(true);
    } catch (e) { console.error("Errore ferie"); }
  };

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    setShowInstall(!isStandalone);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const todayStr = new Date().toISOString().split('T')[0];

  const isFestivo = (data) => {
    const festivi = ["-01-01", "-01-06", "-04-25", "-06-02", "-08-15", "-11-01", "-12-08", "-12-25", "-12-26", "2026-04-06"];
    const monthDay = data.substring(4); 
    return festivi.includes(monthDay) || festivi.includes(data) || ferieList.includes(data);
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
      await fetch(SCRIPT_URL, { method: 'POST', mode: 'no-cors', body: JSON.stringify({ nome, email, telefono: cleanTel, servizio: localStorage.getItem('serv'), data: dataSel, ora: oraSel }) });
      navigate('/conferma-finale');
    } catch (e) { alert("Errore nell'invio. Riprova."); } finally { setLoading(false); }
  };

  const inviaListaAttesa = async () => {
    if (!nome || !telefono || !email) return alert("Per favore, inserisci nome, email e telefono.");
    setLoading(true);
    try {
      await fetch(SCRIPT_URL, { method: 'POST', mode: 'no-cors', body: JSON.stringify({ action: 'addToWaitingList', nome, email, tel: telefono.replace(/\s+/g, ''), dataScelta: dataSel + " (" + fasciaOraria + ")" }) });
      alert("Iscritto alla lista!"); navigate('/');
    } catch (e) { alert("Errore"); } finally { setLoading(false); }
  };

  const cercaAppuntamenti = async () => {
    if (!telRicerca) return alert("Inserisci il numero.");
    setLoading(true);
    try {
      const resp = await fetch(`${SCRIPT_URL}?action=getUserEvents&tel=${encodeURIComponent(telRicerca.replace(/\s+/g, ''))}`);
      setMieiAppuntamenti(await resp.json());
    } catch (e) { alert("Errore"); } finally { setLoading(false); }
  };

  const richiediCodiceDisdetta = async (appt) => {
    setLoading(true); setAppuntamentoDaCancellare(appt);
    try {
      await fetch(SCRIPT_URL, { method: 'POST', mode: 'no-cors', body: JSON.stringify({ action: 'sendOTP', tel: telRicerca.replace(/\s+/g, '') }) });
      alert("Codice inviato via email."); setStepDisdetta('codice');
    } catch (e) { alert("Errore"); } finally { setLoading(false); }
  };

  const confermaDisdetta = async () => {
    setLoading(true);
    try {
      await fetch(SCRIPT_URL, { method: 'POST', mode: 'no-cors', body: JSON.stringify({ action: 'deleteEventSecure', eventId: appuntamentoDaCancellare.id, otp: codiceInserito, tel: telRicerca.replace(/\s+/g, '') }) });
      alert("Richiesta inviata."); setStepDisdetta('ricerca'); caricaDatiStaff();
    } catch (e) { alert("Errore"); } finally { setLoading(false); }
  };

  const handleAdminLogin = async () => {
    setLoading(true);
    try {
      const resp = await fetch(`${SCRIPT_URL}?action=adminLogin&pass=${adminPass}`);
      const res = await resp.json();
      if (res.success) { setIsAdmin(true); caricaDatiStaff(); } else { alert("Errata"); }
    } catch (e) { alert("Errore"); } finally { setLoading(false); }
  };

  const caricaDatiStaff = async () => {
    setLoading(true);
    try {
      const [evResp, waitResp] = await Promise.all([
        fetch(`${SCRIPT_URL}?action=getAllEvents&pass=${adminPass}`),
        fetch(`${SCRIPT_URL}?action=getWaitingList&pass=${adminPass}`)
      ]);
      setAllEvents(await evResp.json());
      setWaitingList(await waitResp.json());
    } catch (e) { } finally { setLoading(false); }
  };

  const salvaFerie = async (nuoveFerie) => {
    setLoading(true);
    try {
      await fetch(SCRIPT_URL, { method: 'POST', mode: 'no-cors', body: JSON.stringify({ action: 'setFeria', dates: nuoveFerie }) });
      setFerieList(nuoveFerie);
      alert("Ferie aggiornate!");
    } catch (e) { alert("Errore salvataggio"); } finally { setLoading(false); }
  };

  const blockSlot = async (data, ora) => {
    if (!window.confirm(`Bloccare?`)) return;
    setLoading(true);
    try {
      await fetch(SCRIPT_URL, { method: 'POST', mode: 'no-cors', body: JSON.stringify({ action: 'blockSlot', data, ora }) });
      caricaDatiStaff();
    } catch (e) { } finally { setLoading(false); }
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
    <>
      <style>{`@keyframes fadeInScale {0% {opacity:0; transform:scale(0.8);} 100% {opacity:1; transform:scale(1);}} @keyframes pulse {0% {transform:scale(1); opacity:0.8;} 50% {transform:scale(1.05); opacity:1;} 100% {transform:scale(1); opacity:0.8;}}`}</style>

      {showSplash && (
        <div style={styles.splash}>
          <img src="https://raw.githubusercontent.com/giachi32-a11y/donbelndz-barber/main/logo512.png" alt="Logo" style={styles.splashImage} />
          <div style={styles.loadingText}>V 2.2</div>
        </div>
      )}

      {/* BANNER FERIE IN HOME */}
      {showFerieBanner && location.pathname === '/' && !showSplash && (
        <div style={styles.ferieBanner}>
          <div style={{fontSize: '0.85rem', fontWeight: 'bold'}}>✨ AVVISO: Saremo chiusi per ferie in alcune date. Controlla il calendario!</div>
          <button onClick={() => setShowFerieBanner(false)} style={{background: 'none', border: 'none', fontSize: '1.2rem', fontWeight: 'bold', marginLeft: '10px', cursor: 'pointer'}}>×</button>
        </div>
      )}

      <div style={{...styles.container, opacity: showSplash ? 0 : 1, transition: 'opacity 1s ease'}}>
        {location.pathname === '/' && (
          <button onClick={() => navigate('/staff-access')} style={styles.staffAccessBtn}>STAFF</button>
        )}

        <Routes>
          <Route path="/" element={
            <div style={styles.homeContent}>
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
                <a href="https://wa.me/393447875378" target="_blank" style={{...styles.contactBtn, marginTop: '15px', width: '100%', textAlign: 'center'}}>CONTATTA SU WHATSAPP 💬</a>
              </div>
            </div>
          } />

          <Route path="/staff-access" element={
            <div style={{width: '100%', maxWidth: '360px', textAlign: 'center', paddingTop: '40px'}}>
              <button onClick={() => navigate('/')} style={{background:'none', border:'none', color:THEME.gold, marginBottom: '20px'}}>← Home</button>
              <h2 style={{color: THEME.gold}}>Area Staff</h2>
              {!isAdmin ? (
                <div style={styles.infoCard}>
                  <input type="password" placeholder="Password Admin" value={adminPass} onChange={(e) => setAdminPass(e.target.value)} style={styles.inputField} />
                  <button onClick={handleAdminLogin} style={{...styles.mainButton, marginTop: '20px', width: '100%'}}>{loading ? "ACCESSO..." : "ACCEDI"}</button>
                </div>
              ) : (
                <div>
                  <div style={{display: 'flex', gap: '5px', marginBottom: '20px'}}>
                    <button onClick={() => setViewStaff('agenda')} style={{...styles.secButton, flex: 1, fontSize: '0.7rem', padding: '10px', borderColor: viewStaff === 'agenda' ? THEME.gold : 'rgba(255,255,255,0.2)', marginTop: 0}}>AGENDA</button>
                    <button onClick={() => setViewStaff('attesa')} style={{...styles.secButton, flex: 1, fontSize: '0.7rem', padding: '10px', borderColor: viewStaff === 'attesa' ? THEME.gold : 'rgba(255,255,255,0.2)', marginTop: 0}}>ATTESA</button>
                    <button onClick={() => setViewStaff('ferie')} style={{...styles.secButton, flex: 1, fontSize: '0.7rem', padding: '10px', borderColor: viewStaff === 'ferie' ? THEME.gold : 'rgba(255,255,255,0.2)', marginTop: 0}}>FERIE</button>
                  </div>
                  {viewStaff === 'agenda' && (
                    <div>{allEvents.slice().reverse().map((ev, i) => (
                      <div key={i} style={styles.apptCard}>
                        <div style={{fontWeight: 'bold', color: THEME.gold}}>{ev.title}</div>
                        <div style={{fontSize: '0.8rem'}}>📅 {new Date(ev.start).toLocaleString('it-IT')}</div>
                        <div style={{display: 'flex', gap: '20px', marginTop: '10px'}}><a href={`tel:${ev.tel}`}>📞</a> <a href={`https://wa.me/${ev.tel.replace(/\+/g,'')}`}>💬</a></div>
                      </div>
                    ))}</div>
                  )}
                  {viewStaff === 'attesa' && (
                    <div>{waitingList.map((w, i) => (
                      <div key={i} style={styles.apptCard}>
                        <div style={{fontWeight: 'bold'}}>{w.nome}</div>
                        <div style={{fontSize: '0.8rem'}}>Richiesta: {w.info}</div>
                        <a href={`tel:${w.tel}`} style={{fontSize: '0.7rem', color: THEME.gold}}>CHIAMA</a>
                      </div>
                    ))}</div>
                  )}
                  {viewStaff === 'ferie' && (
                    <div style={styles.infoCard}>
                      <p style={{fontSize: '0.8rem'}}>Aggiungi data di chiusura:</p>
                      <input type="date" style={styles.inputField} onChange={(e) => {
                        if(e.target.value && !ferieList.includes(e.target.value)) salvaFerie([...ferieList, e.target.value]);
                      }} />
                      <div style={{marginTop: '20px'}}>
                        {ferieList.map(f => (
                          <div key={f} style={{display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'rgba(255,255,255,0.05)', marginBottom: '5px', borderRadius: '8px'}}>
                            <span>{f}</span>
                            <button onClick={() => salvaFerie(ferieList.filter(d => d !== f))} style={{color: 'red', border: 'none', background: 'none'}}>Rimuovi</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <button onClick={() => {setIsAdmin(false); setAdminPass('');}} style={{...styles.secButton, border: 'none', fontSize: '0.7rem'}}>LOGOUT</button>
                </div>
              )}
            </div>
          } />

          <Route path="/servizi" element={
            <div style={{width: '100%', maxWidth: '400px', paddingTop: '20px'}}>
              <button onClick={() => navigate('/')} style={{background:'none', border:'none', color:THEME.gold, marginBottom:'10px'}}>← Home</button>
              <h2 style={{textAlign:'center', fontWeight:'700'}}>Scegli Un Servizio</h2>
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
              {isPast && <div style={{color:'#FF453A', marginTop:'20px', fontWeight:'700'}}>Data passata.</div>}
              {dataSel && chiuso && !isPast && <div style={{color:'#FF453A', marginTop:'20px', fontWeight:'700'}}>Chiuso / Ferie. Scegli un altro giorno.</div>}
              {dataSel && !chiuso && !loading && !isPast && (
                <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'10px', width:'100%', marginTop:'30px'}}>
                  {getTimes().map(t => {
                    const isBusy = occupati.includes(t);
                    return <button key={t} disabled={isBusy} onClick={() => setOraSel(t)} style={{width:'100%', padding:'14px 0', borderRadius:'12px', border: oraSel === t ? `1px solid ${THEME.gold}` : '1px solid #222', background: isBusy ? '#111' : (oraSel === t ? THEME.goldGradient : 'rgba(255,255,255,0.05)'), color: isBusy ? '#444' : (oraSel === t ? '#000' : '#fff'), fontWeight:'700'}}>{isBusy ? "Pieno" : t}</button>
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
              <input type="text" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} style={styles.inputField} />
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={styles.inputField} />
              <input type="tel" placeholder="Cellulare" value={telefono} onChange={(e) => setTelefono(e.target.value)} style={styles.inputField} />
              <button disabled={loading} onClick={inviaPrenotazione} style={{...styles.mainButton, marginTop:'40px', width:'100%'}}>{loading ? "INVIO..." : "CONFERMA"}</button>
            </div>
          } />

          <Route path="/miei-appuntamenti" element={<div style={{paddingTop: '40px', textAlign: 'center'}}>
            <button onClick={() => navigate('/')} style={{color: THEME.gold, background: 'none', border: 'none'}}>← Home</button>
            <h2 style={{marginTop: '20px'}}>I miei appuntamenti</h2>
            <input type="tel" placeholder="Tuo cellulare" value={telRicerca} onChange={(e) => setTelRicerca(e.target.value)} style={styles.inputField} />
            <button onClick={cercaAppuntamenti} style={{...styles.mainButton, marginTop: '20px', width: '100%'}}>CERCA</button>
            {mieiAppuntamenti.map(a => <div key={a.id} style={styles.apptCard}>{a.title} - {new Date(a.start).toLocaleString()}</div>)}
          </div>} />

          <Route path="/conferma-finale" element={
            <div style={{textAlign:'center', paddingTop:'80px'}}>
              <div style={{fontSize:'60px'}}>✅</div>
              <h2 style={{color: THEME.gold}}>CONFERMATO!</h2>
              <button onClick={() => navigate('/')} style={{...styles.mainButton, marginTop:'40px'}}>HOME</button>
            </div>
          } />
        </Routes>
      </div>
    </>
  );
}
