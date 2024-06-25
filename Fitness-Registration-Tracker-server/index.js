const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const QRCode = require('qrcode');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const port = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Dummy endpoint for testing
app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

// Endpoint for registration
app.post('/register', async (req, res) => {
  const { fullName, email, address, phoneNumber, membershipOption, membershipPrice } = req.body;

  // Generate QR code
  const qrCodeData = `${fullName}-${membershipOption}`;
  const qrCodePath = path.join(__dirname, 'qrcode.png');

  await QRCode.toFile(qrCodePath, qrCodeData);

  // Send confirmation email with QR code
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: 'Thank you for registering!',
    html: `
      <p>Thank you for registering, ${fullName}!</p>
      <p>Your membership option: ${membershipOption}</p>
      <p>See the attached QR code for your membership details.</p>
    `,
    attachments: [
      {
        filename: 'qrcode.png',
        path: qrCodePath,
        cid: 'qrcode' // Use a unique ID for the image
      }
    ]
  };

  try {
    await transporter.sendMail(mailOptions);
    fs.unlinkSync(qrCodePath); // Delete the QR code file after sending the email
    res.status(200).send('Registration successful and email sent!');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Error sending email.');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
