const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/carousel');
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4() + '.' + file.mimetype.split('/')[1]);
  },
  limits: { fileSize: 200000 },
});

module.exports = multer({ storage });
