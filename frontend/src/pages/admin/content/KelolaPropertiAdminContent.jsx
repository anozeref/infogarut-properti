import React, { useState } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { FaEdit, FaTrash } from "react-icons/fa";
import styles from "./KelolaPropertiAdminContent.module.css";

const propertiesData = [
  { id: 1, title: "Rumah Minimalis", jenis: "Jual", tipe: "Rumah", location: "Tarogong", price: 350000000, ownerId: 1, status: "approved" },
  { id: 2, title: "Kost Mahasiswa", jenis: "Sewa", tipe: "Kost", location: "Cibatu", price: 1200000, ownerId: 2, status: "pending" },
  { id: 3, title: "Vila Eksklusif", jenis: "Cicilan", tipe: "Villa", location: "Cikajang", price: 1500000000, ownerId: 1, status: "approved" },
  { id: 4, title: "Apartemen Garut City", jenis: "Sewa", tipe: "Apartemen", location: "Garut Kota", price: 2500000, ownerId: 3, status: "approved" },
  { id: 5, title: "Ruko Pasar Baru", jenis: "Jual", tipe: "Ruko", location: "Wanaraja", price: 800000000, ownerId: 2, status: "approved" },
];

const KelolaPropertiAdminContent = () => {
  const [properties, setProperties] = useState(propertiesData);
  const [view, setView] = useState("admin"); // 'admin' | 'user'
  const adminId = 1;

  const handleEdit = (id) => {
    const target = properties.find((p) => p.id === id);
    Swal.fire({
      title: "Edit Properti",
      html: `
        <input id="swal-title" class="swal2-input" placeholder="Judul" value="${target.title}">
        <input id="swal-location" class="swal2-input" placeholder="Lokasi" value="${target.location}">
        <input id="swal-price" class="swal2-input" placeholder="Harga" type="number" value="${target.price}">
      `,
      confirmButtonText: "Simpan",
      focusConfirm: false,
      preConfirm: () => {
        const title = document.getElementById("swal-title").value;
        const location = document.getElementById("swal-location").value;
        const price = Number(document.getElementById("swal-price").value);
        if (!title || !location || !price) {
          Swal.showValidationMessage("Semua kolom harus diisi!");
          return false;
        }
        return { title, location, price };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        setProperties((prev) =>
          prev.map((p) =>
            p.id === id ? { ...p, ...result.value } : p
          )
        );
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: `Properti "${result.value.title}" telah diperbarui.`,
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  const handleDelete = (id) => {
    const target = properties.find((p) => p.id === id);
    Swal.fire({
      title: `Hapus "${target.title}"?`,
      text: "Tindakan ini tidak dapat dibatalkan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
    }).then((result) => {
      if (result.isConfirmed) {
        setProperties((prev) => prev.filter((p) => p.id !== id));
        Swal.fire({
          title: "Dihapus!",
          text: `Properti "${target.title}" telah dihapus.`,
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  const pendingProperties = properties.filter((p) => p.status === "pending");
  const approvedAdmin = properties.filter((p) => p.status === "approved" && p.ownerId === adminId);
  const approvedUser = properties.filter((p) => p.status === "approved" && p.ownerId !== adminId);

  return (
    <div className={styles.container}>
      <h2>Kelola Properti Admin</h2>

      {/* === BAGIAN PENDING === */}
      <section className={styles.section}>
        <h3>Properti Pending</h3>
        {pendingProperties.length === 0 ? (
          <p className={styles.empty}>Tidak ada properti pending.</p>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Judul</th>
                  <th>Jenis</th>
                  <th>Tipe</th>
                  <th>Lokasi</th>
                  <th>Harga</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {pendingProperties.map((p, index) => (
                  <motion.tr
                    key={p.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <td>{index + 1}</td>
                    <td>{p.title}</td>
                    <td>{p.jenis}</td>
                    <td>{p.tipe}</td>
                    <td>{p.location}</td>
                    <td>{p.price.toLocaleString()}</td>
                    <td className={styles.actions}>
                      <button className={`${styles.iconBtn} ${styles.edit}`} onClick={() => handleEdit(p.id)}>
                        <FaEdit />
                      </button>
                      <button className={`${styles.iconBtn} ${styles.delete}`} onClick={() => handleDelete(p.id)}>
                        <FaTrash />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* === BAGIAN APPROVED DENGAN TOGGLE === */}
      <section className={styles.section}>
        <div className={styles.headerToggle}>
          <h3>Properti Disetujui</h3>
          <div className={styles.toggleGroup}>
            <button
              onClick={() => setView("admin")}
              className={`${styles.toggleBtn} ${view === "admin" ? styles.active : ""}`}
            >
              Admin
            </button>
            <button
              onClick={() => setView("user")}
              className={`${styles.toggleBtn} ${view === "user" ? styles.active : ""}`}
            >
              User
            </button>
          </div>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>No</th>
                <th>Judul</th>
                <th>Jenis</th>
                <th>Tipe</th>
                <th>Lokasi</th>
                <th>Harga</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {(view === "admin" ? approvedAdmin : approvedUser).map((p, index) => (
                <motion.tr
                  key={p.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <td>{index + 1}</td>
                  <td>{p.title}</td>
                  <td>{p.jenis}</td>
                  <td>{p.tipe}</td>
                  <td>{p.location}</td>
                  <td>{p.price.toLocaleString()}</td>
                  <td className={styles.actions}>
                    <button className={`${styles.iconBtn} ${styles.edit}`} onClick={() => handleEdit(p.id)}>
                      <FaEdit />
                    </button>
                    <button className={`${styles.iconBtn} ${styles.delete}`} onClick={() => handleDelete(p.id)}>
                      <FaTrash />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default KelolaPropertiAdminContent;
