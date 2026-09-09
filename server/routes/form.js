@'
const express = require("express");
const router = express.Router();
const { sendMail } = require("../services/email");
const { appendRow } = require("../services/sheets");

router.post("/submit", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    await sendMail(email, "Form Submitted", `Hi ${name}, thanks for submitting!`);
    await sendMail(process.env.GMAIL_USER, "New Student Submission", `${name} submitted: ${message}`);
    await appendRow([name, email, message]);
    res.status(200).send("Form submitted successfully!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error submitting form");
  }
});

module.exports = router;
'@ | Out-File server\routes\form.js -NoClobber
