import React, { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import {
  Outlet,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { io } from "socket.io-client";
import Swal from "sweetalert2";

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

const API_BASE_URL = "http://localhost:3004";
const SOCKET_SERVER_URL = "http://localhost:3005";

export default function DashboardUser() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [darkMode, setDarkMode] = useState(false);
  const [latestProperties, setLatestProperties] = useState([]);
  const [socketInstance, setSocketInstance] = useState(null);

  // === Ambil properti terbaru ===
  const fetchLatestProperties = useCallback(() => {
    if (!user?.id) return;
    axios
      .get(`${API_BASE_URL}/properties`)
      .then((res) => {
        const activeProps = res.data
          .filter(
            (p) =>
              String(p.ownerId) === String(user.id) &&
              p.statusPostingan === "approved"
          )
          .sort((a, b) => {
            const parseDate = (postedAt) => {
              if (!postedAt) return new Date(0);
              const [datePart, timePart] = postedAt.split(" ");
              const [day, month, year] = datePart.split("/");
              return new Date(`${year}-${month}-${day}T${timePart}`);
            };
            return parseDate(b.postedAt) - parseDate(a.postedAt);
          })
          .slice(0, 3);

        setLatestProperties(activeProps);
      })
      .catch((err) => console.error("❌ Gagal ambil data properti:", err));
  }, [user?.id]);

  // === Setup Socket.IO Client ===
  useEffect(() => {
    if (!user?.id) return;

    const socket = io(SOCKET_SERVER_URL, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      query: { userId: user.id },
    });

    socket.emit("joinUserRoom", user.id);
    console.log(`👤 Socket.IO: User ${user.id} bergabung ke ruangan.`);

    // === Saat properti disetujui / ditolak / diubah ===
    socket.on("propertyStatusUpdated", (data) => {
      if (String(data.ownerId) === String(user.id)) {
        const statusText =
          data.statusPostingan === "approved"
            ? "disetujui 🟢"
            : data.statusPostingan === "pending"
            ? "menunggu persetujuan 🟡"
            : data.statusPostingan === "rejected"
            ? "ditolak 🔴"
            : "diperbarui";

        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "info",
          title: `Properti "${data.namaProperti}" telah ${statusText}.`,
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          background: darkMode ? "#1e1e1e" : "#fff",
          color: darkMode ? "#eee" : "#333",
        });

        fetchLatestProperties();
      }
    });

    // === Saat properti baru di-upload ===
    socket.on("notif_upload", (data) => {
      console.log("📢 Properti baru diupload:", data);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: data.message || "Properti baru berhasil diupload!",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: darkMode ? "#1e1e1e" : "#fff",
        color: darkMode ? "#eee" : "#333",
      });

      fetchLatestProperties(); // 🔁 langsung ambil ulang data
    });

    // === Saat reconnect otomatis join ulang ===
    socket.on("connect", () => {
      console.log("🟢 Socket connected:", socket.id);
      socket.emit("joinUserRoom", user.id);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Socket disconnected:", socket.id);
    });

    setSocketInstance(socket);

    return () => {
      socket.disconnect();
      console.log(`👋 Socket.IO: Koneksi user ${user.id} ditutup.`);
    };
  }, [user, fetchLatestProperties, darkMode]);

  // === Ambil data saat pertama kali ===
  useEffect(() => {
    fetchLatestProperties();
  }, [fetchLatestProperties]);

  const toggleTheme = () => setDarkMode((prev) => !prev);
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

      {/* Footer */}
      <FooterUser darkMode={darkMode} />

      {/* Tombol tambah properti */}
      {location.pathname.startsWith("/user") &&
        !location.pathname.includes("tambahproperty") && (
          <AddPropertyButton onClick={handleAddProperty} />
        )}
    </div>
  );
}
