const mongoose = require('mongoose');
// const uniqueValidator = require('mangoose-unique-validator');

const bookSchema = mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    year: { type: Number, required: true },
    genre: { type: String, required: true },
    imageUrl: { type: String, required: false },
    averageRating: { type: Number, required: true },
    ratings: [{
        userId: { type: String, required: true },
        grade: { type: Number, required: true },
    }]
});

// bookSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Book', bookSchema);