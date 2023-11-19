const express = require('express');
const router = express.Router();
const groupC = require('../controllers/groupC');
const userAuth = require('../middleware/authorisation');

router.get(
    "/getgroups",
    userAuth.authenticate,
    groupC.getGroups
);
router.get( 
    "/getMembers",
    userAuth.authenticate,
    groupC.getMembers
);
router.get(
    "/getNonMembers",
    userAuth.authenticate,
    groupC.getNonMembers
);

module.exports = router;