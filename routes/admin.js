const express = require("express");
const userAuthentication = require("../middleware/authorisation");
const router = express.Router();
const admincontroller = require("../controllers/adminC");

router.get("/",userAuthentication.authenticate,admincontroller.makeAdmin);
router.delete(
    "/",
    userAuthentication.authenticate,
    admincontroller.removeAdmin
);

module.exports = router;
