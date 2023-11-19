const express = require('express');
const userC =require('../controllers/userC')
const router = express.Router();
router.post('/signup', userC.signUp);
router.post('/login',userC.login);
module.exports = router;