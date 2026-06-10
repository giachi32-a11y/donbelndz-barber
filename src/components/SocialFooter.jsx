import React from 'react';

const SocialFooter = () => {
  const instagramUrl = "https://www.instagram.com/donblendzbarbershop?igsh=N3oxaTRnY3Z4bGk1"; 
  const tiktokUrl = "tiktok.com/@donblendzbarbershop?_r=1&_t=ZN-93BcAvmppAM";       

  return (
    <div style={styles.footerContainer}>
      {/* Bottone Instagram */}
      <a href={instagramUrl} target="_blank" rel="noopener noreferrer" style={styles.link}>
        <img 
          src="/src/instagram.png" // Se le hai caricate direttamente in src
          alt="Instagram" 
          style={styles.socialIcon} 
        />
      </a>

      {/* Bottone TikTok */}
      <a href={tiktokUrl} target="_blank" rel="noopener noreferrer" style={styles.link}>
        <img 
          src="/src/tiktok.png" // Se le hai caricate direttamente in src
          alt="TikTok" 
          style={styles.socialIcon} 
        />
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
    width: '32px',  // Ridimensiona l'immagine da 512px a 32px
    height: '32px',
    objectFit: 'contain',
    cursor: 'pointer',
  },
};

export default SocialFooter;
