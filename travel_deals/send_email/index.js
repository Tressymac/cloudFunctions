require('dotenv').config()
const sgMail = require('@sendgrid/mail');

exports.sendWelcome = (message, context) => {
  console.log(`Encoded message: ${message.data}`);

  const incomingMessage = Buffer.from(message.data, 'base64').toString('utf-8');

  const parsedMessage = JSON.parse(incomingMessage);

  console.log(`Decoded message: ${JSON.stringify(parsedMessage)}`);
  console.log(`Email address: ${parsedMessage.email_address}`);

  // GET OUR API KEY
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  // CREATE AN EMAIL MESSAGE
  const msg = {
    to: parsedMessage.email_address,
    from: process.env.SENDGRID_SENDER,
    subject: "Thanks for signing up for TravelDeals ヾ(・ω・*)",
    text: "Thanks for signing up. We can't wait to share deals with you (つ✧ω✧)つ",
    html: "Thanks for signing up. We can't wait to share <strong>awesome</strong> deals with you (つ✧ω✧)つ"
  };

  // SEND THE MESSAGE THROUGH SENDGRID
  sgMail
  .send(msg)
  .then(() => {}, error => {
    console.error(error);
  });

}