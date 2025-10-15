// src/components/Hero/Hero.jsx
import React from 'react';
import styles from './Hero.module.css';
import BackgroundImage from '../../assets/hero-background.jpg';
import { Link } from 'react-router-dom'; // 1. Import Link

const Hero = () => {
  const heroStyle = {
    backgroundImage: `linear-gradient(rgba(10, 44, 90, 0.7), rgba(10, 44, 90, 0.7)), url(${BackgroundImage})`
  };

  return (
    <section className={styles.hero} style={heroStyle}>
      <div className={styles.content}>
        <h1 className={styles.title}>Rumah Ideal Anda Menanti</h1>
        <p className={styles.subtitle}>
          Jelajahi pilihan properti terbaik kami dan temukan hunian sempurna yang telah Anda nantikan.
        </p>
        
        {/* 2. Ganti <button> menjadi <Link> dan tambahkan prop 'to' */}
        <Link to="/properti" className={styles.ctaButton}>
          Jelajahi Properti
        </Link>

      </div>
    </section>
  );
};

export default Hero;