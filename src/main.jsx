import React from 'react'
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

// Esportiamo la funzione così da poterla usare al clic di un pulsante nei tuoi componenti
export async function richiediPermessoNotifiche() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.log('Notifiche non supportate su questo dispositivo.');
    return;
  }

  try {
    // Su iOS questo pop-up apparirà SOLO se la funzione viene eseguita dentro un evento di Click
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      console.log('Permesso notifiche accordato!');
      
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      
      const tokenAttuale = await getToken(messaging, { 
        vapidKey: 'BA1OR66k5omw1Fr9yNaGVNfvnAv1m5MZ5V61dbfUTEN-JzgM8CDb0v8TgGgI4bNZ1Tfxq-tkNdteCRkK4lHjzlA',
        serviceWorkerRegistration: registration 
      });
      
      if (tokenAttuale) {
        console.log('Ecco il Token del cliente:', tokenAttuale);
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

// Rendiamo la funzione disponibile anche globalmente su window per semplicità
window.richiediPermessoNotifiche = richiediPermessoNotifiche;
// -------------------------------------------------

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
