const multer = require('multer');
const path = require('path');

// Set storage configuration for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Folder for saving files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Naming convention for uploaded files
  }
});

// File filter configuration to allow only specific image and audio formats
const fileFilter = (req, file, cb) => {
  // Allowed file types for images and audio
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'audio/mpeg', 'audio/wav'];

  // Check if the file type is valid
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);  // Allow the file
  } else {
    cb(new Error('Invalid file type. Only JPG, JPEG, PNG, MP3, and WAV are allowed.'), false); // Reject invalid files
  }
};

// Setup multer with storage and file filter
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // Set file size limit to 10MB
  }
});

module.exports = upload;
