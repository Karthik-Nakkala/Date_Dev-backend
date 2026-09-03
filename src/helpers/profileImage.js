const multer=require('multer');

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(new Error('Only JPG, JPEG, and PNG images are supported!'), false);
    }
  }
});

module.exports=upload;