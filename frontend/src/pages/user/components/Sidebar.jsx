import React from "react";
import styles from "./SidebarUser.module.css";

export default function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <h3>Menu</h3>
      <ul>
        <li><a href="#">Properti yang Saya Jual</a></li>
        <li><a href="#">Properti Favorit</a></li>
      </ul>
    </div>
  );
}
