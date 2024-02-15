const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const bookFromReq = req.body.book;
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + '.' + extension);
  }
});

module.exports = multer({storage: storage}).single('image');


// const storage = multer.diskStorage({
//   destination: (req, file, callback) => {
//     callback(null, 'images');
//   },
//   filename: (req, file, callback) => {
//     const bookFromReq =  req.body.book;
//     console.log(req.body)
//     const name = req.body.book.author + '_' + bookFromReq.title
//     const extension = MIME_TYPES[file.mimetype];
//     callback(null, name + '.' + extension);
//   }
// });