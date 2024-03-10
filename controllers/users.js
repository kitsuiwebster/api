const User = require('../models/User')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const errors = require('../utils/mongooseErrors');

exports.signup = (req, res) => {
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const newUser = new User({
            email: req.body.email,
            password: hash
        });
        newUser.save()
        .then(() => res.status(201).json({ message: `Bienvenue ${newUser.email} !` }))
        .catch(error => { 
            if (error.code === errors.duplicatedKey) {
                res.status(401).json()
            } else {
                res.status(400).json()
            }
        });
    })
    .catch(error => res.status(500).json());
}

exports.signin = (req, res) => {
    User.findOne({ email: req.body.email })
    .then(user => {
        if (user === null) {
            return res.status(401).json({ error: 'Paire identifiant/mot de passe incorrecte' });
        } else {
            bcrypt.compare(req.body.password, user.password)
            .then(valid => {
                if (!valid) {
                    return res.status(401).json({ error: 'Paire identifiant/mot de passe incorrecte' });
                } else {
                    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
                    res.status(200).json({
                        userId: user._id,
                        token: token
                    });
                }
            })
            .catch(error => res.status(500).json());
        }
    })
    .catch(error => res.status(500).json());
}