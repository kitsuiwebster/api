const Book = require('../models/Book');
const fs = require('fs');

exports.getAllBooks = (req, res) => {
    Book.find()
    .then((books) => res.status(200).json( books ))
    .catch(error => res.status(404).json())
}

exports.getBook = (req, res) => {
    Book.findOne({ _id: req.params.id })
        .then(book => res.status(200).json(book))
        . catch(error => res.status(404).json());
}

exports.createBook = (req, res) => {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
	delete bookObject.userId;
    const book = new Book({
        ...bookObject,
        imageUrl: `${req.protocol}://localhost:4000/images/${req.file.filename}`
    });
    book.save()
    .then(() => { res.status(201).json({message: 'Livre enregistré !'})})
    .catch(error => {
		res.status(400).json( )
	})
};

exports.getBestRatedBooks = (req, res) => {
    Book.find().sort({ averageRating: -1 }).limit(3)
        .then(books => res.status(200).json(books))
        .catch(error => res.status(400).json());
}

exports.updateBook = (req, res) => {
    Book.updateOne({ _id: req.params.id, userId: req.body.userId }, { ...req.body })
        .then(() => res.status(200).json({ message: 'Book updated!' }))
        .catch(error => res.status(403).json({ error: 'Unauthorized request' }));
}

exports.deleteBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id})
        .then(thing => {
            if (thing.userId != req.auth.userId) {
                res.status(401).json({message: 'Not authorized'});
            } else {
                const filename = thing.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Book.deleteOne({_id: req.params.id})
                        .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                        .catch(error => res.status(401).json());
                });
            }
        })
        .catch( error => {
            res.status(500).json();
    });
};

exports.rateBook = (req, res) => {
    Book.findById(req.params.id)
        .then(book => {
            if (!book) {
                return res.status(404).json({ error: 'Book not found' });
            }
            const userRateExists = book.ratings.find((rate) => rate.userId === req.body.userId);
            if (userRateExists) {
                userRateExists.grade = Number(req.body.rating);
            } else {
                book.ratings.push({ userId: req.body.userId, grade: Number(req.body.rating) });
            }
            const totalGradeScore = book.ratings.reduce((acc, curr) => acc + curr.grade, 0);
                    book.averageRating = totalGradeScore / book.ratings.length;
                    return book.save();
        })
        .then(updatedBook => res.status(200).json(updatedBook))
        .catch(error => res.status(500).json());
};

