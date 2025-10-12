import React, { useState } from "react";
import { FaCheck, FaTimes, FaTrash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import styles from "./KelolaPropertiContent.module.css";

const propertiesData = [
  { id: 1, title: "Kost Mahasiswa Cibatu", jenis: "Sewa", tipe: "Kost", location: "Cibatu", price: 1200000, periode: "1 bulan", status: "pending", owner: "Budi" },
  { id: 2, title: "Ruko Strategis Tarogong", jenis: "Dijual", tipe: "Ruko", location: "Tarogong", price: 850000000, periode: "-", status: "approved", owner: "Andi" },
  { id: 3, title: "Rumah Minimalis Tarogong", jenis: "Cicilan", tipe: "Rumah", location: "Tarogong", price: 350000000, periode: "1 tahun", status: "pending", owner: "Andi" },
  { id: 4, title: "Vila Eksklusif Cikajang", jenis: "Cicilan", tipe: "Villa", location: "Cikajang", price: 1500000000, periode: "2 tahun", status: "approved", owner: "Citra" },
  { id: 5, title: "Rumah 3 Kamar Garut Kota", jenis: "Sewa", tipe: "Rumah", location: "Garut Kota", price: 2500000, periode: "3 bulan", status: "pending", owner: "Dina" },
];

const ITEMS_PER_PAGE = 5;

const KelolaPropertiContent = () => {
  const [properties, setProperties] = useState(propertiesData);
  const [currentPagePending, setCurrentPagePending] = useState(1);
  const [currentPageApproved, setCurrentPageApproved] = useState(1);

  const pendingProperties = properties.filter(p => p.status === "pending");
  const approvedProperties = properties.filter(p => p.status === "approved");

  // Actions
  const handleApprove = id => {
    const target = properties.find(p => p.id === id);
    Swal.fire({
      title: `Setujui "${target.title}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Batal",
      confirmButtonColor: "#28a745"
    }).then(result => {
      if(result.isConfirmed){
        setProperties(prev => prev.map(p => p.id===id ? {...p, status:"approved"} : p));
        Swal.fire({title:"Disetujui!", icon:"success", timer:1200, showConfirmButton:false});
      }
    });
  };

  const handleReject = id => {
    const target = properties.find(p => p.id === id);
    Swal.fire({
      title: `Tolak "${target.title}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Tolak",
      cancelButtonText: "Batal",
      confirmButtonColor: "#dc3545"
    }).then(result => {
      if(result.isConfirmed){
        setProperties(prev => prev.filter(p => p.id!==id));
        Swal.fire({title:"Ditolak!", icon:"success", timer:1200, showConfirmButton:false});
      }
    });
  };

  const handleDelete = id => {
    const target = properties.find(p => p.id === id);
    Swal.fire({
      title: `Hapus "${target.title}"?`,
      icon: "error",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#dc3545"
    }).then(result => {
      if(result.isConfirmed){
        setProperties(prev => prev.filter(p => p.id!==id));
        Swal.fire({title:"Dihapus!", icon:"success", timer:1200, showConfirmButton:false});
      }
    });
  };

  const paginate = (list, page) => {
    const start = (page-1)*ITEMS_PER_PAGE;
    return list.slice(start, start+ITEMS_PER_PAGE);
  };

  const renderPagination = (totalItems, currentPage, setPage) => {
    const totalPages = Math.ceil(totalItems/ITEMS_PER_PAGE);
    if(totalPages<=1) return null;
    const pages = Array.from({length: totalPages}, (_,i)=>i+1);
    return (
      <div className={styles.pagination}>
        <button onClick={()=>setPage(Math.max(1,currentPage-1))} disabled={currentPage===1} className={styles.pageBtn}>‹</button>
        {pages.map(p=>(
          <button key={p} onClick={()=>setPage(p)} disabled={p===currentPage} className={`${styles.pageBtn} ${p===currentPage?styles.activePage:""}`}>{p}</button>
        ))}
        <button onClick={()=>setPage(Math.min(totalPages,currentPage+1))} disabled={currentPage===totalPages} className={styles.pageBtn}>›</button>
      </div>
    )
  };

  const renderTable = (list, isPending=false) => (
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
            {list.map((prop, idx)=>(
              <motion.tr key={prop.id} initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}} layout>
                <td>{idx+1 + (isPending?(currentPagePending-1)*ITEMS_PER_PAGE:(currentPageApproved-1)*ITEMS_PER_PAGE)}</td>
                <td>{prop.title}</td>
                <td>{prop.jenis}</td>
                <td>{prop.tipe}</td>
                <td>{prop.location}</td>
                <td>{prop.price.toLocaleString()}</td>
                <td>{prop.periode}</td>
                <td>{prop.owner}</td>

                {/* STATUS */}
                <td className={styles.statusCell}>
                  <div className={styles.statusIcon}>
                    {prop.status==="approved"?<FaCheck className={styles.approved}/>:<FaTimes className={styles.pending}/>}
                  </div>
                </td>

                {/* ACTIONS */}
                <td className={styles.actions}>
                  {isPending ? (
                    <>
                      <button className={styles.iconBtn} onClick={()=>handleApprove(prop.id)} title="Approve"><FaCheck style={{color:"#28a745"}}/></button>
                      <button className={styles.iconBtn} onClick={()=>handleReject(prop.id)} title="Reject"><FaTimes style={{color:"#ffc107"}}/></button>
                    </>
                  ) : (
                    <button className={styles.iconBtn} onClick={()=>handleDelete(prop.id)} title="Delete"><FaTrash style={{color:"#dc3545"}}/></button>
                  )}
                </td>

              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Kelola Properti</h2>
      </div>

      <div className={styles.section}>
        <p className={styles.subHeader}>Properti Menunggu Persetujuan ({pendingProperties.length})</p>
        {renderTable(paginate(pendingProperties,currentPagePending), true)}
        {renderPagination(pendingProperties.length, currentPagePending, setCurrentPagePending)}
      </div>

      <div className={styles.section}>
        <p className={styles.subHeader}>Properti Disetujui ({approvedProperties.length})</p>
        {renderTable(paginate(approvedProperties,currentPageApproved))}
        {renderPagination(approvedProperties.length, currentPageApproved, setCurrentPageApproved)}
      </div>
    </div>
  );
};

export default KelolaPropertiContent;
