import React from 'react';
// 1. Importiamo le immagini come file di codice (assumendo che instagram.png e tiktok.png siano dentro la cartella src)
import instagramIcon from '../instagram.png'; 
import tiktokIcon from '../tiktok.png';

const SocialFooter = () => {
  const instagramUrl = "https://www.instagram.com/donblendzbarbershop?igsh=N3oxaTRnY3Z4bGk1";
  const tiktokUrl = "https://www.tiktok.com/@donblendzbarbershop?_r=1&_t=ZN-976Dt0MQmtq";

  return (
    <div style={styles.footerContainer}>
      {/* Bottone Instagram */}
      <a href={instagramUrl} target="_blank" rel="noopener noreferrer" style={styles.link}>
        {/* 2. Usiamo la variabile importata dentro le parentesi graffe */}
        <img src={instagramIcon} alt="Instagram" style={styles.socialIcon} />
      </a>

      {/* Bottone TikTok */}
      <a href={tiktokUrl} target="_blank" rel="noopener noreferrer" style={styles.link}>
        {/* 2. Usiamo la variabile importata dentro le parentesi graffe */}
        <img src={tiktokIcon} alt="TikTok" style={styles.socialIcon} />
      </a>
    </div>
  );
};

const styles = {
  footerContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '20px',
    marginTop: '25px',
    marginBottom: '20px',
    width: '100%',
  },
  link: {
    display: 'inline-block',
    textDecoration: 'none',
  },
  socialIcon: {
    width: '32px',
    height: '32px',
    objectFit: 'contain',
    cursor: 'pointer',
  },
};

export default SocialFooter;
