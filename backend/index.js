const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { initializeApp, cert } = require("firebase-admin/app");
const { getStorage } = require("firebase-admin/storage");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(cors());
const upload = multer({ dest: "uploads/" });

const serviceAccount = JSON.parse(process.env.FIREBASE_KEY);


initializeApp({
  credential: cert(serviceAccount),
  storageBucket: "karni-exim.appspot.com",
});

const bucket = getStorage().bucket();

app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const filePath = req.file.path;
    const destination = `products/${Date.now()}_${req.file.originalname}`;

    await bucket.upload(filePath, {
      destination,
      public: true,
      metadata: {
        contentType: req.file.mimetype,
      },
    });

    // Clean up temp file
    fs.unlinkSync(filePath);

    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${destination}`;
    res.status(200).json({ url: publicUrl });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Failed to upload image" });
  }
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
