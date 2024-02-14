const Book = require('../models/Book')
const fs = require('fs')

exports.getAllBooks = (req, res) => {
    Book.find({})
    .then((books) => res.status(200).json({ books }))
    .catch(error => res.status(404).json({ error }))
}

exports.getBook = (req, res) => {
    Book.findOne({ _id: req.params.id })
        .then(book => res.status(200).json(book))
        . catch(error => res.status(404).json({ error }));
}

exports.createBook = (req, res, next) => {
    const thingObject = JSON.parse(req.body.thing);
    delete thingObject._id;
    delete thingObject._userId;
    const thing = new Thing({
        ...thingObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
  
    thing.save()
    .then(() => { res.status(201).json({message: 'Livre enregistré !'})})
    .catch(error => { res.status(400).json( { error })})
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

exports.deleteThing = (req, res, next) => {
    Thing.findOne({ _id: req.params.id})
        .then(thing => {
            if (thing.userId != req.auth.userId) {
                res.status(401).json({message: 'Not authorized'});
            } else {
                const filename = thing.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Thing.deleteOne({_id: req.params.id})
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
            if (book.ratings.find(r => r.userId === req.body.userId)) {
            return res.status(400).json({ message: 'User has already rated this book.' });
            }
            const rating = {
            userId: req.body.userId,
            grade: req.body.rating
            };
            book.ratings.push(rating);
            book.averageRating = book.ratings.reduce((acc, curr) => acc + curr.grade, 0) / book.ratings.length;
            book.save()
            .then(updatedBook => res.status(201).json(updatedBook))
            .catch(error => res.status(400).json({ error }));
        })
    .catch(error => res.status(404).json({ error: 'Book not found' }));
}