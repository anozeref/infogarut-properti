import React, { useState } from "react";
import styles from "./KelolaUserContent.module.css";

// Dummy data user
const usersData = [
  { id: 2, username: "andi", name: "Andi Setiawan", email: "andi@mail.com", hp: "081234567890", joined: "2025-01-10", verified: true },
  { id: 3, username: "budi", name: "Budi Santoso", email: "budi@mail.com", hp: "081234567891", joined: "2025-02-15", verified: false },
  { id: 4, username: "citra", name: "Citra Rahma", email: "citra@mail.com", hp: "081234567892", joined: "2025-03-05", verified: true },
  { id: 5, username: "dina", name: "Dina Lestari", email: "dina@mail.com", hp: "081234567893", joined: "2025-04-01", verified: false },
];

// Dummy data properties
const propertiesData = [
  { id: 1, ownerId: 2 },
  { id: 2, ownerId: 2 },
  { id: 3, ownerId: 3 },
  { id: 4, ownerId: 4 },
];

const KelolaUserContent = () => {
  const [users, setUsers] = useState(usersData);

  const handleBanned = (id) => alert(`User ID ${id} dibanned!`);
  const handleSuspend = (id) => alert(`User ID ${id} disuspend!`);
  const handleVerify = (id) => alert(`User ID ${id} diverifikasi!`);

  return (
    <div className={styles.container}>
      <h2>Kelola User</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>No</th>
            <th>Username</th>
            <th>Nama</th>
            <th>Email</th>
            <th>HP</th>
            <th>Properti Post</th>
            <th>Status Verifikasi</th>
            <th>Tgl Bergabung</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => {
            const userProperties = propertiesData.filter((p) => p.ownerId === user.id);
            return (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>{user.username}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.hp}</td>
                <td>{userProperties.length}</td>
                <td>{user.verified ? "✅ Verified" : "❌ Unverified"}</td>
                <td>{user.joined}</td>
                <td>
                  {!user.verified && (
                    <button onClick={() => handleVerify(user.id)} className={styles.verifyBtn}>
                      ✔️ Verify
                    </button>
                  )}
                  <button onClick={() => handleSuspend(user.id)} className={styles.suspendBtn}>
                    ⏱️ Suspend
                  </button>
                  <button onClick={() => handleBanned(user.id)} className={styles.bannedBtn}>
                    🛑 Banned
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default KelolaUserContent;
