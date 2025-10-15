import React, { useState, useEffect, useContext } from "react";
import Swal from "sweetalert2";
import { ThemeContext } from "../DashboardAdmin";
import axios from "axios";
import { FaCheck, FaClock, FaUndo, FaBan, FaInfoCircle } from "react-icons/fa";
import TabelUserAktif from "./tables/TabelUserAktif";
import TabelUserSuspend from "./tables/TabelUserSuspend";
import TabelUserBanned from "./tables/TabelUserBanned";
import ModalUser from "./ModalUser";
import styles from "./KelolaUserContent.module.css";

const ITEMS_PER_PAGE = 5;

const KelolaUserContent = () => {
  const { theme } = useContext(ThemeContext);

  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [viewVerified, setViewVerified] = useState("user");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, propRes] = await Promise.all([
          axios.get("http://localhost:3004/users"),
          axios.get("http://localhost:3004/properties"),
        ]);
        setUsers(userRes.data.map(u => ({ ...u, verified: u.verified === true })));
        setProperties(propRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const today = new Date();
  const filteredUsers = users
    .filter(u => u.role !== "admin")
    .filter(u => (viewVerified === "verified" ? u.verified : !u.verified))
    .filter(u =>
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.nama?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const activeUsers = filteredUsers.filter(u => !u.banned && (!u.suspend || new Date(u.suspend) < today));
  const suspendUsers = filteredUsers.filter(u => u.suspend && new Date(u.suspend) >= today && !u.banned);
  const bannedUsers = filteredUsers.filter(u => u.banned);

  // ----- ACTIONS -----
  const updateUser = async (id, updatedFields, successMsg) => {
    const target = users.find(u => u.id === id);
    if (!target) return;
    try {
      const updatedUser = { ...target, ...updatedFields };
      await axios.put(`http://localhost:3004/users/${id}`, updatedUser);
      setUsers(prev => prev.map(u => u.id === id ? updatedUser : u));
      Swal.fire("Berhasil!", successMsg, "success");
    } catch (err) {
      Swal.fire("Error!", "Gagal update user.", "error");
    }
  };

  const handleVerify = id => {
    const target = users.find(u => u.id === id);
    Swal.fire({
      title: `Verifikasi "${target.username}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, verifikasi",
      cancelButtonText: "Batal",
      confirmButtonColor: "#28a745",
    }).then(res => res.isConfirmed && updateUser(id, { verified: true }, "User telah diverifikasi."));
  };

  const handleSuspend = id => {
    const target = users.find(u => u.id === id);
    Swal.fire({
      title: `Suspend "${target.username}" berapa lama?`,
      input: "text",
      inputPlaceholder: "YYYY-MM-DD",
      showCancelButton: true,
      confirmButtonText: "Suspend",
      cancelButtonText: "Batal",
      confirmButtonColor: "#ffc107",
    }).then(res => {
      if (res.isConfirmed && res.value) updateUser(id, { suspend: res.value }, `User disuspend hingga ${res.value}`);
    });
  };

  const handleUnSuspend = id => updateUser(id, { suspend: null }, "User unsuspend.");

  const handleBanned = id => {
    const target = users.find(u => u.id === id);
    Swal.fire({
      title: `Banned "${target.username}"?`,
      icon: "error",
      showCancelButton: true,
      confirmButtonText: "Ya, banned",
      cancelButtonText: "Batal",
      confirmButtonColor: "#dc3545",
    }).then(res => res.isConfirmed && updateUser(id, { banned: true }, "User telah dibanned."));
  };

  const handleDetail = user => {
    const userProps = properties.filter(p => p.ownerId === user.id);
    setSelectedUser({ ...user });
    setModalOpen(true);
  };

  // ----- ACTION ICONS -----
  const actionsForActive = user => (
    <>
      {!user.verified && <button className={styles.verifyBtn} onClick={() => handleVerify(user.id)}><FaCheck /></button>}
      <button className={styles.suspendBtn} onClick={() => handleSuspend(user.id)}><FaClock /></button>
      <button className={styles.bannedBtn} onClick={() => handleBanned(user.id)}><FaBan /></button>
      <button className={styles.detailBtn} onClick={() => handleDetail(user)}><FaInfoCircle /></button>
    </>
  );

  const actionsForSuspend = user => (
    <>
      <button className={styles.unsuspendBtn} onClick={() => handleUnSuspend(user.id)}><FaUndo /></button>
      <button className={styles.bannedBtn} onClick={() => handleBanned(user.id)}><FaBan /></button>
      <button className={styles.detailBtn} onClick={() => handleDetail(user)}><FaInfoCircle /></button>
    </>
  );

  const actionsForBanned = user => (
    <button className={styles.detailBtn} onClick={() => handleDetail(user)}><FaInfoCircle /></button>
  );

  return (
    <div className={`${styles.container} ${theme==="dark"?styles.dark:""}`}>
      <div className={styles.header}><h2>Kelola User</h2></div>
      <div className={styles.controls}>
        <input type="text" placeholder="Cari user..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} className={styles.searchInput}/>
        <div className={styles.toggleContainer}>
          <span><b>Unverified</b></span>
          <label>
            <input type="checkbox" checked={viewVerified==="verified"} onChange={()=>setViewVerified(viewVerified==="verified"?"user":"verified")}/>
            <div className={styles.slider}><div className={styles.sliderBall}></div></div>
          </label>
          <span><b>Verified</b></span>
        </div>
      </div>

      <TabelUserAktif users={activeUsers} properties={properties} actions={actionsForActive} theme={theme} />
      <TabelUserSuspend users={suspendUsers} properties={properties} actions={actionsForSuspend} theme={theme} />
      <TabelUserBanned users={bannedUsers} properties={properties} actions={actionsForBanned} theme={theme} />

      {modalOpen && <ModalUser open={modalOpen} onClose={()=>setModalOpen(false)} user={selectedUser} properties={properties.filter(p => p.ownerId === selectedUser.id)} theme={theme} />}
    </div>
  );
};

export default KelolaUserContent;
