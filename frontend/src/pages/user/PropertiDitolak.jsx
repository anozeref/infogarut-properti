// PropertiDitolak.jsx
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import CardProperty from "./components/CardProperty";
import styles from "./components/CardProperty.module.css";
import Swal from "sweetalert2";
import { AuthContext } from "../../context/AuthContext";
import { useOutletContext } from "react-router-dom";

export default function PropertiDitolak() {
  const { darkMode } = useOutletContext();
  const { user } = useContext(AuthContext);

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // ========================= FETCH DATA =========================
  useEffect(() => {
    if (!user) {
      Swal.fire({
        icon: "warning",
        title: "Belum Login",
        text: "Silakan login terlebih dahulu untuk melihat properti yang ditolak.",
        background: darkMode ? "#1f2937" : "#fff",
        color: darkMode ? "#fff" : "#000",
      });
      setLoading(false);
      return;
    }

    const fetchRejectedProperties = async () => {
      try {
        const res = await axios.get("http://localhost:3004/properties");

        // ✅ Hanya tampilkan properti yang statusnya ditolak
        const filtered = res.data
          .filter((prop) => {
            const status = prop.statusPostingan?.toLowerCase();
            return (
              (prop.userId === user.id || prop.ownerId === user.id) &&
              ["ditolak", "rejected", "not-approved", "declined", "failed"].includes(status)
            );
          })
          .sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));

        setProperties(filtered);
      } catch (err) {
        console.error("Gagal memuat properti ditolak:", err);
        Swal.fire({
          icon: "error",
          title: "Gagal Memuat Data",
          text: "Terjadi kesalahan saat memuat properti ditolak Anda.",
          background: darkMode ? "#1f2937" : "#fff",
          color: darkMode ? "#fff" : "#000",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRejectedProperties();
  }, [user, darkMode]);

  // ========================= HANDLE DELETE =========================
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Hapus Properti?",
      text: "Apakah Anda yakin ingin menghapus properti ini secara permanen?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
      background: darkMode ? "#1f2937" : "#fff",
      color: darkMode ? "#fff" : "#000",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axios.delete(`http://localhost:3004/properties/${id}`);

      setProperties((prev) => prev.filter((p) => p.id !== id));

      Swal.fire({
        icon: "success",
        title: "Dihapus!",
        text: "Properti telah berhasil dihapus.",
        background: darkMode ? "#1f2937" : "#fff",
        color: darkMode ? "#fff" : "#000",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Gagal menghapus properti:", err);
      Swal.fire({
        icon: "error",
        title: "Gagal Menghapus",
        text: "Terjadi kesalahan saat menghapus properti.",
        background: darkMode ? "#1f2937" : "#fff",
        color: darkMode ? "#fff" : "#000",
      });
    }
  };

  // ========================= RENDER =========================
  if (loading) {
    return (
      <div className={`${styles.cardContainer} ${darkMode ? styles.dark : ""}`}>
        <p>Sedang memuat data properti ditolak...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={`${styles.cardContainer} ${darkMode ? styles.dark : ""}`}>
        <p>Silakan login untuk melihat daftar properti yang ditolak.</p>
      </div>
    );
  }

  return (
    <div className={`${styles.cardContainer} ${darkMode ? styles.dark : ""}`}>
      <h2 className={styles.pageTitle}>Properti Ditolak</h2>

      {properties.length === 0 ? (
        <p>Tidak ada properti yang ditolak saat ini.</p>
      ) : (
        <div className={styles.gridContainer}>
          {properties.map((item) => (
            <CardProperty
              key={item.id}
              {...item}
              darkMode={darkMode}
              onDelete={() => handleDelete(item.id)}
              showActions={true} // ✅ Tampilkan tombol Edit & Hapus
            />
          ))}
        </div>
      )}
    </div>
  );
}
