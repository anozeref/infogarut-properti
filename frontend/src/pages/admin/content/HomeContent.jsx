import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUsers, FaBuilding, FaClock, FaCheckCircle, FaBell } from "react-icons/fa";
import styles from "./HomeContent.module.css";
import { ThemeContext } from "../DashboardAdmin";
import { API_URL } from "../../../utils/constant";

// Parse tanggal DD/MM/YYYY HH:mm:ss ke Date
const parseCustomDate = (str) => {
  if (!str) return null;
  const [day, month, yearTime] = str.split("/");
  const [year, time] = yearTime.split(" ");
  return new Date(`${year}-${month}-${day}T${time}`);
};

const HomeContent = () => {
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUser: 0,
    totalProperti: 0,
    propertiPending: 0,
    propertiApproved: 0,
  });
  const [notifications, setNotifications] = useState([]);

  const today = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersRes = await fetch(`${API_URL}users`);
        if (!usersRes.ok) throw new Error("Failed to fetch users");
        const users = await usersRes.json();

        const propsRes = await fetch(`${API_URL}properties`);
        if (!propsRes.ok) throw new Error("Failed to fetch properties");
        const props = await propsRes.json();

        // Statistik
        const totalUsers = users.filter(u => u.role === "user").length;
        const pending = props.filter(p => p.statusPostingan === "pending").length;
        const approved = props.filter(p => p.statusPostingan === "approved").length;

        setStats({
          totalUser: totalUsers,
          totalProperti: props.length,
          propertiPending: pending,
          propertiApproved: approved,
        });

        // Notifikasi user baru
        const notifUsers = users
          .filter(u => u.role === "user")
          .map(u => ({
            id: `u${u.id}`,
            text: `User ${u.username} telah bergabung`,
            timestamp: parseCustomDate(u.joinedAt) || new Date(),
            type: "user",
            targetId: u.id,
          }));

        // Notifikasi properti pending
        const notifProps = props
          .filter(p => p.statusPostingan === "pending")
          .map(p => ({
            id: `p${p.id}`,
            text: `User ${users.find(u => u.id === p.ownerId)?.username || "tidak diketahui"} meminta pengajuan penjualan properti "${p.namaProperti || "tidak diketahui"}"`,
            timestamp: parseCustomDate(p.postedAt) || new Date(),
            type: "property",
            targetId: p.id,
          }));

        // Gabung, urut terbaru, ambil 5 item
        const allNotif = [...notifUsers, ...notifProps]
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, 5);

        setNotifications(allNotif);
      } catch (err) {
        console.error("Error fetch HomeContent:", err);
      }
    };

    fetchData();
  }, []);

  const handleNotifClick = (notif) => {
    if (notif.type === "user") {
      navigate("/admin/user");
    } else if (notif.type === "property") {
      navigate("/admin/properti");
    }
  };

  return (
    <div className={`${styles.container} container-fluid ${theme === "dark" ? "dark" : ""}`}>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h2>Selamat Datang, Admin</h2>
            <p>{today}</p>
          </div>
        </div>

        {/* Statistik */}
        <div className="row g-3 mb-4">
          <div className="col-md-3 col-6">
            <div className={`${styles.card} shadow-sm`}>
              <FaUsers className={styles.iconUser} />
              <h6>Total User</h6>
              <p className={styles.number}>{stats.totalUser}</p>
            </div>
          </div>

          <div className="col-md-3 col-6">
            <div className={`${styles.card} shadow-sm`}>
              <FaBuilding className={styles.iconProperti} />
              <h6>Total Properti</h6>
              <p className={styles.number}>{stats.totalProperti}</p>
            </div>
          </div>

          <div className="col-md-3 col-6">
            <div className={`${styles.card} shadow-sm`}>
              <FaClock className={styles.iconPending} />
              <h6>Properti Pending</h6>
              <p className={styles.number}>{stats.propertiPending}</p>
            </div>
          </div>

          <div className="col-md-3 col-6">
            <div className={`${styles.card} shadow-sm`}>
              <FaCheckCircle className={styles.iconApproved} />
              <h6>Disetujui</h6>
              <p className={styles.number}>{stats.propertiApproved}</p>
            </div>
          </div>
        </div>

        {/* Notifikasi */}
        <div className={`${styles.notifications} shadow-sm`}>
          <div className="d-flex align-items-center mb-2">
            <FaBell className="me-2 text-primary" />
            <h5 className="m-0">Notifikasi Aktivitas</h5>
          </div>

          <div className={styles.notifTable}>
            {notifications.length ? (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={styles.notifRow}
                  onClick={() => handleNotifClick(notif)}
                >
                  <div className={styles.notifTimestamp}>
                    [{notif.timestamp ? notif.timestamp.toLocaleString() : "tanggal tidak tersedia"}]
                  </div>
                  <div className={styles.notifContent}>{notif.text}.</div>
                </div>
              ))
            ) : (
              <div>Tidak ada notifikasi terbaru</div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HomeContent;
