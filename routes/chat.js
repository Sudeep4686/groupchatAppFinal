const express = require('express');
const router = express.Router();
const chatC = require('../controllers/chatC');
const userAuth = require('../middleware/authorisation');

router.post('/Chats',userAuth.authenticate,chatC.saveMessage);

module.exports=router;
