import React, { useState } from "react";
import { FaCheck, FaTimes, FaTrash, FaEdit } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import styles from "./KelolaPropertiContent.module.css";

const propertiesData = [
  { id: 1, title: "Rumah Minimalis", jenis: "Jual", tipe: "Rumah", location: "Tarogong", price: 350000000, periode: "1 tahun", status: "approved", owner: "Admin", ownerId: 1 },
  { id: 2, title: "Kost Mahasiswa Cibatu", jenis: "Sewa", tipe: "Kost", location: "Cibatu", price: 1200000, periode: "1 bulan", status: "pending", owner: "Budi", ownerId: 2 },
  { id: 3, title: "Vila Eksklusif Cikajang", jenis: "Cicilan", tipe: "Villa", location: "Cikajang", price: 1500000000, periode: "2 tahun", status: "approved", owner: "Citra", ownerId: 3 },
  { id: 4, title: "Ruko Strategis Tarogong", jenis: "Dijual", tipe: "Ruko", location: "Tarogong", price: 850000000, periode: "-", status: "approved", owner: "Andi", ownerId: 2 },
  { id: 5, title: "Rumah 3 Kamar Garut Kota", jenis: "Sewa", tipe: "Rumah", location: "Garut Kota", price: 2500000, periode: "3 bulan", status: "pending", owner: "Dina", ownerId: 4 },
  { id: 6, title: "Ruko Modern Garut", jenis: "Jual", tipe: "Ruko", location: "Garut Kota", price: 950000000, periode: "-", status: "approved", owner: "Admin", ownerId: 1 },
  { id: 7, title: "Rumah Mewah Tarogong", jenis: "Cicilan", tipe: "Rumah", location: "Tarogong", price: 1200000000, periode: "3 tahun", status: "pending", owner: "Eka", ownerId: 5 },
  { id: 8, title: "Kost Putri Cibatu", jenis: "Sewa", tipe: "Kost", location: "Cibatu", price: 1500000, periode: "1 bulan", status: "approved", owner: "Admin", ownerId: 1 },
  { id: 9, title: "Vila Pantai Cikajang", jenis: "Cicilan", tipe: "Villa", location: "Cikajang", price: 2000000000, periode: "2 tahun", status: "pending", owner: "Fajar", ownerId: 6 },
  { id: 10, title: "Rumah Keluarga Garut Kota", jenis: "Jual", tipe: "Rumah", location: "Garut Kota", price: 450000000, periode: "1 tahun", status: "approved", owner: "Admin", ownerId: 1 },
  { id: 11, title: "Ruko Strategis Cibatu", jenis: "Dijual", tipe: "Ruko", location: "Cibatu", price: 780000000, periode: "-", status: "pending", owner: "Gina", ownerId: 7 },
  { id: 12, title: "Rumah Minimalis Cikajang", jenis: "Sewa", tipe: "Rumah", location: "Cikajang", price: 1800000, periode: "6 bulan", status: "approved", owner: "Admin", ownerId: 1 },
  { id: 13, title: "Vila Eksklusif Garut Kota", jenis: "Cicilan", tipe: "Villa", location: "Garut Kota", price: 1750000000, periode: "2 tahun", status: "pending", owner: "Hadi", ownerId: 8 },
  { id: 14, title: "Kost Mahasiswa Tarogong", jenis: "Sewa", tipe: "Kost", location: "Tarogong", price: 1000000, periode: "1 bulan", status: "approved", owner: "Admin", ownerId: 1 },
  { id: 15, title: "Rumah 2 Lantai Garut Kota", jenis: "Jual", tipe: "Rumah", location: "Garut Kota", price: 600000000, periode: "1 tahun", status: "pending", owner: "Intan", ownerId: 9 }
];

const ITEMS_PER_PAGE = 5;
const adminId = 1;

const KelolaPropertiContent = () => {
  const [properties, setProperties] = useState(propertiesData);
  const [currentPagePending, setCurrentPagePending] = useState(1);
  const [currentPageApproved, setCurrentPageApproved] = useState(1);
  const [approvedView, setApprovedView] = useState("user"); // default User

  const pendingProperties = properties.filter(p => p.status === "pending");
  const approvedProperties = properties.filter(p => p.status === "approved");

  // ---------------- Aksi ----------------
  const handleApprove = id => { /* sama seperti sebelumnya */ };
  const handleReject = id => { /* sama seperti sebelumnya */ };
  const handleDelete = id => { /* sama seperti sebelumnya */ };
  const handleEdit = id => { /* sama seperti sebelumnya */ };

  // ---------------- Pagination ----------------
  const paginate = (list, page) => {
    const start = (page-1)*ITEMS_PER_PAGE;
    return list.slice(start, start+ITEMS_PER_PAGE);
  };
  const renderPagination = (totalItems, currentPage, setPage) => { /* sama seperti sebelumnya */ };

  // ---------------- Table Render ----------------
const renderTable = (list, isPending = false) => (
  <div className={styles.tableWrapper}>
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
          <th>Status</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody>
        <AnimatePresence>
          {list.map((prop, idx) => (
            <motion.tr
              key={prop.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              layout
            >
              <td>
                {idx + 1 + (isPending ? (currentPagePending - 1) * ITEMS_PER_PAGE : (currentPageApproved - 1) * ITEMS_PER_PAGE)}
              </td>
              <td>{prop.title}</td>
              <td>{prop.jenis}</td>
              <td>{prop.tipe}</td>
              <td>{prop.location}</td>
              <td>{prop.price.toLocaleString()}</td>
              <td>{prop.periode}</td>
              <td>{prop.owner}</td>
              <td className={styles.statusCell}>
                <div className={styles.statusIcon}>
                  {prop.status === "approved" 
                    ? <FaCheck className={styles.approved} /> 
                    : <FaTimes className={styles.pending} />}
                </div>
              </td>
              <td className={styles.actions}>
                {isPending ? (
                  <>
                    <button
                      className={styles.iconBtn}
                      onClick={() => handleApprove(prop.id)}
                      title="Approve"
                    >
                      <FaCheck style={{ color: "#28a745" }} />
                    </button>
                    <button
                      className={styles.iconBtn}
                      onClick={() => handleReject(prop.id)}
                      title="Reject"
                    >
                      <FaTimes style={{ color: "#ffc107" }} />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className={styles.iconBtn}
                      onClick={() => handleEdit(prop.id)}
                      title="Edit"
                    >
                      <FaEdit style={{ color: "#0d6efd" }} />
                    </button>
                    <button
                      className={styles.iconBtn}
                      onClick={() => handleDelete(prop.id)}
                      title="Delete"
                    >
                      <FaTrash style={{ color: "#dc3545" }} />
                    </button>
                  </>
                )}
              </td>
            </motion.tr>
          ))}
        </AnimatePresence>
      </tbody>
    </table>
  </div>
);

  // ---------------- Filter Approved ----------------
  const filteredApproved = approvedProperties.filter(
    p => approvedView==="admin" ? p.ownerId===adminId : p.ownerId!==adminId
  );

  return (
    <div className={styles.container}>
      {/* Pending Section */}
      <div className={styles.section}>
        <p className={styles.subHeader}>Properti Menunggu Persetujuan ({pendingProperties.length})</p>
        {renderTable(paginate(pendingProperties,currentPagePending), true)}
        {renderPagination(pendingProperties.length, currentPagePending, setCurrentPagePending)}
      </div>

      {/* Approved Section */}
      <div className={styles.section}>
        <div className={styles.header}>
          <p className={styles.subHeader}>Properti Disetujui ({filteredApproved.length})</p>
          <div className={styles.toggleContainer}>
            <span>User</span>
            <label className={styles.switch}>
              <input
                type="checkbox"
                checked={approvedView === "admin"}
                onChange={() => setApprovedView(approvedView === "user" ? "admin" : "user")}
              />
              <span className={styles.slider}></span>
            </label>
            <span>Admin</span>
          </div>
        </div>

        {renderTable(paginate(filteredApproved, currentPageApproved))}
        {renderPagination(filteredApproved.length, currentPageApproved, setCurrentPageApproved)}
      </div>
    </div>
  );
};

export default KelolaPropertiContent;
