// src/pages/HomePage.jsx
import React from 'react';
import Hero from '../components/Hero/Hero';
import Categories from '../components/Categories/Categories';
import Faq from '../components/Faq/Faq';

const HomePage = () => {
  return (
    <>
      <Hero />
      <Categories />
      <Faq />
    </>
  );
};

export default HomePage;