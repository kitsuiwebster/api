const mongoose = require('mongoose');
// const uniqueValidator = require('mangoose-unique-validator');

const bookSchema = mongoose.Schema({
    book: { type: String, required: true },
    image: { type: String, required: false },
});

// bookSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Book', bookSchema);