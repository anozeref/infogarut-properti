// Sidebar.jsx
import React from "react";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaBoxOpen,
  FaPlusCircle,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaGlobe,
} from "react-icons/fa";
import styles from "./SidebarUser.module.css";

export default function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <ul className={styles.menuList}>
        <li>
          <Link to="/user">
            <FaHome className={styles.icon} /> Dashboard
          </Link>
        </li>
      </ul>

      <ul className={styles.menuList}>
        <li>
          <Link to="/user/properti">
            <FaBoxOpen className={styles.icon} /> Properti Saya
          </Link>
        </li>
        <li>
          <Link to="/user/properti/pending">
            <FaClock className={styles.icon} /> Properti Pending
          </Link>
        </li>
        <li>
          <Link to="/user/properti/aktif">
            <FaCheckCircle className={styles.icon} /> Properti Aktif
          </Link>
        </li>
        <li>
          <Link to="/user/properti/ditolak">
            <FaTimesCircle className={styles.icon} /> Properti Ditolak
          </Link>
        </li>
        <li>
          <Link to="/">
            <FaGlobe className={styles.icon} /> Landing Page
          </Link>
        </li>
      </ul>
    </div>
  );
}
