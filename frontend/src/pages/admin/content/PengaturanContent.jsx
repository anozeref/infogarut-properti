// src/pages/admin/content/PengaturanContent.jsx
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import { FiKey, FiTrash2, FiUsers } from 'react-icons/fi';
import styles from './PengaturanContent.module.css';
import axios from 'axios';

// ==== Axios instance ke backend ====
const api = axios.create({
  baseURL: 'http://localhost:3005',
  headers: { 'X-Admin-Request': 'true' }
});

// Varian animasi Framer Motion
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export default function PengaturanContent() {
  const [bannedUsers, setBannedUsers] = useState([]);
  const [isLoadingBanned, setIsLoadingBanned] = useState(true);

  // Ambil daftar user yang diblokir
  useEffect(() => {
    const fetchBannedUsers = async () => {
      setIsLoadingBanned(true);
      try {
        const res = await api.get('/api/banned-users');
        setBannedUsers(res.data);
      } catch (err) {
        console.error(err);
        Swal.fire('Error!', 'Gagal mengambil data user yang diblokir.', 'error');
      } finally {
        setIsLoadingBanned(false);
      }
    };
    fetchBannedUsers();
  }, []);

  // Hapus media tidak terpakai
  const handleMediaCleanup = () => {
    Swal.fire({
      title: 'Apakah Anda yakin?',
      text: "Aksi ini akan memindai dan menghapus file media yang tidak terpakai secara permanen!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, jalankan pembersihan!',
      cancelButtonText: 'Batal'
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Memproses...',
          html: 'Sedang memindai dan membersihkan media. Mohon tunggu...',
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading()
        });
        try {
          const res = await api.post('/api/media/cleanup');
          Swal.fire('Selesai!', res.data.message, 'success');
        } catch (err) {
          const message = err.response?.data?.error || 'Terjadi kesalahan saat pembersihan.';
          Swal.fire('Error!', message, 'error');
        }
      }
    });
  };

  // Buka blokir user
  const handleUnbanUser = (userId, username) => {
    Swal.fire({
      title: `Buka blokir "${username}"?`,
      text: "Pengguna ini akan dapat mengakses sistem kembali.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, buka blokir!',
      cancelButtonText: 'Batal'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.patch(`/api/users/${userId}/unban`);
          setBannedUsers(current => current.filter(u => u.id !== userId));
          Swal.fire('Berhasil!', `Pengguna ${username} telah di-unban.`, 'success');
        } catch (err) {
          const message = err.response?.data?.error || 'Gagal membuka blokir user.';
          Swal.fire('Error!', message, 'error');
        }
      }
    });
  };

  return (
    <div className={styles.container}>
      <motion.h1
        className={styles.header}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Pengaturan
      </motion.h1>

      {/* Card: Pemeliharaan Sistem */}
      <motion.div variants={cardVariants} initial="hidden" animate="visible" className={styles.card}>
        <h2 className={styles.cardHeader}>
          <FiTrash2 className="text-red-500" /> Pemeliharaan Sistem
        </h2>
        <p className={styles.cardDescription}>
          Hapus file media yang tidak memiliki relasi di database untuk menghemat ruang penyimpanan server.
        </p>
        <button onClick={handleMediaCleanup} className={`${styles.button} ${styles.buttonRed}`}>
          <FiTrash2 /> Jalankan Pembersihan
        </button>
      </motion.div>

      {/* Card: Manajemen Pengguna */}
      <motion.div variants={cardVariants} initial="hidden" animate="visible" className={styles.card}>
        <h2 className={styles.cardHeader}>
          <FiUsers className="text-green-500" /> Akun Pengguna Diblokir
        </h2>
        <div className={styles.userList}>
          {isLoadingBanned ? (
            <p className={styles.loadingText}>Memuat data pengguna yang diblokir...</p>
          ) : bannedUsers.length > 0 ? (
            bannedUsers.map(user => (
              <div key={user.id} className={styles.userItem}>
                <div className={styles.userItemInfo}>
                  <p>{user.username}</p>
                  <p>{user.email}</p>
                </div>
                <button
                  onClick={() => handleUnbanUser(user.id, user.username)}
                  className={styles.unbanButton}
                >
                  Buka Blokir
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic">Tidak ada pengguna yang sedang diblokir.</p>
          )}
        </div>
      </motion.div>

      {/* Card: Keamanan Akun */}
      <motion.div variants={cardVariants} initial="hidden" animate="visible" className={styles.card}>
        <h2 className={styles.cardHeader}>
          <FiKey className="text-blue-500" /> Keamanan Akun
        </h2>
        <p className={styles.cardDescription}>
          Ubah kata sandi admin untuk menjaga keamanan akun Anda.
        </p>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const passwordLama = e.target.passwordLama.value.trim();
            const passwordBaru = e.target.passwordBaru.value.trim();
            const konfirmasiPassword = e.target.konfirmasiPassword.value.trim();

            if (!passwordLama || !passwordBaru || !konfirmasiPassword) {
              return Swal.fire("Peringatan", "Semua field harus diisi.", "warning");
            }
            if (passwordBaru.length < 6) {
              return Swal.fire("Peringatan", "Password baru minimal 6 karakter.", "warning");
            }
            if (passwordBaru !== konfirmasiPassword) {
              return Swal.fire("Error", "Konfirmasi password tidak cocok.", "error");
            }

            try {
              const res = await api.get("/users/5");
              const adminData = res.data;

              if (adminData.password !== passwordLama) {
                return Swal.fire("Error", "Password lama tidak cocok.", "error");
              }

              await api.patch("/users/5", { password: passwordBaru });
              Swal.fire("Berhasil!", "Password berhasil diperbarui.", "success");
              e.target.reset();
            } catch (err) {
              console.error(err);
              Swal.fire("Error", "Terjadi kesalahan saat mengubah password.", "error");
            }
          }}
          className={styles.formContainer}
        >
          <div className={styles.formGroup}>
            <label htmlFor="passwordLama" className={styles.label}>Password Lama</label>
            <input type="password" id="passwordLama" name="passwordLama" className={styles.input} placeholder="Masukkan password lama" />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="passwordBaru" className={styles.label}>Password Baru</label>
            <input type="password" id="passwordBaru" name="passwordBaru" className={styles.input} placeholder="Masukkan password baru" />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="konfirmasiPassword" className={styles.label}>Konfirmasi Password Baru</label>
            <input type="password" id="konfirmasiPassword" name="konfirmasiPassword" className={styles.input} placeholder="Ulangi password baru" />
          </div>

          <button type="submit" className={`${styles.button} ${styles.buttonBlue}`}>Ubah Password</button>
        </form>
      </motion.div>
    </div>
  );
}
