import React, { useState } from "react";
import styles from "./KelolaPropertiAdminContent.module.css";

// Dummy data
const propertiesData = [
  { id: 1, title: "Rumah Minimalis", jenis: "Jual", tipe: "Rumah", location: "Tarogong", price: 350000000, ownerId: 1, status: "approved" },
  { id: 2, title: "Kost Mahasiswa", jenis: "Sewa", tipe: "Kost", location: "Cibatu", price: 1200000, ownerId: 2, status: "pending" },
  { id: 3, title: "Vila Eksklusif", jenis: "Cicilan", tipe: "Villa", location: "Cikajang", price: 1500000000, ownerId: 1, status: "approved" },
];

const KelolaPropertiAdminContent = () => {
  const [properties, setProperties] = useState(propertiesData);
  const adminId = 1; // ID admin

  const handleEdit = (id) => alert(`Edit Properti ID ${id}`);
  const handleDelete = (id) => alert(`Hapus Properti ID ${id}`);

  return (
    <div className={styles.container}>
      <h2>Kelola Properti Admin</h2>
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
          {properties
            .filter((p) => p.ownerId === adminId) // hanya properti admin
            .map((p, index) => (
              <tr key={p.id}>
                <td>{index + 1}</td>
                <td>{p.title}</td>
                <td>{p.jenis}</td>
                <td>{p.tipe}</td>
                <td>{p.location}</td>
                <td>{p.price.toLocaleString()}</td>
                <td>{p.status}</td>
                <td>
                  <button onClick={() => handleEdit(p.id)} className={styles.editBtn}>✏️ Edit</button>
                  <button onClick={() => handleDelete(p.id)} className={styles.deleteBtn}>🗑️ Delete</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default KelolaPropertiAdminContent;
