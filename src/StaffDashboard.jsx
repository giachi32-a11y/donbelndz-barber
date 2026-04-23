import React, { useState, useEffect } from 'react';

const THEME = {
  gold: '#D4AF37',
  goldGradient: 'linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%)',
  glass: 'rgba(255, 255, 255, 0.05)',
  radius: '12px',
  bg: '#000000'
};

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxK1XPaJ3luIMIUaheaDwABxVypF15m-WzKI0DWczc7gEZVRuwkTEk2s4aNtaoIsoy5mw/exec";

export default function StaffDashboard({ onBack }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [pass, setPass] = useState('');
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState('agenda');
  const [data, setData] = useState({ agenda: [], attesa: [], ferie: [] });
  
  // Stato per il form ferie orarie
  const [feriaForm, setFeriaForm] = useState({ data: '', inizio: '09:00', fine: '20:00' });

  const handleLogin = async () => {
    setLoading(true);
    try {
      const resp = await fetch(`${SCRIPT_URL}?action=adminLogin&password=${pass}`);
      const res = await resp.json();
      if (res.success) {
        setIsAdmin(true);
        caricaTuttiIDati();
      } else { alert("Password errata!"); }
    } catch (e) { alert("Errore di connessione."); }
    setLoading(false);
  };

  const caricaTuttiIDati = async () => {
    setLoading(true);
    try {
      const [ag, at] = await Promise.all([
        fetch(`${SCRIPT_URL}?action=getAllEvents`).then(r => r.json()),
        fetch(`${SCRIPT_URL}?action=getWaitingList`).then(r => r.json())
      ]);
      setData({ agenda: ag, attesa: at, ferie: [] }); 
    } catch (e) { console.error("Errore caricamento"); }
    setLoading(false);
  };

  // Segna come contattato
  const segnaContattato = async (w) => {
    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({ action: 'markAsContacted', rowId: w.rowId })
      });
      // Aggiorno lo stato locale per feedback immediato
      const nuovaAttesa = data.attesa.map(item => 
        item.rowId === w.rowId ? {...item, stato: 'CONTATTATO'} : item
      );
      setData({...data, attesa: nuovaAttesa});
    } catch (e) { console.error(e); }
  };

  // Rimuovi dalla lista d'attesa
  const rimuoviDaAttesa = async (rowId) => {
    if(!window.confirm("Rimuovere questo cliente dalla lista?")) return;
    setLoading(true);
    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({ action: 'removeFromWaitingList', rowId: rowId })
      });
      caricaTuttiIDati();
    } catch (e) { alert("Errore"); }
    setLoading(false);
  };

  // Cancella appuntamento da Agenda
  const cancellaAppuntamento = async (eventId) => {
    if(!window.confirm("Vuoi davvero eliminare questo appuntamento dal calendario?")) return;
    setLoading(true);
    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({ action: 'deleteEventAdmin', eventId: eventId })
      });
      alert("Eliminato con successo");
      caricaTuttiIDati();
    } catch (e) { alert("Errore"); }
    setLoading(false);
  };

  // Imposta Chiusura/Feria
  const salvaFeria = async () => {
    if(!feriaForm.data) return alert("Seleziona una data");
    setLoading(true);
    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({ 
          action: 'setFeria', 
          data: feriaForm.data, 
          oraInizio: feriaForm.inizio, 
          oraFine: feriaForm.fine 
        })
      });
      alert("Blocco inserito in calendario!");
    } catch (e) { alert("Errore"); }
    setLoading(false);
  };

  if (!isAdmin) {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center', backgroundColor: THEME.bg, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <button onClick={onBack} style={{ color: THEME.gold, background: 'none', border: 'none', cursor: 'pointer' }}>← Torna all'App</button>
        <h2 style={{ color: THEME.gold, marginTop: '30px' }}>STAFF LOGIN</h2>
        <input 
          type="password" 
          placeholder="Password" 
          value={pass} 
          onChange={(e) => setPass(e.target.value)}
          style={{ width: '100%', maxWidth: '300px', padding: '15px', borderRadius: '10px', border: '1px solid #333', background: '#111', color: '#fff', marginTop: '20px' }}
        />
        <button onClick={handleLogin} style={{ width: '100%', maxWidth: '300px', padding: '15px', background: THEME.goldGradient, border: 'none', borderRadius: '10px', marginTop: '20px', fontWeight: 'bold' }}>
          {loading ? "ACCESSO..." : "ACCEDI"}
        </button>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto', padding: '20px', color: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
        <button onClick={onBack} style={{ color: THEME.gold, background: 'none', border: 'none' }}>ESCI</button>
        <h3 style={{ color: THEME.gold }}>Admin Danilo</h3>
        <button onClick={caricaTuttiIDati} style={{ background: '#222', border: 'none', color: '#fff', padding: '8px 12px', borderRadius: '8px' }}>↻</button>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
        {['agenda', 'attesa', 'ferie'].map((m) => (
          <button key={m} onClick={() => setView(m)} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', fontWeight: 'bold', background: view === m ? THEME.goldGradient : '#1a1a1a', color: view === m ? '#000' : '#fff' }}>{m.toUpperCase()}</button>
        ))}
      </div>

      {loading ? <p style={{ textAlign: 'center', color: THEME.gold }}>Caricamento...</p> : (
        <div>
          {/* AGENDA */}
          {view === 'agenda' && data.agenda.map((ev, i) => (
            <div key={i} style={{ background: THEME.glass, padding: '15px', borderRadius: THEME.radius, marginBottom: '12px', borderLeft: `4px solid ${THEME.gold}` }}>
              <div style={{ fontWeight: 'bold' }}>{ev.title}</div>
              <div style={{ color: THEME.gold, fontSize: '0.85rem' }}>📅 {new Date(ev.start).toLocaleString('it-IT', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <a href={`tel:${ev.desc?.match(/Tel: (.*)/)?.[1]}`} style={{ flex: 1, background: '#333', color: '#fff', textAlign: 'center', padding: '8px', borderRadius: '6px', textDecoration: 'none', fontSize: '0.8rem' }}>Chiama</a>
                <button onClick={() => cancellaAppuntamento(ev.id)} style={{ flex: 1, background: '#441111', color: '#ff4444', border: 'none', borderRadius: '6px' }}>Elimina</button>
              </div>
            </div>
          ))}

          {/* LISTA ATTESA */}
          {view === 'attesa' && data.attesa.map((w, i) => (
            <div key={i} style={{ 
                background: w.stato === 'CONTATTATO' ? 'rgba(212, 175, 55, 0.1)' : THEME.glass, 
                padding: '15px', borderRadius: THEME.radius, marginBottom: '12px', 
                border: w.stato === 'CONTATTATO' ? `1px solid ${THEME.gold}` : '1px solid #333' 
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 'bold' }}>{w.nome}</span>
                {w.stato === 'CONTATTATO' && <span style={{ color: THEME.gold, fontSize: '0.7rem', fontWeight: 'bold' }}>● GIÀ CONTATTATO</span>}
              </div>
              <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>Giorno: {w.giorno}</div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                <a 
                  href={`https://wa.me/${w.tel.replace(/\D/g,'')}?text=Ciao ${w.nome}, sono Danilo di DonBlendz...`} 
                  onClick={() => segnaContattato(w)}
                  style={{ flex: 1, background: '#25D366', color: '#fff', textAlign: 'center', padding: '8px', borderRadius: '6px', textDecoration: 'none', fontSize: '0.8rem' }}
                >
                  💬 WhatsApp
                </a>
                <button onClick={() => rimuoviDaAttesa(w.rowId)} style={{ flex: 1, background: '#333', color: '#fff', border: 'none', borderRadius: '6px' }}>Rimuovi</button>
              </div>
            </div>
          ))}

          {/* FERIE / CHIUSURE */}
          {view === 'ferie' && (
            <div style={{ background: THEME.glass, padding: '20px', borderRadius: THEME.radius }}>
              <h4 style={{ color: THEME.gold, marginTop: 0 }}>Blocca Orario o Giorno</h4>
              <label style={{ fontSize: '0.8rem', display: 'block', marginBottom: '5px' }}>Data</label>
              <input type="date" value={feriaForm.data} onChange={e => setFeriaForm({...feriaForm, data: e.target.value})} style={{ width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #333', background: '#111', color: '#fff' }} />
              
              <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.8rem' }}>Dalle ore:</label>
                  <input type="time" value={feriaForm.inizio} onChange={e => setFeriaForm({...feriaForm, inizio: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #333', background: '#111', color: '#fff' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.8rem' }}>Alle ore:</label>
                  <input type="time" value={feriaForm.fine} onChange={e => setFeriaForm({...feriaForm, fine: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #333', background: '#111', color: '#fff' }} />
                </div>
              </div>
              
              <button onClick={salvaFeria} style={{ width: '100%', padding: '15px', background: THEME.goldGradient, color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '10px' }}>BLOCCA CALENDARIO</button>
              <p style={{ fontSize: '0.75rem', opacity: 0.6, marginTop: '10px', textAlign: 'center' }}>Nota: Questo creerà un evento "CHIUSO" su Calendar bloccando gli appuntamenti dei clienti.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
