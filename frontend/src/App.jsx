// src/App.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

function App() {
  return (
    <>
      {/* Header akan selalu tampil di semua halaman */}
      <Header />
      <main>
        {/* <Outlet> akan merender konten halaman sesuai rute (HomePage atau Properti) */}
        <Outlet /> 
      </main>
      {/* Footer juga akan selalu tampil */}
      <Footer />
    </>
  );
}

export default App;