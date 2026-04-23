import React, { useState, useEffect } from 'react';

const THEME = {
  gold: '#D4AF37',
  goldGradient: 'linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%)',
  glass: 'rgba(255, 255, 255, 0.05)',
  radius: '12px',
  bg: '#000000'
};

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwEQjvndJRiDY9uOoD1VHSahrDL99_npKMrOkRSdOgivbfNKt1PEuLeUbzM5TyFHh6Oqg/exec";

export default function StaffDashboard({ onBack }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [pass, setPass] = useState('');
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState('agenda');
  const [data, setData] = useState({ agenda: [], attesa: [], ferie: [] });

  // Funzione Login
  const handleLogin = async () => {
    setLoading(true);
    try {
      const resp = await fetch(`${SCRIPT_URL}?action=adminLogin&pass=${pass}`);
      const res = await resp.json();
      if (res.success) {
        setIsAdmin(true);
        caricaTuttiIDati();
      } else { alert("Password errata, Danilo!"); }
    } catch (e) { alert("Errore di connessione allo script."); }
    setLoading(false);
  };

  // Caricamento Dati (Agenda, Attesa, Ferie)
  const caricaTuttiIDati = async () => {
    setLoading(true);
    try {
      const [ag, at, fe] = await Promise.all([
        fetch(`${SCRIPT_URL}?action=getAllEvents&pass=${pass}`).then(r => r.json()),
        fetch(`${SCRIPT_URL}?action=getWaitingList&pass=${pass}`).then(r => r.json()),
        fetch(`${SCRIPT_URL}?action=getFerie`).then(r => r.json())
      ]);
      setData({ agenda: ag, attesa: at, ferie: fe });
    } catch (e) { console.error("Errore nel caricamento dati"); }
    setLoading(false);
  };

  // --- NUOVA FUNZIONE: CONFERMA DALLA LISTA ATTESA ---
  const confermaDaAttesa = async (cliente) => {
    if (!window.confirm(`Vuoi confermare l'appuntamento per ${cliente.nome}?`)) return;
    
    setLoading(true);
    try {
      // Nota: lo script dovrà gestire l'azione 'confirmFromWaitingList'
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({ 
          action: 'confirmFromWaitingList', 
          cliente: cliente,
          pass: pass 
        })
      });
      alert("Richiesta inviata! L'appuntamento verrà creato e il cliente rimosso dalla lista.");
      caricaTuttiIDati(); // Ricarica per vedere i cambiamenti
    } catch (e) { alert("Errore nella conferma."); }
    setLoading(false);
  };

  // Aggiungi/Rimuovi Ferie
  const toggleFeria = async (dataScelta) => {
    let nuoveFerie;
    if (data.ferie.includes(dataScelta)) {
      nuveFerie = data.ferie.filter(d => d !== dataScelta);
    } else {
      nuoveFerie = [...data.ferie, dataScelta];
    }
    
    setLoading(true);
    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({ action: 'setFeria', dates: nuoveFerie })
      });
      setData({ ...data, ferie: nuoveFerie });
      alert("Calendario ferie aggiornato!");
    } catch (e) { alert("Errore nel salvataggio"); }
    setLoading(false);
  };

  // Schermata Login
  if (!isAdmin) {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center', backgroundColor: THEME.bg, minHeight: '100vh' }}>
        <button onClick={onBack} style={{ color: THEME.gold, background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem' }}>← Torna all'App</button>
        <h2 style={{ color: THEME.gold, marginTop: '30px', fontSize: '2rem' }}>Staff Login</h2>
        <div style={{ marginTop: '20px' }}>
          <input 
            type="password" 
            placeholder="Inserire la Password" 
            value={pass} 
            onChange={(e) => setPass(e.target.value)}
            style={{ width: '100%', maxWidth: '300px', padding: '15px', borderRadius: '10px', border: '1px solid #333', background: '#111', color: '#fff', fontSize: '1rem', outline: 'none' }}
          />
          <button onClick={handleLogin} style={{ width: '100%', maxWidth: '300px', padding: '15px', background: THEME.goldGradient, border: 'none', borderRadius: '10px', marginTop: '20px', fontWeight: 'bold', cursor: 'pointer', color: '#000' }}>
            {loading ? "ACCESSO IN CORSO..." : "ACCEDI"}
          </button>
        </div>
      </div>
    );
  }

  // Dashboard Principale
  return (
    <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto', padding: '20px', color: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <button onClick={onBack} style={{ color: THEME.gold, background: 'none', border: 'none', fontWeight: 'bold' }}>ESCI</button>
        <h3 style={{ margin: 0, color: THEME.gold }}>Dashboard Danilo</h3>
        <button onClick={caricaTuttiIDati} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '8px' }}>↻</button>
      </div>

      {/* Menu Navigazione */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
        {['agenda', 'attesa', 'ferie'].map((m) => (
          <button 
            key={m} 
            onClick={() => setView(m)}
            style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.7rem', background: view === m ? THEME.goldGradient : '#1a1a1a', color: view === m ? '#000' : '#fff' }}
          >
            {m}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', color: THEME.gold }}>Aggiornamento dati...</p>
      ) : (
        <div style={{ paddingBottom: '50px' }}>
          
          {/* VISTA AGENDA */}
          {view === 'agenda' && (
            data.agenda.length > 0 ? (
              data.agenda.slice().reverse().map((ev, i) => (
                <div key={i} style={{ background: THEME.glass, padding: '15px', borderRadius: THEME.radius, marginBottom: '12px', borderLeft: `4px solid ${THEME.gold}` }}>
                  <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{ev.title}</div>
                  <div style={{ fontSize: '0.85rem', color: THEME.gold, margin: '5px 0' }}>
                    📅 {new Date(ev.start).toLocaleString('it-IT', { weekday: 'long', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Servizio: {ev.service}</div>
                  <div style={{ display: 'flex', gap: '15px', marginTop: '15px' }}>
                    <a href={`tel:${ev.tel}`} style={{ flex: 1, textAlign: 'center', background: '#333', color: '#fff', textDecoration: 'none', padding: '10px', borderRadius: '8px', fontSize: '0.8rem' }}>📞 Chiama</a>
                    <a href={`https://wa.me/${ev.tel.replace(/\D/g,'')}?text=Ciao, sono Danilo di DonBlendz...`} style={{ flex: 1, textAlign: 'center', background: '#25D366', color: '#fff', textDecoration: 'none', padding: '10px', borderRadius: '8px', fontSize: '0.8rem' }}>💬 WhatsApp</a>
                  </div>
                </div>
              ))
            ) : <p style={{ textAlign: 'center', opacity: 0.5 }}>Nessun appuntamento in agenda.</p>
          )}

          {/* VISTA LISTA ATTESA */}
          {view === 'attesa' && (
            data.attesa.length > 0 ? (
              data.attesa.map((w, i) => (
                <div key={i} style={{ background: THEME.glass, padding: '15px', borderRadius: THEME.radius, marginBottom: '12px', border: '1px solid #333' }}>
                  <div style={{ fontWeight: 'bold' }}>{w.nome}</div>
                  <div style={{ fontSize: '0.85rem', color: '#ccc' }}>Desidera: {w.info}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <a href={`tel:${w.tel}`} style={{ flex: 1, textAlign: 'center', background: '#444', color: '#fff', padding: '8px', borderRadius: '6px', textDecoration: 'none', fontSize: '0.75rem' }}>📞 Chiama</a>
                        <a href={`https://wa.me/${w.tel.replace(/\D/g,'')}?text=Ciao ${w.nome}, sono Danilo di DonBlendz. Ti scrivo per il posto in lista d'attesa...`} style={{ flex: 1, textAlign: 'center', background: '#25D366', color: '#fff', padding: '8px', borderRadius: '6px', textDecoration: 'none', fontSize: '0.75rem' }}>💬 WhatsApp</a>
                    </div>
                    {/* TASTO DI CONFERMA FINALE */}
                    <button 
                        onClick={() => confermaDaAttesa(w)}
                        style={{ width: '100%', background: THEME.goldGradient, color: '#000', border: 'none', padding: '10px', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.8rem', cursor: 'pointer' }}
                    >
                        ✅ CONFERMA E PRENOTA
                    </button>
                  </div>
                </div>
              ))
            ) : <p style={{ textAlign: 'center', opacity: 0.5 }}>Lista d'attesa vuota.</p>
          )}

          {/* VISTA FERIE */}
          {view === 'ferie' && (
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '0.9rem', marginBottom: '20px', opacity: 0.8 }}>Seleziona un giorno per chiudere/aprire le prenotazioni:</p>
              <input 
                type="date" 
                style={{ padding: '15px', borderRadius: '10px', border: '1px solid #D4AF37', background: '#111', color: '#fff', width: '100%', marginBottom: '20px' }}
                onChange={(e) => {
                  if(e.target.value) toggleFeria(e.target.value);
                }}
              />
              <h4 style={{ color: THEME.gold, textAlign: 'left', borderBottom: '1px solid #333', paddingBottom: '10px' }}>Giorni di Chiusura:</h4>
              <div style={{ marginTop: '15px' }}>
                {data.ferie.length > 0 ? data.ferie.sort().map(f => (
                  <div key={f} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#111', padding: '12px', borderRadius: '8px', marginBottom: '8px' }}>
                    <span>{new Date(f).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    <button onClick={() => toggleFeria(f)} style={{ color: '#ff4444', background: 'none', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>RIMUOVI</button>
                  </div>
                )) : <p style={{ opacity: 0.5 }}>Nessuna chiusura impostata.</p>}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
