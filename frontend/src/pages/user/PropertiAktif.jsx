import React, { useState } from "react";
import CardProperty from "./components/CardProperty";
import { useOutletContext } from "react-router-dom";

export default function PropertiAktif() {
  const {darkMode} = useOutletContext();

  const myProperties = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1572120360610-d971b9b78825?w=800&q=70",
      type: "Rumah",
      title: "Rumah Nyaman di Cipanas",
      location: "Garut, Jawa Barat",
      price: "Rp 850.000.000",
      desc: "Rumah asri dengan halaman luas dan udara sejuk.",
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=70",
      type: "Apartemen",
      title: "Apartemen Modern Bandung",
      location: "Bandung, Jawa Barat",
      price: "Rp 1.200.000.000",
      desc: "Apartemen baru di pusat kota dengan fasilitas lengkap.",
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800&q=70",
      type: "Villa",
      title: "Villa View Gunung",
      location: "Lembang, Bandung",
      price: "Rp 2.500.000.000",
      desc: "Villa luas dengan pemandangan gunung dan udara sejuk.",
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "15px" }}>Properti Aktif</h2>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        {myProperties.map((prop) => (
          <CardProperty
            darkMode={darkMode}
            key={prop.id}
            image={prop.image}
            type={prop.type}
            title={prop.title}
            location={prop.location}
            price={prop.price}
            desc={prop.desc}
            status="aktif"
          />
        ))}
      </div>
    </div>
  );
}