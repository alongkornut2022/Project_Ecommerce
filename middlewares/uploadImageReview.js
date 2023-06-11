const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/imagereview');
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4() + '.' + file.mimetype.split('/')[1]);
  },
  limits: { fileSize: 100000 },
});

module.exports = multer({ storage });
