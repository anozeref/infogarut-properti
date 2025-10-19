// frontend/src/pages/user/PropertiDitolak.jsx
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

  // 🔄 Ambil data properti ditolak user
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

        // 🔍 Filter: hanya milik user & status ditolak
        const filtered = res.data
          .filter((prop) => {
            const status = prop.statusPostingan?.toLowerCase();
            return (
              (prop.userId === user.id || prop.ownerId === user.id) &&
              ["ditolak", "rejected", "not-approved", "declined", "failed"].includes(status)
            );
          })
          // 🔽 Urutkan dari terbaru
          .sort(
            (a, b) =>
              new Date(b.tanggal || b.postedAt) -
              new Date(a.tanggal || a.postedAt)
          );

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

  // 🗑️ Hapus properti
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

  // 🕒 Loading state
  if (loading) {
    return (
      <div className={`${styles.cardContainer} ${darkMode ? styles.dark : ""}`}>
        <p>Sedang memuat data properti ditolak...</p>
      </div>
    );
  }

  // 🚫 Jika user belum login
  if (!user) {
    return (
      <div className={`${styles.cardContainer} ${darkMode ? styles.dark : ""}`}>
        <p>Silakan login untuk melihat daftar properti yang ditolak.</p>
      </div>
    );
  }

  // 💡 Render hasil
  return (
    <div className={`${styles.cardContainer} ${darkMode ? styles.dark : ""}`}>
      <h2 className={styles.pageTitle}>Properti Ditolak</h2>

      {properties.length === 0 ? (
        <p>Tidak ada properti yang ditolak saat ini.</p>
      ) : (
        <div className={styles.gridContainerDitolak}>
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
              onDelete={() => handleDelete(item.id)}
              showActions={true} // ✅ Tampilkan tombol hapus/edit
            />
          ))}
        </div>
      )}
    </div>
  );
}
