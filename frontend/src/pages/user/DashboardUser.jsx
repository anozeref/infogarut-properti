// DashboardUser.jsx
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import NavbarUser from "./components/NavbarUser";
import Sidebar from "./components/Sidebar";
import FooterUser from "./components/FooterUser";
import CardProperty from "./components/CardProperty";
import AddPropertyButton from "./components/AddPropertyButton";

export default function DashboardUser() {
  return (
    <div>
      <NavbarUser />
      <div style={{ display: "flex" }}>
        <Sidebar />
        <div
          style={{
            flex: 1,
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          {/* --- TEKS SAMBUTAN --- */}
          <h2 style={{ marginBottom: "10px", color: "#1e1e1e" }}>
            Halo, <span style={{ color: "#4f46e5" }}>User</span> Selamat Datang Di Info Garut Properti!
          </h2>
          <p style={{ color: "#555", marginBottom: "20px" }}>
            Yuk, kelola properti kamu di sini dengan mudah dan cepat.
          </p>

          {/* --- DAFTAR PROPERTI --- */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "20px",
            }}
          >
            <CardProperty
              image="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
              type="Rumah"
              title="Rumah Minimalis"
              location="Bandung"
              price="Rp 750.000.000"
              desc="Rumah minimalis dengan desain modern, cocok untuk keluarga kecil."
            />
            <CardProperty
              image="https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80"
              type="Apartemen"
              title="Apartemen City View"
              location="Jakarta"
              price="Rp 1.250.000.000"
              desc="Apartemen mewah dengan pemandangan kota."
            />
            <CardProperty
              image="https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80"
              type="Villa"
              title="Villa Pinggir Pantai"
              location="Bali"
              price="Rp 3.000.000.000"
              desc="Villa eksklusif di tepi pantai Bali dengan kolam renang pribadi dan pemandangan laut yang menakjubkan."
            />
          </div>
        </div>
      </div>
      <FooterUser />
      <AddPropertyButton />
    </div>
  );
}
