var express = require("express");
var router = express.Router();

router.get("/", (req, res, next) => res.send("Is not for public OK!"));

module.exports = router;
