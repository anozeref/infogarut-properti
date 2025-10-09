// Sidebar.jsx
import React from "react";
import {
  FaHome,
  FaBoxOpen,
  FaPlusCircle,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaUserCog,
  FaSignOutAlt,
  FaGlobe, // ikon tambahan untuk Landing Page
} from "react-icons/fa";
import styles from "./SidebarUser.module.css";

export default function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <ul className={styles.menuList}>
        <li>
          <a href="#">
            <FaHome className={styles.icon} /> Dashboard
          </a>
        </li>
      </ul>
      <ul className={styles.menuList}>
        <li>
          <a href="#">
            <FaBoxOpen className={styles.icon} /> Properti Saya
          </a>
        </li>
        <li>
          <a href="#">
            <FaClock className={styles.icon} /> Properti Pending
          </a>
        </li>
        <li>
          <a href="#">
            <FaCheckCircle className={styles.icon} /> Properti Aktif
          </a>
        </li>
        <li>
          <a href="#">
            <FaTimesCircle className={styles.icon} /> Properti Ditolak
          </a>
        </li>
        <li>
          <a href="/landing">
            <FaGlobe className={styles.icon} /> Landing Page
          </a>
        </li>
      </ul>
    </div>
  );
}
