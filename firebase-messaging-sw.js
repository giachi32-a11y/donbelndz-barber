// Importa gli SDK di Firebase necessari per il Service Worker in background
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

// Configurazione reale della tua app del barbiere
const firebaseConfig = {
  apiKey: "AIzaSyAM8yiJO5yDPepXEqnizQydCRwSYufx6MI",
  authDomain: "barbiere-pwa.firebaseapp.com",
  projectId: "barbiere-pwa",
  storageBucket: "barbiere-pwa.firebasestorage.app",
  messagingSenderId: "1013459748557",
  appId: "1:1013459748557:web:b577f7bc645162c0454b84"
};

// Inizializza Firebase nel Service Worker
firebase.initializeApp(firebaseConfig);

// Recupera il servizio di messaggistica
const messaging = firebase.messaging();

// Gestisce la comparsa della notifica quando lo smartphone è bloccato o l'app è chiusa
messaging.onBackgroundMessage((payload) => {
  console.log('Notifica ricevuta in background: ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo512.png', // Usa il logo già presente nella tua cartella
    badge: '/logo512.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
