const express = require('express');
const router = express.Router();
const baseUrl = "/api/auth"
const usersCtrl =require('../controllers/users')

router.post(`${baseUrl}/signup`, usersCtrl.signup);
router.post(`${baseUrl}/login`, usersCtrl.signin);

module.exports = router;