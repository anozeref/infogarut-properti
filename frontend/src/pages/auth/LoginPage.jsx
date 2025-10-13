import React from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { FaLock } from "react-icons/fa";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import styles from "./LoginPage.module.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const { setUser } = useOutletContext(); // ⬅️ dapet dari App.jsx

  const handleLogin = (role) => {
    if (role === "admin") {
      setUser({ name: "Admin", role: "admin" });
      Swal.fire("Login berhasil!", "Selamat datang, Admin!", "success");
      navigate("/admin");
    } else if (role === "user") {
      setUser({ name: "User", role: "user" });
      Swal.fire("Login berhasil!", "Selamat datang, User!", "success");
      navigate("/user");
    }
  };

  return (
    <div className={styles.container}>
      <div className={`${styles.circle} ${styles.circleOne}`}></div>
      <div className={`${styles.circle} ${styles.circleTwo}`}></div>
      <div className={`${styles.circle} ${styles.circleThree}`}></div>
      <div className={`${styles.circle} ${styles.circleFour}`}></div>

      <motion.div
        className={styles.loginBox}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div
          className={styles.iconWrapper}
          initial={{ rotate: -30, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <FaLock size={28} />
        </motion.div>

        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Masuk sebagai
        </motion.h1>

        <motion.div
          className={styles.buttonGroup}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <button
            type="button"
            onClick={() => handleLogin("admin")}
            className={`${styles.button} ${styles.adminBtn}`}
          >
            Admin
          </button>
          <button
            type="button"
            onClick={() => handleLogin("user")}
            className={`${styles.button} ${styles.userBtn}`}
          >
            User
          </button>
        </motion.div>

        <p className={styles.registerLink}>
          Tidak punya akun? <a href="#">Daftar</a>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
