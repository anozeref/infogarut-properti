import React, { useState } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { FaEdit, FaTrash } from "react-icons/fa";
import styles from "./KelolaPropertiAdminContent.module.css";

// Dummy data
const propertiesData = [
  { id: 1, title: "Rumah Minimalis", jenis: "Jual", tipe: "Rumah", location: "Tarogong", price: 350000000, ownerId: 1, status: "approved" },
  { id: 2, title: "Kost Mahasiswa", jenis: "Sewa", tipe: "Kost", location: "Cibatu", price: 1200000, ownerId: 2, status: "pending" },
  { id: 3, title: "Vila Eksklusif", jenis: "Cicilan", tipe: "Villa", location: "Cikajang", price: 1500000000, ownerId: 1, status: "approved" },
];

const KelolaPropertiAdminContent = () => {
  const [properties, setProperties] = useState(propertiesData);
  const adminId = 1;

  const handleEdit = (id) => {
    Swal.fire("Edit Properti", `Properti ID ${id} diedit`, "info");
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

  const adminProperties = properties.filter((p) => p.ownerId === adminId);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Kelola Properti Admin</h2>
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
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {adminProperties.map((p, index) => (
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
                <td className={`${styles.status} ${p.status}`}>{p.status === "approved" ? "Disetujui" : "Menunggu"}</td>
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
    </div>
  );
};

export default KelolaPropertiAdminContent;
