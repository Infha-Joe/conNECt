import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

function checkFileType(file, cb) {
  const allowedExtensions = /^(jpg|jpeg|png|webp|avif|gif|bmp|svg|mp4|webm|pdf|doc|docx|xls|xlsx|zip|txt|csv)$/i;
  const ext = path.extname(file.originalname).toLowerCase().replace(/^\./, '');
  const isValid = allowedExtensions.test(ext);

  if (isValid) {
    return cb(null, true);
  } else {
    cb(new Error(`Invalid file type (.${ext || 'unknown'}). Supported formats: JPG, JPEG, PNG, WebP, AVIF, GIF, PDF, DOC, DOCX.`));
  }
}

const upload = multer({
  storage,
  limits: { fileSize: 50000000 }, // 50MB
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

router.post('/', protect, (req, res) => {
  upload.single('media')(req, res, (err) => {
    if (err) {
      res.status(400);
      return res.json({ success: false, message: err.message || 'File upload failed' });
    }
    if (!req.file) {
      res.status(400);
      return res.json({ success: false, message: 'No file uploaded' });
    }
    res.json({ success: true, url: `/${req.file.path.replace(/\\/g, '/')}` });
  });
});

export default router;
