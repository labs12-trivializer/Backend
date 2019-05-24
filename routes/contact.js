const router = require('express').Router();
const nodemailer = require('nodemailer');

router.post('/', async (req, res) => {
  const { name, email, message } = req.body;
  // transporter object
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  //mail object set up
  let mailOptions = {
    from: 'lambda.trivializer@gmail.com',
    to: 'lambda.trivializer@gmail.com',
    subject: `TRIVIABASE MESSAGE FROM: ${name} (${email})`,
    text: `${message}`
  };

  // send mail with defined transport object
  await transporter.sendMail(mailOptions, function(err, data) {
    if (err) {
      res.status(401).json(err);
    } else {
      res.status(200).json(data);
      console.log('email sent!');
    }
  });
});

module.exports = router;
