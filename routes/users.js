const express = require('express');
const bcrypt = require('bcryptjs');

const router = express.Router();

const baseUrl = "/api"
const User = require('../models/User')


router.post(`${baseUrl}/auth/signup`, (req, res) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const newUser = new User({
                email: req.body.email,
                password: hash
            });
            newUser.save()
            .then(() => res.status(201).json({ message: `Bienvenue ${newUser.email} !` }))
            .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
});
  
router.post(`${baseUrl}/auth/login`, (req, res) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'User not found!' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Incorrect password!' });
                    }
                const token = jwt.sign({ userId: user._id }, 'RANDOM_TOKEN_SECRET', { expiresIn: '24h' });
                res.status(200).json({
                    userId: user._id,
                    token: token
                });
            })
            .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
});