import React from 'react';
import styles from './Hero.module.css';

function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.overlay}></div>
      <div className={styles.content}>
        <h1>Rumah Ideal Anda Menanti.</h1>
        <p>Jelajahi pilihan properti terbaik kami dan temukan hunian sempurna yang telah Anda nantikan.</p>
        <button className={styles.ctaButton}>Jelajahi Properti</button>
      </div>
    </section>
  );
}

export default Hero;