import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import CardProperty from "./components/CardProperty";
import styles from "./components/CardProperty.module.css";
import { AuthContext } from "../../context/AuthContext";
import Swal from "sweetalert2";

export default function PropertiSaya() {
  const [properties, setProperties] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!user) {
      Swal.fire({
        icon: "warning",
        title: "Belum Login",
        text: "Silakan login terlebih dahulu untuk melihat properti Anda.",
      });
      return;
    }

    const fetchMyProperties = async () => {
      try {
        const res = await axios.get("http://localhost:3004/properties");
        // 🔍 Filter hanya properti milik user yang sedang login
        const userProperties = res.data.filter(
          (prop) => prop.ownerId === user.id
        );
        setProperties(userProperties);
      } catch (err) {
        console.error("Gagal memuat properti:", err);
        Swal.fire({
          icon: "error",
          title: "Gagal Memuat Data",
          text: "Terjadi kesalahan saat memuat data properti Anda.",
        });
      }
    };

    fetchMyProperties();
  }, [user]);

  const handleDelete = (id) => {
    setProperties((prev) => prev.filter((p) => p.id !== id));
  };

  if (!user) {
    return (
      <div className={`${styles.cardContainer} ${darkMode ? styles.dark : ""}`}>
        <p>Silakan login untuk melihat daftar properti Anda.</p>
      </div>
    );
  }

  return (
    <div className={`${styles.cardContainer} ${darkMode ? styles.dark : ""}`}>
      <h2 className={styles.pageTitle}>Properti Saya</h2>

      {properties.length === 0 ? (
        <p>Belum ada properti yang kamu tambahkan.</p>
      ) : (
        <div className={styles.gridContainer}>
          {properties.map((item) => (
            <CardProperty
              key={item.id}
              id={item.id}
              namaProperti={item.namaProperti}
              tipeProperti={item.tipeProperti}
              jenisProperti={item.jenisProperti}
              periodeSewa={item.periodeSewa}
              harga={item.harga}
              luasTanah={item.luasTanah}
              luasBangunan={item.luasBangunan}
              kamarTidur={item.kamarTidur}
              kamarMandi={item.kamarMandi}
              lokasi={item.lokasi}
              deskripsi={item.deskripsi}
              media={item.media}
              status={item.status}
              darkMode={darkMode}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
