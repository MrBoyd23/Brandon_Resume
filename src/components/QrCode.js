import React from 'react';
import styles from '../css/QrCode.module.css';

const QrCode = () => (
  <section className={styles.qrSection} aria-label="QR Code">
    <h2 className={styles.heading}>Connect</h2>
    <div className={styles.qrCard}>
      <div className={styles.qrImageWrap}>
        <img
          src="/qr/resume-screen.png"
          alt="QR code linking to resume.brandonaboyd.com"
          className={styles.qrImage}
          width="140"
          height="140"
          loading="lazy"
        />
      </div>
      <div className={styles.qrText}>
        <p className={styles.qrDescription}>
          Scan to visit this site, or share the link:
        </p>
        <p className={styles.qrUrl}>
          <a href="https://resume.brandonaboyd.com">resume.brandonaboyd.com</a>
        </p>
      </div>
    </div>
  </section>
);

export default QrCode;
