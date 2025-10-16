// === PropertiPending.jsx ===
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import CardProperty from "./components/CardProperty";
import Swal from "sweetalert2";
import { AuthContext } from "../../context/AuthContext";
import { useOutletContext } from "react-router-dom";
import styles from "./components/CardProperty.module.css";

export default function PropertiPending() {
  const { darkMode } = useOutletContext();
  const { user } = useContext(AuthContext);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // ======================= FETCH DATA =======================
  useEffect(() => {
    if (!user) {
      Swal.fire({
        icon: "warning",
        title: "Belum Login",
        text: "Silakan login terlebih dahulu untuk melihat properti pending Anda.",
      });
      setLoading(false);
      return;
    }

    const fetchPendingProperties = async () => {
      try {
        const res = await axios.get("http://localhost:3004/properties");

        // 🔍 Filter: hanya properti user ini yg masih pending
        const filtered = res.data
          .filter(
            (prop) =>
              (prop.userId === user.id || prop.ownerId === user.id) &&
              prop.statusPostingan === "pending"
          )
          // urutkan terbaru dulu
          .sort(
            (a, b) =>
              new Date(b.tanggal || b.postedAt) -
              new Date(a.tanggal || a.postedAt)
          );

        setProperties(filtered);
      } catch (err) {
        console.error("Gagal memuat properti pending:", err);
        Swal.fire({
          icon: "error",
          title: "Gagal Memuat Data",
          text: "Terjadi kesalahan saat memuat properti pending Anda.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPendingProperties();
  }, [user]);

  // ======================= HANDLE DELETE =======================
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Hapus Properti?",
      text: "Data ini akan dihapus secara permanen.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`http://localhost:3004/properties/${id}`);
        setProperties((prev) => prev.filter((item) => item.id !== id));

        Swal.fire({
          icon: "success",
          title: "Dihapus!",
          text: "Properti berhasil dihapus.",
        });
      } catch (err) {
        console.error("Gagal menghapus properti:", err);
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: "Terjadi kesalahan saat menghapus properti.",
        });
      }
    }
  };

  // ======================= RENDER =======================
  if (loading) {
    return (
      <div className={`${styles.cardContainer} ${darkMode ? styles.dark : ""}`}>
        <p>Memuat properti pending...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={`${styles.cardContainer} ${darkMode ? styles.dark : ""}`}>
        <p>Silakan login untuk melihat daftar properti pending Anda.</p>
      </div>
    );
  }

  return (
    <div className={`${styles.cardContainer} ${darkMode ? styles.dark : ""}`}>
      <h2 className={styles.pageTitle}>Properti Pending</h2>

      {properties.length === 0 ? (
        <p>Tidak ada properti pending saat ini.</p>
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
              status={item.statusPostingan}
              darkMode={darkMode}
              showActions={false} // ✅ bisa edit & hapus
              onDelete={() => handleDelete(item.id)} // handler hapus
            />
          ))}
        </div>
      )}
    </div>
  );
}
