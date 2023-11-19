const express = require("express");
const userAuth = require("../middleware/authorisation");
const NewGroupC = require("../controllers/newgroupC");
const router = express.Router();
router.post(
    "/groupname",
    userAuth.authenticate,
    NewGroupC.createNewGroup
);
router.get(
    "/users/getUsers",
    userAuth.authenticate,
    NewGroupC.getUsers
);
router.get(
    "/add-user",
    userAuth.authenticate,
    NewGroupC.addUserToGroup
);
router.delete(
    "/delete-user",
    userAuth.authenticate,
    NewGroupC.deleteUserFromGroup
);
router.post(
    "/edit-group",
    userAuth.authenticate,
    NewGroupC.postUpdateGroup
);

module.exports = router;