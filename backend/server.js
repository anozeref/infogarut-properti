const express = require("express");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(cors());
app.use("/media/properties", express.static(path.join(__dirname, "public/media")));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/media"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB max per foto
}).array("media", 4); // max 4 files

app.post("/upload", (req, res) => {
  upload(req, res, function(err) {
    if (err) return res.status(400).json({ error: err.message });
    const files = req.files.map(f => f.filename);
    res.json({ files });
  });
});

const PORT = 3004;
app.listen(PORT, () => console.log(`Express upload server running on port ${PORT}`));
