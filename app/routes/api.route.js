var express = require("express");
const {
  qrcode,
  status,
  sendOtp,
  validateOtp,
} = require("../controllers/api.controller");
var router = express.Router();

router.get("/", (req, res, next) => next());
router.get("/qrcode", qrcode);
router.get("/status", status);
router.post("/sendotp", sendOtp);
router.post("/validate", validateOtp);

module.exports = router;
