const breakLine = "\n";

const createOtpMessage = (otp) => {
  var stringChat =
    "Kode verifikasi KulkasExpress anda adalah" +
    breakLine +
    "*" +
    otp +
    "* " +
    breakLine +
    "Kode ini hanya berlaku selama 5 menit.";
  return stringChat;
};

const otpNumber = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

const maskPhoneNumber = (number) => {
  const num = String(number);
  if (num.charAt(0) == 0) return "62" + num.substring(1) + "@c.us";
  if (num.charAt(0) == 8) return "62" + num + "@c.us";
  return num + "@c.us";
};

const trimPhoneNumber = (number) => {
  const num = String(number);
  if (num.charAt(0) == 0) return "62" + num.substring(1);
  if (num.charAt(0) == 8) return "62" + num;
  return num;
};

module.exports = {
  trimPhoneNumber,
  maskPhoneNumber,
  otpNumber,
  createOtpMessage,
};
