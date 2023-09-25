const express = require('express');
const router = express.Router();
const groupC = require('../controllers/groups');
const userAuth = require('../middleware/authorisation');

router.get('/userlist',userAuth.authenticate,groupC.getUserList);
router.post('/adduser',userAuth.authenticate,groupC.AddToGroup);
router.get('/:groupId/groupChat',userAuth.authenticate,groupC.getMessages);
router.post('/:groupId/groupChat',userAuth.authenticate,groupC.saveMessage);

module.exports = router;