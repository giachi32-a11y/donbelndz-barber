import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

export default function App() {
  const navigate = useNavigate();
  const [serv, setServ] = useState('');

  const listino = [
    {n: "Combo Taglio + Barba Deluxe", p: "25,00 €"},
    {n: "Taglio uomo", p: "17,00 €"},
    {n: "Taglio senior", p: "15,00 €"},
    {n: "Taglio ragazzo", p: "15,00 €"},
    {n: "Taglio bambino", p: "12,00 €"},
    {n: "Combo Taglio + Barba", p: "20,00 €"},
    {n: "Barba deluxe", p: "10,00 €"}
  ];

  const cardStyle = { background: '#111', padding: '15px', borderRadius: '12px', marginBottom: '10px', border: '1px solid #333', display: 'flex', justifyContent: 'space-between', cursor: 'pointer' };

  return (
    <div style={{ background: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif', padding: '20px' }}>
      <Routes>
        <Route path="/" element={
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ color: '#D4AF37', fontSize: '3rem' }}>DonBlendz</h1>
            <button onClick={() => navigate('/servizi')} style={{ background: '#D4AF37', border: 'none', padding: '15px 40px', borderRadius: '10px', fontWeight: 'bold' }}>PRENOTA ORA</button>
            <div style={{ marginTop: '50px', textAlign: 'left', maxWidth: '300px', margin: '50px auto' }}>
              <p style={{ color: '#D4AF37' }}>📍 LOCATION</p>
              <p>via della colombina N^2, Campi Bisenzio</p>
            </div>
          </div>
        } />
        <Route path="/servizi" element={
          <div>
            <button onClick={() => navigate('/')} style={{ color: '#D4AF37', background: 'none', border: 'none', marginBottom: '20px' }}>← Indietro</button>
            {listino.map(s => (
              <div key={s.n} onClick={() => { setServ(s.n); navigate('/final'); }} style={cardStyle}>
                <span>{s.n}</span><span style={{ color: '#D4AF37', fontWeight: 'bold' }}>{s.p}</span>
              </div>
            ))}
          </div>
        } />
        <Route path="/final" element={
          <div style={{ textAlign: 'center', paddingTop: '50px' }}>
            <h3>Hai scelto: {serv}</h3>
            <button onClick={() => window.open(`https://wa.me/393447875378?text=Prenoto ${serv}`)} style={{ background: '#25D366', color: '#fff', border: 'none', padding: '15px', borderRadius: '10px', width: '100%', fontWeight: 'bold' }}>CONFERMA WHATSAPP</button>
          </div>
        } />
      </Routes>
    </div>
  );
}
