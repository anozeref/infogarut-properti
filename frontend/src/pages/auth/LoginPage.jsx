import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { loginUser } from "../../utils/api";
import { AuthContext } from "../../context/AuthContext";
import styles from "./LoginPage.module.css";
import { FaLock } from "react-icons/fa";
import { motion } from "framer-motion";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await loginUser(username, password);

      if (!user) {
        Swal.fire("Gagal!", "Username atau password salah", "error");
        return;
      }

      login(user);
      Swal.fire("Berhasil!", `Selamat datang, ${user.nama.split(" ")[0]}!`, "success");

      user.role === "admin" ? navigate("/admin") : navigate("/user");
    } catch (err) {
      Swal.fire("Error!", err.message, "error");
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
          Masuk Akun
        </motion.h1>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className={styles.input}
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            className={styles.input}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className={styles.button}>
            Masuk
          </button>
        </form>

        <p className={styles.registerLink}>
          Belum punya akun? <Link to="/register">Daftar</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
