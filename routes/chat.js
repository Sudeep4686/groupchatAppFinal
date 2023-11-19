const express = require('express');
const router = express.Router();
const chatC = require('../controllers/chatC');
const userAuth = require('../middleware/authorisation');

router.post('/chats',userAuth.authenticate,chatC.saveMessage);
router.get('/chats',userAuth.authenticate,chatC.getMessage);

module.exports=router;