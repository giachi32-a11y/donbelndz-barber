import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'

// --- CONFIGURAZIONE NOTIFICHE PUSH (FIREBASE) ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getMessaging, getToken } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging.js";

const firebaseConfig = {
  apiKey: "AIzaSyAM8yiJO5yDPepXEqnizQydCRwSYufx6MI",
  authDomain: "barbiere-pwa.firebaseapp.com",
  projectId: "barbiere-pwa",
  storageBucket: "barbiere-pwa.firebasestorage.app",
  messagingSenderId: "1013459748557",
  appId: "1:1013459748557:web:b577f7bc645162c0454b84"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

async function richiediPermessoNotifiche() {
  // 1. Controlla se abbiamo già chiesto il permesso in passato
  const giaChiesto = localStorage.getItem('notifiche_richieste');
  
  // Se è già stato chiesto una volta, blocca l'esecuzione per non disturbare l'utente
  if (giaChiesto) {
    console.log('Permesso notifiche già richiesto in una sessione precedente.');
    return;
  }

  try {
    // 2. Mostra il pop-up nativo del browser
    const permission = await Notification.requestPermission();
    
    // Salva subito nel localStorage che il tentativo è stato fatto (così non lo chiederà mai più)
    localStorage.setItem('notifiche_richieste', 'true');

    if (permission === 'granted') {
      console.log('Permesso notifiche accordato!');
      
      // Registra il Service Worker
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      
      // Ottiene il token del dispositivo
      const tokenAttuale = await getToken(messaging, { 
        vapidKey: 'BA1OR66k5omw1Fr9yNaGVNfvnAv1m5MZ5V61dbfUTEN-JzgM8CDb0v8TgGgI4bNZ1Tfxq-tkNdteCRkK4lHjzlA',
        serviceWorkerRegistration: registration 
      });
      
      if (tokenAttuale) {
        console.log('Ecco il Token del cliente:', tokenAttuale);
        // Salva il token nel browser per usarlo al momento della prenotazione
        localStorage.setItem('fcm_token', tokenAttuale);
      } else {
        console.log('Nessun token disponibile. Controlla la chiave VAPID.');
      }
    } else {
      console.log('Permesso notifiche negato dal cliente.');
    }
  } catch (errore) {
    console.error('Errore durante la configurazione delle notifiche:', errore);
  }
}

// Componente Wrapper per gestire il delay dello Splash Screen all'avvio
const AppConNotifiche = () => {
  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      // Attende 2.5 secondi (il tempo dello splash screen) prima di attivare il pop-up
      const timer = setTimeout(() => {
        richiediPermessoNotifiche();
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, []);

  return <App />;
};
// -------------------------------------------------

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppConNotifiche />
    </BrowserRouter>
  </React.StrictMode>,
)
