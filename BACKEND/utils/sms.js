const twilio = require('twilio');

const client = new twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH
);

const sendSMS = async (to, message) => {
  await client.messages.create({
    body: message,
    to,
    from: process.env.TWILIO_PHONE
  });
};

module.exports = sendSMS;
