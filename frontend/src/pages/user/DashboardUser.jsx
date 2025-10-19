import React, { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { Outlet, Routes, Route, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

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
import TambahPropertiUser from "./TambahPropertiUser";

// Styles
import styles from "./DashboardUser.module.css";

// Hapus deklarasi socket global untuk menghindari duplikasi
// const socket = io("http://localhost:3005")

const API_BASE_URL = "http://localhost:3004";
const SOCKET_SERVER_URL = "http://localhost:3005";

export default function DashboardUser() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(false);
  const [latestProperties, setLatestProperties] = useState([]);
  const [socketInstance, setSocketInstance] = useState(null); // Ubah 'socket' menjadi 'socketInstance'

  // Ambil properti terbaru (dijadikan useCallback agar tidak membuat fungsi baru setiap render)
  const fetchLatestProperties = useCallback(() => {
    if (user?.id) {
      axios
        .get(`${API_BASE_URL}/properties`)
        .then((res) => {
          // Filter, sort, dan slice di sisi klien
          const activeProps = res.data
            .filter(
              (p) =>
                String(p.ownerId) === String(user.id) &&
                p.statusPostingan === "approved"
            )
            .sort((a, b) => b.id - a.id)
            .slice(0, 4);
          setLatestProperties(activeProps);
        })
        .catch((err) => console.error("Gagal ambil data properti:", err));
    }
  }, [user?.id]); // Dependensi user.id agar hanya dibuat ulang jika ID berubah

  // ✅ Setup Socket.IO Client
  useEffect(() => {
    // Pastikan user sudah ada sebelum mencoba koneksi dan join room
    if (!user?.id) return;

    // Inisialisasi socket client
    const newSocket = io(SOCKET_SERVER_URL, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      query: { userId: user.id }, // Opsi: Kirim ID user saat koneksi
    });

    // Join room khusus user
    newSocket.emit("joinUserRoom", user.id);
    console.log(`Socket.IO: User ${user.id} bergabung ke ruangan.`);

    // Event: properti update khusus user
    const handlePropertyUpdate = (data) => {
      // Notifikasi akan diterima jika ownerId properti cocok dengan user yang sedang login
      if (data.ownerId === user.id) {
        const statusText =
          data.statusPostingan === "approved"
            ? "disetujui (Aktif) 🟢"
            : data.statusPostingan === "pending"
            ? "diubah menjadi Pending 🟡"
            : data.statusPostingan === "rejected"
            ? "ditolak 🔴"
            : "diperbarui";

        alert(
          `🔔 Notifikasi Properti:\nProperti "${data.namaProperti}" telah ${statusText} oleh admin. Silakan cek di Dashboard Anda.`
        );

        // Panggil fungsi untuk memuat ulang data setelah update
        fetchLatestProperties();
      }
    };

    newSocket.on("propertyStatusUpdated", handlePropertyUpdate);

    // Simpan socket di state supaya bisa dipakai di komponen lain jika perlu
    setSocketInstance(newSocket);

    // Bersihkan socket saat unmount
    return () => {
      newSocket.off("propertyStatusUpdated", handlePropertyUpdate); // Hapus listener
      newSocket.disconnect(); // Putuskan koneksi
      console.log(`Socket.IO: User ${user.id} keluar dan koneksi diputuskan.`);
    };
  }, [user, fetchLatestProperties]); // Tambahkan fetchLatestProperties sebagai dependensi

  // Ambil data properti aktif pertama kali (dan setiap kali user berubah atau ada notifikasi)
  useEffect(() => {
    fetchLatestProperties();
  }, [fetchLatestProperties]); // Gunakan fetchLatestProperties yang sudah di-memoize

  // Toggle dark mode
  const toggleTheme = () => setDarkMode((prev) => !prev);

  // Arahkan ke halaman tambah properti
  const handleAddProperty = () => navigate("/user/tambahproperty");

  return (
    <div
      className={`${styles.dashboardContainer} ${
        darkMode ? styles.darkMode : styles.lightMode
      }`}
    >
      {/* Navbar */}
      <NavbarUser darkMode={darkMode} toggleTheme={toggleTheme} />

      <div style={{ display: "flex" }}>
        {/* Sidebar */}
        <SidebarUser darkMode={darkMode} />

        {/* Konten utama */}
        <div style={{ flex: 1, marginLeft: "20px" }}>
          <Routes>
            {/* Halaman utama Dashboard */}
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
                    Yuk, kelola dan lihat update properti terbaru di dashboard
                    kamu!
                  </p>

                  {/* 🔹 Bagian Update Properti Aktif */}
                  <section style={{ marginTop: "10px" }}>
                    <h3
                      style={{
                        marginBottom: "15px",
                        color: darkMode ? "#ddd" : "#333",
                      }}
                    >
                      Update Properti Aktif Terbaru
                    </h3>

                    <div className={styles.propertyGrid}>
                      {latestProperties.length > 0 ? (
                        latestProperties.map((prop) => (
                          <div key={prop.id} className={styles.cardWrapper}>
                            <CardProperty
                              id={prop.id}
                              namaProperti={prop.namaProperti}
                              tipeProperti={prop.tipeProperti}
                              jenisProperti={prop.jenisProperti}
                              periodeSewa={prop.periodeSewa}
                              harga={prop.harga}
                              luasTanah={prop.luasTanah}
                              luasBangunan={prop.luasBangunan}
                              kamarTidur={prop.kamarTidur}
                              kamarMandi={prop.kamarMandi}
                              lokasi={prop.lokasi}
                              deskripsi={prop.deskripsi}
                              media={prop.media}
                              status={prop.statusPostingan}
                              darkMode={darkMode}
                            />
                          </div>
                        ))
                      ) : (
                        <p style={{ color: darkMode ? "#bbb" : "#777" }}>
                          Belum ada properti aktif ditambahkan.
                        </p>
                      )}
                    </div>
                  </section>
                </>
              }
            />

            {/* Routing halaman lain */}
            <Route path="propertisaya" element={<Outlet context={{ darkMode }} />}>
              <Route index element={<PropertiSaya />} />
            </Route>

            <Route
              path="propertipending"
              element={<Outlet context={{ darkMode }} />}
            >
              <Route index element={<PropertiPending />} />
            </Route>

            <Route
              path="propertiaktif"
              element={<Outlet context={{ darkMode }} />}
            >
              <Route index element={<PropertiAktif />} />
            </Route>

            <Route
              path="propertiditolak"
              element={<Outlet context={{ darkMode }} />}
            >
              <Route index element={<PropertiDitolak />} />
            </Route>

            <Route
              path="edit-property/:id"
              element={<EditProperty darkMode={darkMode} />}
            />

            <Route
              path="tambahproperty"
              element={<TambahPropertiUser darkMode={darkMode} />}
            />

            <Route
              path="profileuser"
              element={<ProfileUser darkMode={darkMode} />}
            />
          </Routes>
        </div>
      </div>

      {/* Footer dan tombol tambah */}
      <FooterUser darkMode={darkMode} />
      <AddPropertyButton onClick={handleAddProperty} />
    </div>
  );
}