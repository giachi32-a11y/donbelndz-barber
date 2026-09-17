import React, { useState } from 'react';
import instagramIcon from '../instagram.png'; 
import tiktokIcon from '../tiktok.png';

const SocialFooter = () => {
  const [showPrivacy, setShowPrivacy] = useState(false);

  const instagramUrl = "https://www.instagram.com/donblendzbarbershop?igsh=N3oxaTRnY3Z4bGk1";
  const tiktokUrl = "https://www.tiktok.com/@donblendzbarbershop?_r=1&_t=ZN-976Dt0MQmtq";

  return (
    <div style={styles.footerContainer}>
      {/* Container Icone Social */}
      <div style={styles.socialRow}>
        <a href={instagramUrl} target="_blank" rel="noopener noreferrer" style={styles.link}>
          <img src={instagramIcon} alt="Instagram" style={styles.socialIcon} />
        </a>

        <a href={tiktokUrl} target="_blank" rel="noopener noreferrer" style={styles.link}>
          <img src={tiktokIcon} alt="TikTok" style={styles.socialIcon} />
        </a>
      </div>

      {/* Link Privacy Policy e Termini */}
      <div style={styles.legalLinks}>
        <span onClick={() => setShowPrivacy(true)} style={styles.legalText}>
          Informativa Privacy
        </span>
        <span style={{ color: '#555' }}>|</span>
        <span onClick={() => setShowPrivacy(true)} style={styles.legalText}>
          Termini del Servizio
        </span>
      </div>

      {/* Copyright */}
      <p style={styles.copyrightText}>
        © {new Date().getFullYear()} DonBlendz BarberShop. Tutti i diritti riservati.
      </p>

      {/* POPUP MODAL PRIVACY & TERMINI */}
      {showPrivacy && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3 style={styles.modalTitle}>Informativa sulla Privacy & Condizioni di Servizio</h3>
            
            <p style={styles.modalParagraph}>
              <strong>1. Titolare del Trattamento dei Dati</strong><br />
              Il Titolare del trattamento è <b>DonBlendz BarberShop</b>, con sede in Via della Colombina N°2, Campi Bisenzio (FI). Per qualsiasi chiarimento in materia di protezione dati è possibile contattare la struttura ai seguenti recapiti:
            </p>
            <qul style={styles.modalList}>
  <li><b>Email:</b> donblendzbarbershop@gmail.com</li>
  <li><b>Telefono / WhatsApp:</b> +39 344 7875378</li>
</ul>

            <p style={styles.modalParagraph}>
              <strong>2. Tipologia di Dati Trattati e Finalità</strong><br />
              Ai sensi dell'art. 13 del Regolamento UE 2016/679 (GDPR), si informa che i dati personali forniti dall'utente (Nome, Cognome, Indirizzo Email, Numero di Telefono) sono raccolti e trattati esclusivamente per le seguenti finalità:
            </p>
            <ul style={styles.modalList}>
              <li>Gestione, pianificazione ed erogazione delle prenotazioni per i servizi di barberia.</li>
              <li>Invio di notifiche transazionali e promemoria relativi agli appuntamenti confermati.</li>
              <li>Gestione della lista d'attesa ed eventuale notifica di disponibilità posti su richiesta.</li>
            </ul>

            <p style={styles.modalParagraph}>
              <strong>3. Base Giuridica e Modalità del Trattamento</strong><br />
              Il trattamento si fonda sull'esecuzione di misure precontrattuali o contrattuali adottate su richiesta dell'interessato. I dati sono trattati in modo lecito, corretto e trasparente mediante strumenti informatici e telematici protetti (infrastruttura Google Cloud/Workspace), adottando adeguate misure di sicurezza per prevenirne la perdita, l'uso illecito o l'accesso non autorizzato.
            </p>

            <p style={styles.modalParagraph}>
              <strong>4. Comunicazione e Diffusione dei Dati</strong><br />
              I dati personali non saranno in alcun modo diffusi né ceduti a terzi per scopi commerciali o di profilazione.
            </p>

            <p style={styles.modalParagraph}>
              <strong>5. Diritti dell'Interessato</strong><br />
              Ai sensi degli artt. 15-22 del GDPR, l'utente ha il diritto in qualsiasi momento di accedere ai propri dati, richiederne la rettifica, la cancellazione (diritto all'oblio) o la limitazione del trattamento facendone richiesta diretta allo staff della struttura.
            </p>

            <p style={styles.modalParagraph}>
              <strong>6. Termini e Condizioni di Prenotazione</strong><br />
              La prenotazione effettuata tramite l'applicazione costituisce un impegno orario. In caso di sopravvenuta impossibilità a presentarsi, l'utente è tenuto ad effettuare la disdetta o la modifica dell'appuntamento tramite la funzionalità integrata con congruo anticipo, al fine di consentire la corretta riorganizzazione del servizio.
            </p>

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button onClick={() => setShowPrivacy(false)} style={styles.closeButton}>
                HO CAPITO E ACCETTO
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  footerContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '25px',
    marginBottom: '20px',
    width: '100%',
  },
  socialRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '20px',
    marginBottom: '15px',
  },
  link: {
    display: 'inline-block',
    textDecoration: 'none',
  },
  socialIcon: {
    width: '30px',
    height: '30px',
    objectFit: 'contain',
    cursor: 'pointer',
  },
  legalLinks: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    fontSize: '12px',
    marginBottom: '8px',
  },
  legalText: {
    color: '#888',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
  copyrightText: {
    fontSize: '11px',
    color: '#555',
    margin: 0,
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.88)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    padding: '20px',
    boxSizing: 'border-box',
  },
  modalContent: {
    backgroundColor: '#121212',
    border: '1px solid #D4AF37',
    borderRadius: '15px',
    padding: '25px',
    maxWidth: '500px',
    maxHeight: '80vh',
    overflowY: 'auto',
    color: '#E0E0E0',
    textAlign: 'left',
    fontSize: '12px',
    lineHeight: '1.6',
  },
  modalTitle: {
    color: '#D4AF37',
    marginTop: 0,
    marginBottom: '20px',
    textAlign: 'center',
    textTransform: 'uppercase',
    fontSize: '15px',
    letterSpacing: '0.5px',
  },
  modalParagraph: {
    marginBottom: '14px',
  },
  modalList: {
    paddingLeft: '20px',
    marginTop: '5px',
    marginBottom: '14px',
  },
  closeButton: {
    backgroundColor: '#D4AF37',
    color: '#000',
    border: 'none',
    padding: '12px 30px',
    borderRadius: '8px',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '13px',
    letterSpacing: '0.5px',
  },
};

export default SocialFooter;
