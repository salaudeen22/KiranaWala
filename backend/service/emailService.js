const sendEmail = require("../middleware/sendMail");

const sendResetEmail = async (email, resetToken) => {
  const resetUrl = `http://localhost:6565/api/vendors/auth/reset-password/${resetToken}`;
  return sendEmail(email, "Password Reset Request", `Click here to reset your password: ${resetUrl}`);
};

module.exports = {
  sendResetEmail
};
