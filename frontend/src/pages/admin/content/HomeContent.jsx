// src/pages/admin/content/HomeContent.jsx
import React, { useContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUsers, FaBuilding, FaClock, FaCheckCircle, FaBell } from "react-icons/fa";
import { io } from "socket.io-client";
import styles from "./HomeContent.module.css";
import { ThemeContext } from "../DashboardAdmin";
import { API_URL } from "../../../utils/constant";
import StatCard from "./components/HomeContent/StatCard";

/**
 * Parses a date string that could be in "DD/MM/YYYY HH:mm:ss" format or ISO 8601.
 * @param {string} dateString The date string to parse.
 * @returns {Date} A Date object. Returns current date as a fallback.
 */
const smartParseDate = (dateString) => {
  if (!dateString) return new Date();

  // Handle custom "DD/MM/YYYY HH:mm:ss" format
  if (dateString.includes('/')) {
    const parts = dateString.split(/[\s/:]+/);
    // new Date(year, monthIndex, day, hours, minutes, seconds)
    return new Date(parts[2], parts[1] - 1, parts[0], parts[3] || 0, parts[4] || 0, parts[5] || 0);
  }
  
  // Handle other standard formats like ISO 8601
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? new Date() : date; // Fallback for invalid formats
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
        id: `u${u.id}`, text: `User ${u.username} telah bergabung`, timestamp: smartParseDate(u.joinedAt), type: "user",
      }));
      const notifProps = props.filter(p => p.statusPostingan === "pending").map(p => ({
        id: `p${p.id}`, text: `User ${users.find(u => u.id === p.ownerId)?.username || "?"} meminta pengajuan properti "${p.namaProperti || "?"}"`, timestamp: smartParseDate(p.postedAt), type: "property",
      }));
      
      // Sort all notifications, then take the top 5
      setNotifications([...notifUsers, ...notifProps].sort((a, b) => b.timestamp - a.timestamp).slice(0, 5));
    } catch (err) {
      console.error("Error fetch HomeContent:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    // Ganti URL socket io jika diperlukan
    const socket = io("http://localhost:3005");
    socket.on("userUpdate", fetchData);
    socket.on("propertyUpdate", fetchData);
    return () => socket.disconnect();
  }, [fetchData]);

  const handleNotifClick = (notif) => {
    if (notif.type === "user") navigate("/admin/user");
    else if (notif.type === "property") navigate("/admin/properti");
  };
  
  const formatDateSeparator = (date) => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dateObj = new Date(date);

    if (dateObj.toDateString() === today.toDateString()) return "Hari Ini";
    if (dateObj.toDateString() === yesterday.toDateString()) return "Kemarin";
    return dateObj.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  };

  if (isLoading) {
    return (
      <div className={styles.spinnerContainer}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  let lastDate = null;

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
              notifications.map((notif) => {
                const currentDate = new Date(notif.timestamp).toDateString();
                const showDateSeparator = currentDate !== lastDate;
                lastDate = currentDate;

                return (
                  <React.Fragment key={notif.id}>
                    {showDateSeparator && (
                      <div className={styles.notifDateSeparator}>
                        {formatDateSeparator(notif.timestamp)}
                      </div>
                    )}
                    <div className={styles.notifRow} onClick={() => handleNotifClick(notif)}>
                      <span className={styles.notifTimestamp}>
                        {notif.timestamp ? new Date(notif.timestamp).toLocaleString("id-ID", { hour: '2-digit', minute: '2-digit' }) : "-"}
                      </span>
                      <p className={styles.notifContent}>{notif.text}</p>
                    </div>
                  </React.Fragment>
                );
              })
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