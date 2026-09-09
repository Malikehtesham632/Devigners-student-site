@'
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

async function sendMail(to, subject, text) {
  return transporter.sendMail({ from: process.env.GMAIL_USER, to, subject, text });
}

module.exports = { sendMail };
'@ | Out-File server\services\email.js -NoClobber
