import React from "react";
import styles from "./AddPropertyButton.module.css";

export default function AddPropertyButton({ onClick }) {
  return (
    <button className={styles.addBtn} onClick={onClick}>
      + Tambah Properti
    </button>
  );
}
