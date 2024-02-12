const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
    book: { type: String, required: true },
    image: { type: String, required: false },
});

module.exports = mongoose.model('Book', bookSchema);