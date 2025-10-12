// src/pages/HomePage.jsx
import React from 'react';
import Hero from '../components/Hero/Hero';
import Categories from '../components/Categories/Categories';
import WhyChooseUs from '../components/WhyChooseUs/WhyChooseUs'; // 1. Import komponen baru
import Faq from '../components/Faq/Faq';

const HomePage = () => {
  return (
    <>
      <Hero />
      <Categories />
      <WhyChooseUs /> {/* 2. Tambahkan di sini */}
      <Faq />
    </>
  );
};

export default HomePage;