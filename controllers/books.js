const Book = require('../models/Book');
const User = require('../models/User');
const Rating = require('../models/Rating');
const fs = require('fs');

exports.getAllBooks = (req, res) => {
    Book.find({_id: "65ce7ae84fc35aaa28cc32fa"})
    .then((books) => res.status(200).json( books ))
    .catch(error => res.status(404).json({ error }))
}

exports.getBook = (req, res) => {
    Book.findOne({ _id: req.params.id })
        .then(book => res.status(200).json(book))
        . catch(error => res.status(404).json({ error }));
}

exports.createBook = (req, res) => {
    const bookObject = JSON.parse(req.body.book);
    console.log(bookObject)
    delete bookObject._id;
	delete bookObject.userId;
    const book = new Book({
        ...bookObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    book.save()
    .then(() => { res.status(201).json({message: 'Livre enregistré !'})})
    .catch(error => {
		console.log(error)
		res.status(400).json( { error })
	})
};

exports.getBestRatingBooks = (req, res) => {
    Book.find().sort({ averageRating: -1 }).limit(3)
        .then(books => res.status(200).json(books))
        .catch(error => res.status(400).json({ error }));
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
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch( error => {
            res.status(500).json({ error });
    });
};

exports.rateBook = (req, res) => {
    Book.findById(req.params.id)
        .then(book => {
            Rating.findOne({user: req.body.userId, book: book._id})
            .then(rating => {
                if (rating) {
                    return res.status(400).json({ message: 'User has already rated this book.' });
                } else {
                    return
                }
            })
            .then(() => {
                const newRating = new Rating ({user: req.body.userId, book: book._id, grade: req.body.rating})
                newRating.save()
                .then(() => {
					Rating.find({book: book._id})
					.then( (allRates) => {
						const totalGradeScore = allRates.reduce((acc, curr) => acc + curr.grade, req.body.rating);
						// TODO: verifier commetn savoirle nombre d'elemetn retourné par mongoose (.length ?)
						book.averageRating = totalGradeScore / (allRates.length + 1 );
						book.save()
						.then(updatedBook => res.status(201).json(updatedBook))
						.catch(error => res.status(400).json({ error }));
					})})
				.catch( (error) => res.status(501).json({ error }));	
            });
        })
    .catch(error => res.status(404).json({ error: 'Book not found' }));
}