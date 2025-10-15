// server.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
app.use(cors());
app.use(express.json()); // tambahan untuk parsing JSON body
app.use("/media/properties", express.static(path.join(__dirname, "public/media")));

// === Setup HTTP + Socket.IO ===
const server = createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

// Socket.IO: koneksi client
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // Event real-time user baru
  socket.on("new_user", (data) => {
    console.log("New user registered:", data);
    io.emit("userUpdate", data); // broadcast ke semua client HomeContent
  });

  // Event real-time property baru
  socket.on("new_property", (data) => {
    console.log("New property added:", data);
    io.emit("propertyUpdate", data);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// === Setup Multer untuk upload ===
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/media"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB per file
}).array("media", 4); // max 4 files

// === Endpoint upload ===
app.post("/upload", (req, res) => {
  upload(req, res, function (err) {
    if (err) return res.status(400).json({ error: err.message });

    const files = req.files.map((f) => f.filename);
    res.json({ files });

    // Emit event ke semua client (contoh: notifikasi upload baru)
    io.emit("new_upload", { files, time: new Date() });
  });
});

// Jalankan server HTTP
const PORT = 3005;
server.listen(PORT, () => console.log(`🚀 Server with Socket.IO running on port ${PORT}`));
