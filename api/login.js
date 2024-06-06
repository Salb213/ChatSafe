const nodemailer = require('nodemailer');
const geoip = require('geoip-lite');

const transporter = nodemailer.createTransport({
  service: 'hotmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

module.exports = async (req, res) => {
  try {
    const { email, username, age, lat, lon } = req.body;
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const geo = geoip.lookup(ip);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'aria.evercrest@gmail.com',
      subject: 'New User Login',
      text: `User Email: ${email}\nUsername: ${username}\nAge: ${age}\nIP: ${ip}\nLocation: ${geo ? `${geo.city}, ${geo.country}` : 'Unknown'}\nCoordinates: ${lat}, ${lon}`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent' });
  } catch (error) {
    res.status(500).json({ error: 'Error sending email' });
  }
};
