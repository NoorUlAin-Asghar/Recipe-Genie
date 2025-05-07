// config/multer.js
const multer = require('multer');

const upload = multer({
  storage: multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
      const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '-');
      cb(null, `${Date.now()}-${sanitizedName}`);
    }
  }),
  fileFilter: (req, file, cb) => {
    // Allow ALL image types (checks MIME type starts with 'image/')
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

module.exports = upload;