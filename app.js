const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const booksRoutes = require('./routes/books')
const userRoutes = require('./routes/users')

const app = express();


mongoose.connect(`mongodb+srv://kitsuiwebster:LuQo7qtgQkEPiyw3@p7.xderk1w.mongodb.net/test?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((err) => console.log('Connexion à MongoDB échouée !' + err));

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});


app.use('', booksRoutes, userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;