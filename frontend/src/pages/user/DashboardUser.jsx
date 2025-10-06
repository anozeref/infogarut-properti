// DashboardUser.jsx
import React from "react";
import NavbarUser from "./components/NavbarUser";
import Sidebar from "./components/Sidebar";
import FooterUser from "./components/FooterUser";
import CardProperty from "./components/CardProperty";
import AddPropertyButton from "./components/AddPropertyButton";

function App() {
  return (
    <div>
      <NavbarUser />
      <div style={{ display: "flex" }}>
        <Sidebar />
        <div style={{ flex: 1, padding: "20px", display: "flex", gap: "20px", flexWrap: "wrap" }}>
          <CardProperty
            image=""
            type="Rumah"
            title="Rumah Minimalis"
            location="Bandung"
            price="Rp 750.000.000"
            desc="Rumah minimalis dengan desain modern, cocok untuk keluarga kecil."
          />
          <CardProperty
            image=""
            type="Apartemen"
            title="Apartemen City View"
            location="Jakarta"
            price="Rp 1.250.000.000"
            desc="Apartemen mewah dengan pemandangan kota."
          />
          <CardProperty
            image=""
            type="Villa"
            title="Villa Pinggir Pantai"
            location="Bali"
            price="Rp 3.000.000.000"
            desc="Villa luas dengan akses langsung ke pantai."
          />
        </div>
      </div>
      <FooterUser />
       {/* Tombol tambah properti */}
      <AddPropertyButton />
    </div>
  );
}

export default App;
