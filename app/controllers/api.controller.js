const waService = require("../services/whatsapp.service");
const QRCode = require("qrcode");
const moment = require("moment");
const wa = new waService();
const {
  maskPhoneNumber,
  otpNumber,
  trimPhoneNumber,
  createOtpMessage,
} = require("../utils/helper.util");

let recentOTP = [];

const qrcode = (req, res, next) => {
  if (wa.qrCode == null || typeof wa.qrCode === undefined)
    return res.json({
      status: false,
      message: "QrCode is empty or null",
      data: null,
    });

  QRCode.toDataURL(wa.qrCode)
    .then((val) => {
      return res.json({ status: true, message: "success", data: val });
    })
    .catch((err) => {
      return res.status(401).json({ status: false, message: err, data: null });
    });
};

const status = (req, res, next) => {
  res.json({ status: true, message: "success", data: wa.connectionStatus });
};

const sendMessage = async (req, res, next) => {
  const id = "6281272128270@c.us";
  const sendMsg = await wa.conn.sendMessage(id, {
    text: "Kode verifikasi anda adalah BELEK",
  });
  res.json({ status: true, message: "success", data: sendMsg });
};

const sendOtp = async (req, res, next) => {
  var number = maskPhoneNumber(req.body.number);
  var otp = otpNumber();
  var actived = moment().add(5, "m").toDate();
  var sendOtp = {
    number: trimPhoneNumber(req.body.number),
    otp: otp,
    actived: actived,
  };
  try {
    const isValidNumber = await checkNumber(maskPhoneNumber(req.body.number));
    console.log("Number is ==> " + isValidNumber);
    console.log(number);
    if (!isValidNumber)
      return res
        .status(404)
        .json({ status: false, response: "Number is not valid!" });

    await wa.conn.sendMessage(number, {
      text: createOtpMessage(otp),
    });
    recentOTP.push(sendOtp);
    console.log(recentOTP);
    return res.json({ status: true, response: "success" });
  } catch (error) {
    return res.status(422).json({ status: false, response: error.message });
  }
};
async function checkNumber(number) {
  const id = number;
  const [result] = await wa.conn.onWhatsApp(id);
  if (result.exists) return true;
  return false;
}

const validateOtp = (req, res, next) => {
  otp = req.body.code;
  number = trimPhoneNumber(req.body.number);
  console.log(otp);
  console.log(number.toString());
  const getOtp = recentOTP.filter(
    (p) => p.number == number.toString() && p.otp == otp
  );
  const reRecentOtp = recentOTP.filter(
    (p) => p.number !== number && p.otp !== otp
  );
  const OtpExpired = recentOTP.filter((p) => {
    const now = moment();
    let end = moment(p.actived);
    var diff = end.diff(now, "m");
    return diff > 0;
  });
  console.log(getOtp);
  if (getOtp.length > 0) {
    const now = moment();
    let end = moment(getOtp[0]["actived"]);
    var diff = end.diff(now, "m");
    if (diff > 0) {
      recentOTP = reRecentOtp;
      return res.json({
        status: true,
        message: "success",
        data: "validate is success",
      });
    }
    recentOTP = reRecentOtp;
    return res
      .status(422)
      .json({ status: false, response: "Kode anda sudah kadaluarsa" });
  }
  recentOTP = OtpExpired;
  return res
    .status(404)
    .json({ status: false, response: "Kode yang anda masukan salah" });
};

module.exports = {
  qrcode,
  status,
  sendMessage,
  sendOtp,
  validateOtp,
};
