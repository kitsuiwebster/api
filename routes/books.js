const express = require('express');
const router = express.Router();
const baseUrl = "/api/books"
const booksCtrl =require('../controllers/books')

const verifyToken = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        const userId = decodedToken.userId;
        if (req.body.userId && req.body.userId !== userId) {
            throw 'Invalid user ID';
        } else {
            next();
        }
    } catch {
        res.status(401).json({
            error: new Error('Invalid request!')
        });
    }
};

router.get(`${baseUrl}`, booksCtrl.getAllBooks)
router.post(`${baseUrl}`, booksCtrl.createBook);
router.get(`${baseUrl}/:id`, booksCtrl.getBook);
router.get(`${baseUrl}/bestrating`, booksCtrl.getBestRatingBooks);
router.put(`${baseUrl}/:id`, verifyToken, booksCtrl.updateBook);
router.delete(`${baseUrl}/:id`, verifyToken, booksCtrl.deleteBook);
router.post(`${baseUrl}/:id/rating`, verifyToken, booksCtrl.rateBook);

module.exports = router;