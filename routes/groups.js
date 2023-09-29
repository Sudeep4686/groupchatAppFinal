const express = require('express');
const router = express.Router();
const groupC = require('../controllers/groups');
const userAuth = require('../middleware/authorisation');

router.post('/:groupId/groupChat',userAuth.authenticate,groupC.saveMessage);
router.get('/:groupId/groupChat',userAuth.authenticate,groupC.getMessages);
router.get('/userlist',userAuth.authenticate,groupC.getUserList);
router.post('/adduser',userAuth.authenticate,groupC.AddToGroup);
router.get('/:groupId/groupMembers',userAuth.authenticate,groupC.getMembers);
router.post('/:groupId/removeUser',userAuth.authenticate,groupC.removeUser);
router.get('/:groupId/checkAdmin',userAuth.authenticate,groupC.getAdmin);
router.put('/:groupId/makeAdmin',userAuth.authenticate,groupC.makeAdmin);

module.exports = router;