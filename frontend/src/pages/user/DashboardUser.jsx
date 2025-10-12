import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import NavbarUser from "./components/NavbarUser";
import SidebarUser from "./components/Sidebar";
import FooterUser from "./components/FooterUser";
import CardProperty from "./components/CardProperty";
import AddPropertyButton from "./components/AddPropertyButton";

export default function DashboardUser() {
  const navigate = useNavigate();
  const location = useLocation();

  // 🌙 Tema global
  const [darkMode, setDarkMode] = useState(false);

  const handleAddProperty = () => navigate("/tambahproperty");
  const toggleTheme = () => setDarkMode((prev) => !prev);

  // 🎨 Style tema
  const dashboardStyle = {
    backgroundColor: darkMode ? "#121212" : "#f9f9f9",
    color: darkMode ? "#f1f1f1" : "#1e1e1e",
    minHeight: "100vh",
    transition: "background 0.3s ease, color 0.3s ease",
  };

  // 🧱 Dummy Data "Update Properti Terbaru"
  const latestProperties = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=70",
      type: "Ruko",
      title: "Ruko Strategis di Garut Kota",
      location: "Garut, Jawa Barat",
      price: "Rp 950.000.000",
      desc: "Ruko 2 lantai dekat pasar dan jalan utama.",
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1572120360610-d971b9b78825?w=800&q=70",
      type: "Rumah",
      title: "Rumah Nyaman di Cipanas",
      location: "Garut, Jawa Barat",
      price: "Rp 780.000.000",
      desc: "Rumah minimalis dengan halaman luas dan udara sejuk.",
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=70",
      type: "Apartemen",
      title: "Apartemen Modern Bandung",
      location: "Bandung, Jawa Barat",
      price: "Rp 1.250.000.000",
      desc: "Apartemen baru di pusat kota dengan fasilitas lengkap.",
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800&q=70",
      type: "Villa",
      title: "Villa View Gunung",
      location: "Lembang, Bandung",
      price: "Rp 2.500.000.000",
      desc: "Villa luas dengan pemandangan pegunungan dan udara sejuk.",
    },
  ];

  return (
    <div style={dashboardStyle}>
      {/* 🔝 Navbar */}
      <NavbarUser darkMode={darkMode} toggleTheme={toggleTheme} />

      <div style={{ display: "flex" }}>
        {/* 🧭 Sidebar */}
        <SidebarUser darkMode={darkMode} />

        <div
          style={{
            flex: 1,
            padding: "20px 30px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          {location.pathname === "/dashboarduser" ? (
            <>
              {/* 👋 Greeting */}
              <h2
                style={{
                  marginBottom: "10px",
                  color: darkMode ? "#e5e5e5" : "#1e1e1e",
                }}
              >
                Halo,{" "}
                <span style={{ color: "#4f46e5" }}>User</span> — Selamat Datang di Info Garut Properti!
              </h2>
              <p
                style={{
                  color: darkMode ? "#ccc" : "#555",
                  marginBottom: "20px",
                }}
              >
                Yuk, kelola dan lihat update properti terbaru di dashboard kamu!
              </p>

              {/* 🌟 Update Properti Terbaru */}
              <section style={{ marginTop: "10px" }}>
                <h3
                  style={{
                    marginBottom: "15px",
                    color: darkMode ? "#ddd" : "#333",
                  }}
                >
                  Update Properti Terbaru
                </h3>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "20px",
                  }}
                >
                  {latestProperties.map((prop) => (
                    <CardProperty
                      key={prop.id}
                      darkMode={darkMode}
                      image={prop.image}
                      type={prop.type}
                      title={prop.title}
                      location={prop.location}
                      price={prop.price}
                      desc={prop.desc}
                    />
                  ))}
                </div>
              </section>
            </>
          ) : (
            // 🔁 Halaman nested (misal PropertiSaya.jsx)
            <Outlet context={{darkMode}} />
          )}
        </div>
      </div>

      {/* ⚙️ Footer & Floating Button */}
      <FooterUser darkMode={darkMode} />
      <AddPropertyButton onClick={handleAddProperty} />
    </div>
  );
}
