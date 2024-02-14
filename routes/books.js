const express = require('express');
const router = express.Router();
const baseUrl = "/api/books"
const booksCtrl = require('../controllers/books')
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multerConfig')

router.get(`${baseUrl}`, auth, booksCtrl.getAllBooks)
router.post(`${baseUrl}`, auth, multer, booksCtrl.createBook);
router.get(`${baseUrl}/:id`, auth, booksCtrl.getBook);
router.get(`${baseUrl}/bestrating`, auth, booksCtrl.getBestRatingBooks);
router.put(`${baseUrl}/:id`, auth, booksCtrl.updateBook);
router.delete(`${baseUrl}/:id`, auth, booksCtrl.deleteBook);
router.post(`${baseUrl}/:id/rating`, auth, booksCtrl.rateBook);

module.exports = router;