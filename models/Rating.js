const mongoose = require('mongoose');
// const uniqueValidator = require('mangoose-unique-validator');

const ratingSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    grade: { type: Number, required: true }
});

// bookSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Rating', ratingSchema);