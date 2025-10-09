import React, { useState } from "react";
import styles from "./KelolaPropertiContent.module.css";

// Dummy data sesuai final tabel
const propertiesData = [
  { id: 1, title: "Kost Mahasiswa Cibatu", jenis: "Sewa", tipe: "Kost", location: "Cibatu", price: 1200000, periode: "1 bulan", status: "pending", owner: "Budi" },
  { id: 2, title: "Ruko Strategis Tarogong", jenis: "Dijual", tipe: "Ruko", location: "Tarogong", price: 850000000, periode: "-", status: "approved", owner: "Andi" },
  { id: 3, title: "Rumah Minimalis Tarogong", jenis: "Cicilan", tipe: "Rumah", location: "Tarogong", price: 350000000, periode: "1 tahun", status: "pending", owner: "Andi" },
  { id: 4, title: "Vila Eksklusif Cikajang", jenis: "Cicilan", tipe: "Villa", location: "Cikajang", price: 1500000000, periode: "2 tahun", status: "approved", owner: "Citra" },
  { id: 5, title: "Rumah 3 Kamar Garut Kota", jenis: "Sewa", tipe: "Rumah", location: "Garut Kota", price: 2500000, periode: "3 bulan", status: "pending", owner: "Dina" },
];

const KelolaPropertiContent = () => {
  const [properties, setProperties] = useState(propertiesData);

  const handleApprove = (id) => {
    alert(`Properti ID ${id} disetujui!`);
  };

  const handleDelete = (id) => {
    alert(`Properti ID ${id} dihapus!`);
  };

  const pendingProperties = properties.filter((p) => p.status === "pending");
  const approvedProperties = properties.filter((p) => p.status === "approved");

  const renderTable = (list, isPending = false) => (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>No</th>
          <th>Judul Properti</th>
          <th>Jenis</th>
          <th>Tipe</th>
          <th>Lokasi</th>
          <th>Harga</th>
          <th>Periode</th>
          <th>Owner</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody>
        {list.map((prop, index) => (
          <tr
            key={prop.id}
            className={prop.status === "pending" ? styles.pendingRow : styles.approvedRow}
          >
            <td>{index + 1}</td>
            <td>{prop.title}</td>
            <td>{prop.jenis}</td>
            <td>{prop.tipe}</td>
            <td>{prop.location}</td>
            <td>{prop.price.toLocaleString()}</td>
            <td>{prop.periode}</td>
            <td>{prop.owner}</td>
            <td>
              {isPending && (
                <button onClick={() => handleApprove(prop.id)} className={styles.approveBtn}>
                  ✅ Approve
                </button>
              )}
              <button onClick={() => handleDelete(prop.id)} className={styles.deleteBtn}>
                🗑️ Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className={styles.container}>
      <h2>Kelola Properti</h2>

      <div className={styles.section}>
        <h3>Properti Pending ({pendingProperties.length})</h3>
        {renderTable(pendingProperties, true)}
      </div>

      <div className={styles.section}>
        <h3>Properti Disetujui ({approvedProperties.length})</h3>
        {renderTable(approvedProperties)}
      </div>
    </div>
  );
};

export default KelolaPropertiContent;
