import React, {
  useState,
  useEffect,
  useContext
} from "react";
import axios from "axios";
import { Outlet, useNavigate, useLocation, Routes, Route } from "react-router-dom";

// Context
import { AuthContext } from "../../context/AuthContext";

// Components
import NavbarUser from "./components/NavbarUser";
import SidebarUser from "./components/Sidebar";
import FooterUser from "./components/FooterUser";
import CardProperty from "./components/CardProperty";
import AddPropertyButton from "./components/AddPropertyButton";

// Pages
import PropertiSaya from "./PropertiSaya";
import PropertiPending from "./PropertiPending";
import PropertiAktif from "./PropertiAktif";
import PropertiDitolak from "./PropertiDitolak";
import ProfileUser from "./ProfileUser/ProfileUser";
import EditProperty from "./EditProperty";
import TambahProperty from "./TambahProperty";

export default function DashboardUser() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [darkMode, setDarkMode] = useState(false);
  const [latestProperties, setLatestProperties] = useState([]);

  // 🔘 Toggle tema gelap/terang
  const toggleTheme = () => setDarkMode((prev) => !prev);

  // ➕ Arahkan ke halaman tambah properti
  const handleAddProperty = () => navigate("/tambahproperty");

  // 🎨 Style utama dashboard
  const dashboardStyle = {
    backgroundColor: darkMode ? "#121212" : "#f9f9f9",
    color: darkMode ? "#f1f1f1" : "#1e1e1e",
    minHeight: "100vh",
    transition: "background 0.3s ease, color 0.3s ease",
  };

  // 🧩 Fetch data properti user saat dashboard dibuka
  useEffect(() => {
    if (user?.id) {
      axios
        .get("http://localhost:3000/properties")
        .then((res) => {
          const userProps = res.data
            .filter((p) => p.ownerId === user.id)
            .sort((a, b) => b.id - a.id) // urutkan terbaru di atas
            .slice(0, 4); // ambil 4 terakhir
          setLatestProperties(userProps);
        })
        .catch((err) => console.error("Gagal ambil data properti:", err));
    }
  }, [user]);

  return (
    <div style={dashboardStyle}>
      {/* 🔝 Navbar */}
      <NavbarUser darkMode={darkMode} toggleTheme={toggleTheme} />

      <div style={{ display: "flex" }}>
        {/* 🧭 Sidebar */}
        <SidebarUser darkMode={darkMode} />

        {/* 📄 Konten utama */}
        <div
          style={{
            flex: 1,
            padding: "20px 30px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <Routes>
            {/* 🏠 Halaman utama Dashboard */}
            <Route
              index
              element={
                <>
                  <h2
                    style={{
                      marginBottom: "10px",
                      color: darkMode ? "#e5e5e5" : "#1e1e1e",
                    }}
                  >
                    Halo,{" "}
                    <span style={{ color: "#4f46e5" }}>
                      {user?.username || "User"}
                    </span>{" "}
                    — Selamat Datang di Info Garut Properti!
                  </h2>

                  <p
                    style={{
                      color: darkMode ? "#ccc" : "#555",
                      marginBottom: "20px",
                    }}
                  >
                    Yuk, kelola dan lihat update properti terbaru di dashboard kamu!
                  </p>

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
                      {latestProperties.length > 0 ? (
                        latestProperties.map((prop) => (
                          <CardProperty
                            key={prop.id}
                            darkMode={darkMode}
                            image={`/${prop.media?.[0] || "default.jpg"}`}
                            type={prop.tipeProperti}
                            title={prop.namaProperti}
                            location={prop.lokasi}
                            price={`Rp ${prop.harga.toLocaleString("id-ID")}`}
                            desc={prop.deskripsi}
                          />
                        ))
                      ) : (
                        <p style={{ color: darkMode ? "#bbb" : "#777" }}>
                          Belum ada properti ditambahkan.
                        </p>
                      )}
                    </div>
                  </section>
                </>
              }
            />

            {/* 📁 Routing halaman lain */}
            <Route path="propertisaya" element={<Outlet context={{ darkMode }} />}>
              <Route index element={<PropertiSaya />} />
            </Route>

            <Route path="propertipending" element={<Outlet context={{ darkMode }} />}>
              <Route index element={<PropertiPending />} />
            </Route>

            <Route path="propertiaktif" element={<Outlet context={{ darkMode }} />}>
              <Route index element={<PropertiAktif />} />
            </Route>

            <Route path="propertiditolak" element={<Outlet context={{ darkMode }} />}>
              <Route index element={<PropertiDitolak />} />
            </Route>

            <Route path="edit-property/:id" element={<EditProperty />} />

            <Route
              path="tambahproperty"
              element={<TambahProperty darkMode={darkMode} />}
            />

            <Route
              path="profileuser"
              element={<ProfileUser darkMode={darkMode} />}
            />
          </Routes>
        </div>
      </div>

      {/* ⚙️ Footer dan tombol tambah */}
      <FooterUser darkMode={darkMode} />
      <AddPropertyButton onClick={handleAddProperty} />
    </div>
  );
}
