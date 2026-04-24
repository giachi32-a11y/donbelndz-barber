import React, { useState, useEffect } from 'react';

const THEME = {
  gold: '#D4AF37',
  goldGradient: 'linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%)',
  radius: '12px',
  bg: '#000000',
  glass: 'rgba(255, 255, 255, 0.05)'
};

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzXnC-F9U7J-fh6tAFhJa3wQPOAznldkprszDlT_Hckuy33qcKlzwzl83e8MZXkGfzSKA/exec";

export default function StaffDashboard({ onBack }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [pass, setPass] = useState('');
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState('attesa'); 
  const [data, setData] = useState({ attesa: [] });
  
  const [feriaForm, setFeriaForm] = useState({ dataInizio: '', dataFine: '', inizio: '09:00', fine: '20:00' });

  const caricaDati = async () => {
    setLoading(true);
    try {
      const resp = await fetch(`${SCRIPT_URL}?action=getWaitingList`);
      const at = await resp.json();
      setData({ attesa: Array.isArray(at) ? at : [] });
    } catch (e) { console.error("Errore caricamento lista"); }
    setLoading(false);
  };

  const spuntaContattato = async (rowId) => {
    if (!window.confirm("Segnare questo cliente come contattato?")) return;
    setLoading(true);
    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({ action: 'markAsContacted', rowId: rowId })
      });
      // Piccola attesa per permettere allo script di elaborare prima del ricaricamento
      setTimeout(caricaDati, 500);
    } catch (e) { alert("Errore nell'aggiornamento"); }
    setLoading(false);
  };

  const inviaFeria = async () => {
    if(!feriaForm.dataInizio || !feriaForm.dataFine) return alert("Inserisci le date.");
    setLoading(true);
    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({ 
          action: 'setFeria', 
          dataInizio: feriaForm.dataInizio, 
          dataFine: feriaForm.dataFine, 
          oraInizio: feriaForm.inizio, 
          oraFine: feriaForm.fine 
        })
      });
      alert("Blocco calendario inserito con successo!");
      setFeriaForm({ dataInizio: '', dataFine: '', inizio: '09:00', fine: '20:00' });
    } catch (e) { alert("Errore nel salvataggio."); }
    setLoading(false);
  };

  useEffect(() => { if (isAdmin) caricaDati(); }, [isAdmin]);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const resp = await fetch(`${SCRIPT_URL}?action=adminLogin&password=${encodeURIComponent(pass)}`);
      const res = await resp.json();
      if (res.success) setIsAdmin(true);
      else alert("Password errata!");
    } catch (e) { alert("Errore connessione."); }
    setLoading(false);
  };

  const inputStyle = {
    width: '100%',
    padding: '15px',
    marginBottom: '15px',
    borderRadius: '10px',
    border: '1px solid #333',
    background: '#111',
    color: '#fff',
    fontSize: '1rem',
    boxSizing: 'border-box', // Risolve l'allineamento
    display: 'block',
    appearance: 'none',      // Rimuove stili nativi mobile
    WebkitAppearance: 'none', // Rimuove stili Safari/iOS
    minHeight: '50px'
  };

  if (!isAdmin) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', backgroundColor: THEME.bg, height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <button onClick={onBack} style={{ color: THEME.gold, background: 'none', border: 'none', marginBottom: '40px', cursor: 'pointer' }}>← Torna all'App</button>
        <h2 style={{ color: THEME.gold, fontSize: '2rem', marginBottom: '30px' }}>STAFF LOGIN</h2>
        <input type="password" placeholder="Inserire Password" value={pass} onChange={(e) => setPass(e.target.value)} style={{ ...inputStyle, maxWidth: '300px', textAlign: 'center' }} />
        <button onClick={handleLogin} style={{ width: '100%', maxWidth: '300px', padding: '166x', background: THEME.goldGradient, border: 'none', borderRadius: '12px', fontWeight: 'bold', color: '#000', height: '55px' }}>ACCEDI</button>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', minHeight: '100vh', backgroundColor: THEME.bg, color: '#fff', padding: '20px', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '500px', margin: '0 auto 30px' }}>
        <button onClick={onBack} style={{ color: THEME.gold, background: 'none', border: 'none', fontWeight: 'bold' }}>ESCI</button>
        <h3 style={{ color: THEME.gold, margin: 0 }}>Dashboard Danilo</h3>
        <button onClick={caricaDati} style={{ background: '#222', border: 'none', color: '#fff', padding: '10px', borderRadius: '10px' }}>↻</button>
      </div>

      <div style={{ display: 'flex', gap: '10px', maxWidth: '400px', margin: '0 auto 25px' }}>
        <button onClick={() => setView('attesa')} style={{ flex: 1, padding: '14px', borderRadius: '10px', border: 'none', background: view === 'attesa' ? THEME.goldGradient : '#1a1a1a', color: view === 'attesa' ? '#000' : '#fff', fontWeight: 'bold' }}>ATTESA</button>
        <button onClick={() => setView('ferie')} style={{ flex: 1, padding: '14px', borderRadius: '10px', border: 'none', background: view === 'ferie' ? THEME.goldGradient : '#1a1a1a', color: view === 'ferie' ? '#000' : '#fff', fontWeight: 'bold' }}>FERIE</button>
      </div>

      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        {loading ? (
          <p style={{ textAlign: 'center', color: THEME.gold }}>Caricamento...</p>
        ) : view === 'attesa' ? (
          data.attesa.length > 0 ? data.attesa.map((w, i) => (
            <div key={i} style={{ background: THEME.glass, padding: '20px', borderRadius: THEME.radius, marginBottom: '15px', border: '1px solid #333' }}>
              <div style={{ fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '5px' }}>{w.nome}</div>
              <div style={{ color: '#aaa', fontSize: '0.85rem', marginBottom: '5px' }}>📧 {w.email}</div>
              <div style={{ color: THEME.gold, fontSize: '0.9rem', marginBottom: '15px' }}>Richiesta per: {w.giorno}</div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <a href={`https://wa.me/${w.tel?.toString().replace(/\D/g,'')}`} style={{ flex: 1, background: '#25D366', color: '#fff', textAlign: 'center', padding: '12px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>WhatsApp</a>
                <button onClick={() => spuntaContattato(w.rowId)} style={{ flex: 1, background: '#444', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>Fatto ✓</button>
              </div>
            </div>
          )) : <p style={{ textAlign: 'center', opacity: 0.5 }}>Nessun cliente in lista.</p>
        ) : (
          <div style={{ background: THEME.glass, padding: '25px', borderRadius: THEME.radius, border: '1px solid #222' }}>
            <h3 style={{ color: THEME.gold, marginTop: 0, textAlign: 'center' }}>BLOCCA CALENDARIO</h3>
            <label style={{ fontSize: '0.8rem', color: '#888', display: 'block', marginBottom: '5px' }}>Dal giorno:</label>
            <input type="date" value={feriaForm.dataInizio} onChange={e => setFeriaForm({...feriaForm, dataInizio: e.target.value})} style={inputStyle} />
            
            <label style={{ fontSize: '0.8rem', color: '#888', display: 'block', marginBottom: '5px' }}>Al giorno:</label>
            <input type="date" value={feriaForm.dataFine} onChange={e => setFeriaForm({...feriaForm, dataFine: e.target.value})} style={inputStyle} />
            
            <label style={{ fontSize: '0.8rem', color: '#888', display: 'block', marginBottom: '5px' }}>Dalle ore:</label>
            <input type="time" value={feriaForm.inizio} onChange={e => setFeriaForm({...feriaForm, inizio: e.target.value})} style={inputStyle} />
            
            <label style={{ fontSize: '0.8rem', color: '#888', display: 'block', marginBottom: '5px' }}>Alle ore:</label>
            <input type="time" value={feriaForm.fine} onChange={e => setFeriaForm({...feriaForm, fine: e.target.value})} style={inputStyle} />

            <button onClick={inviaFeria} style={{ width: '100%', padding: '16px', background: THEME.goldGradient, color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '10px', fontSize: '1rem', marginTop: '10px' }}>CONFERMA CHIUSURA</button>
          </div>
        )}
      </div>
    </div>
  );
}
