import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AddPropertyButton.module.css";

export default function AddPropertyButton() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/tambahproperty"); // arahkan ke halaman Jual Property
  };

  return (
    <button className={styles.addBtn} onClick={handleClick}>
      + Tambah Properti
    </button>
  );
}
