const nodemailer = require('nodemailer');

const sendEmail = async options => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USERNAME, // generated ethereal user
      pass: process.env.EMAIL_PASSWORD // generated ethereal password
    }
  });
  // 2) Define email options
  const mailOptions = {
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: options.email, // list of receivers
    subject: options.subject, // Subject line
    text: options.message // plain text body
    // html: '<b>Hello world?</b>' // html body
  };
  // 3) Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;