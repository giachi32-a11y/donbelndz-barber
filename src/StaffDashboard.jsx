import React, { useState, useEffect } from 'react';

const THEME = {
  gold: '#D4AF37',
  goldGradient: 'linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%)',
  radius: '12px',
  bg: '#000000',
  glass: 'rgba(255, 255, 255, 0.05)'
};

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxK1XPaJ3luIMIUaheaDwABxVypF15m-WzKI0DWczc7gEZVRuwkTEk2s4aNtaoIsoy5mw/exec";

export default function StaffDashboard({ onBack }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [pass, setPass] = useState('');
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState('attesa'); 
  const [data, setData] = useState({ agenda: [], attesa: [] });
  
  const [feriaForm, setFeriaForm] = useState({ 
    dataInizio: '', 
    dataFine: '', 
    inizio: '09:00', 
    fine: '20:00' 
  });

  // Caricamento automatico della lista quando si accede
  useEffect(() => {
    if (isAdmin) caricaTuttiIDati();
  }, [isAdmin]);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const resp = await fetch(`${SCRIPT_URL}?action=adminLogin&password=${encodeURIComponent(pass)}`);
      const res = await resp.json();
      if (res.success) {
        setIsAdmin(true);
      } else { alert("Password errata!"); }
    } catch (e) { alert("Errore di connessione."); }
    setLoading(false);
  };

  const caricaTuttiIDati = async () => {
    setLoading(true);
    try {
      const resp = await fetch(`${SCRIPT_URL}?action=getWaitingList`);
      const at = await resp.json();
      setData({ agenda: [], attesa: Array.isArray(at) ? at : [] });
    } catch (e) { 
      console.error("Errore lista:", e);
    }
    setLoading(false);
  };

  const salvaFeria = async () => {
    if(!feriaForm.dataInizio) return alert("Seleziona data");
    setLoading(true);
    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({ 
          action: 'setFeria', 
          dataInizio: feriaForm.dataInizio,
          dataFine: feriaForm.dataFine || feriaForm.dataInizio,
          oraInizio: feriaForm.inizio, 
          oraFine: feriaForm.fine 
        })
      });
      alert("Blocco ferie inserito!");
      setFeriaForm({ dataInizio: '', dataFine: '', inizio: '09:00', fine: '20:00' });
    } catch (e) { alert("Errore"); }
    setLoading(false);
  };

  // Stile comune per gli input per garantire allineamento perfetto
  const inputStyle = {
    width: '100%',
    padding: '14px',
    borderRadius: '10px',
    border: '1px solid #333',
    background: '#111',
    color: '#fff',
    fontSize: '1rem',
    outline: 'none',
    boxSizing: 'border-box', // Fondamentale per l'allineamento
    display: 'block',
    margin: '0',
    appearance: 'none',
    WebkitAppearance: 'none'
  };

  if (!isAdmin) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', backgroundColor: THEME.bg, height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box' }}>
        <button onClick={onBack} style={{ color: THEME.gold, background: 'none', border: 'none', cursor: 'pointer', marginBottom: '50px' }}>← Torna all'App</button>
        <h2 style={{ color: THEME.gold, fontSize: '2.2rem', fontWeight: 'bold', marginBottom: '30px' }}>STAFF LOGIN</h2>
        <input 
          type="password" 
          placeholder="Password" 
          value={pass} 
          onChange={(e) => setPass(e.target.value)}
          style={{ ...inputStyle, maxWidth: '280px', textAlign: 'center', marginBottom: '20px' }}
        />
        <button onClick={handleLogin} style={{ width: '100%', maxWidth: '280px', padding: '16px', background: THEME.goldGradient, border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', color: '#000' }}>
          {loading ? "ACCESSO..." : "ACCEDI"}
        </button>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', minHeight: '100vh', backgroundColor: THEME.bg, color: '#fff', padding: '20px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: '450px', marginBottom: '30px' }}>
        <button onClick={onBack} style={{ color: THEME.gold, background: 'none', border: 'none', fontWeight: 'bold' }}>ESCI</button>
        <h3 style={{ color: THEME.gold, margin: 0 }}>Admin Danilo</h3>
        <button onClick={caricaTuttiIDati} style={{ background: '#222', border: 'none', color: '#fff', padding: '10px 14px', borderRadius: '10px' }}>↻</button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '10px', width: '100%', maxWidth: '400px', marginBottom: '25px' }}>
        {['attesa', 'ferie'].map((m) => (
          <button key={m} onClick={() => setView(m)} style={{ flex: 1, padding: '14px', borderRadius: '10px', border: 'none', fontWeight: 'bold', background: view === m ? THEME.goldGradient : '#1a1a1a', color: view === m ? '#000' : '#fff' }}>
            {m.toUpperCase()}
          </button>
        ))}
      </div>

      <div style={{ width: '100%', maxWidth: '450px' }}>
        {loading ? (
          <p style={{ textAlign: 'center', color: THEME.gold }}>Caricamento...</p>
        ) : (
          <>
            {view === 'attesa' && (
              data.attesa.length > 0 ? data.attesa.map((w, i) => (
                <div key={i} style={{ background: THEME.glass, padding: '18px', borderRadius: THEME.radius, marginBottom: '12px', border: '1px solid #333' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{w.nome}</div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>{w.giorno}</div>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                    <a href={`https://wa.me/${w.tel?.replace(/\D/g,'')}`} style={{ flex: 2, background: '#25D366', color: '#fff', textAlign: 'center', padding: '10px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>WhatsApp</a>
                  </div>
                </div>
              )) : <p style={{ textAlign: 'center', opacity: 0.5 }}>Lista vuota.</p>
            )}

            {view === 'ferie' && (
              <div style={{ background: THEME.glass, padding: '24px', borderRadius: THEME.radius, border: '1px solid #222', boxSizing: 'border-box', width: '100%' }}>
                <h3 style={{ color: THEME.gold, margin: '0 0 20px 0', textAlign: 'center', fontWeight: 'bold' }}>BLOCCA CALENDARIO</h3>
                
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div>
                    <label style={{ fontSize: '0.85rem', color: '#aaa', display: 'block', marginBottom: '8px' }}>Dal giorno:</label>
                    <input type="date" value={feriaForm.dataInizio} onChange={e => setFeriaForm({...feriaForm, dataInizio: e.target.value})} style={inputStyle} />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.85rem', color: '#aaa', display: 'block', marginBottom: '8px' }}>Al giorno:</label>
                    <input type="date" value={feriaForm.dataFine} onChange={e => setFeriaForm({...feriaForm, dataFine: e.target.value})} style={inputStyle} />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.85rem', color: '#aaa', display: 'block', marginBottom: '8px' }}>Dalle ore:</label>
                    <input type="time" value={feriaForm.inizio} onChange={e => setFeriaForm({...feriaForm, inizio: e.target.value})} style={inputStyle} />
                  </div>

                  <div style={{ marginBottom: '10px' }}>
                    <label style={{ fontSize: '0.85rem', color: '#aaa', display: 'block', marginBottom: '8px' }}>Alle ore:</label>
                    <input type="time" value={feriaForm.fine} onChange={e => setFeriaForm({...feriaForm, fine: e.target.value})} style={inputStyle} />
                  </div>

                  <button onClick={salvaFeria} style={{ width: '100%', padding: '16px', background: THEME.goldGradient, color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '10px', fontSize: '1.1rem', cursor: 'pointer' }}>
                    CONFERMA
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
