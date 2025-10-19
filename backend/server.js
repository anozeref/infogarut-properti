// server.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const axios = require("axios");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const PORT = 3005;
const DB_URL = "http://localhost:3004"; // URL json-server (database)

// === Middleware ===
app.use(cors());
app.use(express.json());

// Pastikan folder media ada
const mediaDir = path.join(__dirname, "public/media");
if (!fs.existsSync(mediaDir)) fs.mkdirSync(mediaDir, { recursive: true });

// Serve file statis (gambar properti)
app.use("/media", express.static(mediaDir));

// === Socket.IO ===
const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  console.log(`✅ Connected: ${socket.id}`);

  // --- LOGIKA LAMA (Untuk Admin Refresh Umum) ---
  socket.on('propertyUpdate', () => {
    console.log("🔔 [Server] Menerima 'propertyUpdate', membalas ke semua admin...");
    io.emit('propertyUpdate');
  });
  socket.on('userUpdate', () => {
    // <-- CONSOLE.LOG DITAMBAHKAN -->
    console.log("🔔 [Server] Menerima 'userUpdate', membalas ke semua admin...");
    io.emit('userUpdate'); // Sinyal ini tetap ada, dipakai oleh KelolaUser & Pengaturan
  });

  // --- LOGIKA BARU (Untuk DashboardUser.jsx) ---
  
  socket.on("joinUserRoom", (userId) => {
    if (userId) {
      socket.join(String(userId));
      console.log(`✅ User ${socket.id} (ID: ${userId}) bergabung ke room: ${userId}`);
    }
  });

  socket.on("adminPropertyUpdate", async (data) => {
    if (!data || !data.ownerId) return;
    
    console.log("🔔 [Server] Menerima 'adminPropertyUpdate', menyimpan notif...");

    try {
      const statusText = data.statusPostingan === 'approved' ? 'disetujui' : 'ditolak';
      const link = data.statusPostingan === 'approved' ? '/user/propertiaktif' : '/user/propertiditolak';
      
      const newNotification = {
        userId: String(data.ownerId),
        text: `Properti '${data.namaProperti}' Anda telah ${statusText} oleh admin.`,
        isRead: false,
        createdAt: new Date().toISOString(),
        link: link
      };

      await axios.post(`${DB_URL}/notifications`, newNotification);
      console.log(`🔔 [Server] Notifikasi disimpan untuk User ID: ${data.ownerId}`);

      io.to(String(data.ownerId)).emit("new_notification_ping"); 

    } catch (err) {
      console.error("❌ Gagal menyimpan notifikasi ke DB:", err.message);
    }
    
    console.log("🔔 [Server] Membalas 'propertyUpdate' ke semua admin...");
    io.emit("propertyUpdate"); 
  });
  
  // --- Akhir Logika Baru ---

  socket.on("disconnect", () => {
    console.log(`❌ Disconnected: ${socket.id}`);
  });
});

// === MULTER Setup ===
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, mediaDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB
}).array("media", 4);

// === Upload Endpoint ===
app.post("/upload", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.error("❌ Upload error:", err.message);
      return res.status(400).json({ error: err.message });
    }
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }
    const files = req.files.map((f) => f.filename);
    console.log("📸 Uploaded:", files);
    res.json({ files });
    io.emit("new_upload", { files, time: new Date() });
  });
});

// === GET users & properties ===
app.get("/users", async (_, res) => {
  try {
    const { data } = await axios.get(`${DB_URL}/users`);
    res.json(data);
  } catch {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

app.get("/properties", async (_, res) => {
  try {
    const { data } = await axios.get(`${DB_URL}/properties`);
    res.json(data);
  } catch {
    res.status(500).json({ error: "Failed to fetch properties" });
  }
});

// === DELETE property + media ===
app.delete("/properties/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { data: properties } = await axios.get(`${DB_URL}/properties`);
    const property = properties.find((p) => String(p.id) === String(id));
    if (!property) return res.status(404).json({ error: "Property not found" });

    if (property.media && Array.isArray(property.media)) {
      property.media.forEach((file) => {
        const filePath = path.join(mediaDir, file);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      });
    }

    await axios.delete(`${DB_URL}/properties/${id}`);
    io.emit("update_property", { id, deleted: true });
    res.json({ success: true, deletedId: id });
  } catch (err) {
    console.error("❌ Delete error:", err.message);
    res.status(500).json({ error: "Failed to delete property" });
  }
});

// === GET banned users ===
app.get("/api/banned-users", async (_, res) => {
  try {
    const { data: users } = await axios.get(`${DB_URL}/users`);
    // Perbaiki filter: pakai field 'banned' saja
    const bannedUsers = users.filter(u => u.banned === true); 
    res.json(bannedUsers);
  } catch (err) {
    console.error("❌ Fetch banned users error:", err.message);
    res.status(500).json({ error: "Gagal mengambil data user yang diblokir" });
  }
});

// === Unban user ===
// <-- PERBAIKAN: Blok ini diaktifkan lagi -->
app.patch("/api/users/:id/unban", async (req, res) => {
  const { id } = req.params;
  try {
    const { data: user } = await axios.get(`${DB_URL}/users/${id}`);
    if (!user) return res.status(404).json({ error: "User tidak ditemukan" });

    // Hanya ubah banned jika true
    if (user.banned !== true) { // Periksa secara eksplisit boolean true
      return res.status(400).json({ error: "User ini tidak sedang diblokir." });
    }

    // Ubah banned jadi false, HAPUS bannedAt
    const updatedUser = { ...user, banned: false, bannedAt: null }; 
    await axios.patch(`${DB_URL}/users/${id}`, updatedUser);

    // <-- PERBAIKAN: Hapus baris ini agar tidak konflik -->
    // io.emit("userUpdate", { id, unbanned: true }); 
    
    console.log(`✅ [Server] User ${id} di-unban via endpoint.`);
    res.json({ success: true, user: updatedUser });
  } catch (err) {
    console.error("❌ Unban error:", err.message);
    res.status(500).json({ error: "Gagal membuka blokir user" });
  }
});
// <-- AKHIR PERBAIKAN -->

// === Media cleanup ===
app.post("/api/media/cleanup", async (_, res) => {
  try {
    const { data: properties } = await axios.get(`${DB_URL}/properties`);
    const usedFiles = new Set(properties.flatMap(p => p.media || []));
    const allFiles = fs.readdirSync(mediaDir);

    let deleted = 0;
    allFiles.forEach(file => {
      if (!usedFiles.has(file)) {
        fs.unlinkSync(path.join(mediaDir, file));
        deleted++;
      }
    });

    io.emit("mediaCleanup", { deleted, time: new Date() });
    res.json({ message: `${deleted} file tidak terpakai telah dihapus.` });
  } catch (err) {
    console.error("❌ Cleanup error:", err.message);
    res.status(500).json({ error: "Gagal membersihkan media" });
  }
});

// === Jalankan server ===
server.listen(PORT, () => {
  console.log(`🚀 Backend aktif di http://localhost:${PORT}`);
});