// src/pages/admin/content/HomeContent.jsx
import React, { useContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUsers, FaBuilding, FaClock, FaCheckCircle, FaBell } from "react-icons/fa";
import { io } from "socket.io-client";
import styles from "./HomeContent.module.css";
import { ThemeContext } from "../DashboardAdmin";
import { API_URL } from "../../../utils/constant";
import StatCard from "./components/StatCard";

const parseCustomDate = (str) => {
  if (!str) return null;
  const parts = str.split(/[\s/:]+/);
  // new Date(year, monthIndex, day, hours, minutes, seconds)
  return new Date(parts[2], parts[1] - 1, parts[0], parts[3], parts[4], parts[5]);
};

const HomeContent = () => {
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUser: 0, totalProperti: 0, propertiPending: 0, propertiApproved: 0,
  });
  const [notifications, setNotifications] = useState([]);
  const today = new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

  const fetchData = useCallback(async () => {
    try {
      const [usersRes, propsRes] = await Promise.all([
        fetch(`${API_URL}users`),
        fetch(`${API_URL}properties`)
      ]);
      if (!usersRes.ok || !propsRes.ok) throw new Error("Gagal mengambil data");
      
      const users = await usersRes.json();
      const props = await propsRes.json();

      setStats({
        totalUser: users.filter(u => u.role === "user").length,
        totalProperti: props.length,
        propertiPending: props.filter(p => p.statusPostingan === "pending").length,
        propertiApproved: props.filter(p => p.statusPostingan === "approved").length,
      });

      const notifUsers = users.filter(u => u.role === "user").map(u => ({
        id: `u${u.id}`, text: `User ${u.username} telah bergabung`, timestamp: parseCustomDate(u.joinedAt) || new Date(), type: "user",
      }));
      const notifProps = props.filter(p => p.statusPostingan === "pending").map(p => ({
        id: `p${p.id}`, text: `User ${users.find(u => u.id === p.ownerId)?.username || "?"} meminta pengajuan properti "${p.namaProperti || "?"}"`, timestamp: parseCustomDate(p.postedAt) || new Date(), type: "property",
      }));
      
      setNotifications([...notifUsers, ...notifProps].sort((a, b) => b.timestamp - a.timestamp).slice(0, 5));
    } catch (err) {
      console.error("Error fetch HomeContent:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const socket = io("http://localhost:3005");
    socket.on("userUpdate", fetchData);
    socket.on("propertyUpdate", fetchData);
    return () => socket.disconnect();
  }, [fetchData]);

  const handleNotifClick = (notif) => {
    if (notif.type === "user") navigate("/admin/user");
    else if (notif.type === "property") navigate("/admin/properti");
  };

  if (isLoading) {
    return (
      <div className={styles.spinnerContainer}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className={styles.header}>
          <div>
            <h2>Selamat Datang, Admin</h2>
            <p>{today}</p>
          </div>
        </div>

        <div className={styles.statsGrid}>
          <StatCard icon={<FaUsers />} title="Total User" value={stats.totalUser} colorClass="user" />
          <StatCard icon={<FaBuilding />} title="Total Properti" value={stats.totalProperti} colorClass="properti" />
          <StatCard icon={<FaClock />} title="Properti Pending" value={stats.propertiPending} colorClass="pending" />
          <StatCard icon={<FaCheckCircle />} title="Disetujui" value={stats.propertiApproved} colorClass="approved" />
        </div>

        <div className={styles.notificationsCard}>
          <div className={styles.cardHeader}>
            <FaBell />
            <h5>Notifikasi Aktivitas</h5>
          </div>
          <div className={styles.notifList}>
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <div key={notif.id} className={styles.notifRow} onClick={() => handleNotifClick(notif)}>
                  <span className={styles.notifTimestamp}>
                    {notif.timestamp ? new Date(notif.timestamp).toLocaleString("id-ID", { hour: '2-digit', minute: '2-digit' }) : "-"}
                  </span>
                  <p className={styles.notifContent}>{notif.text}</p>
                </div>
              ))
            ) : (
              <div className={styles.emptyState}>Tidak ada notifikasi terbaru.</div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HomeContent;