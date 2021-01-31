const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'g.maged327@gmail.com',
    subject: 'Welcome to Task App!',
    text: `Welcom to the app, ${name}! Enjoy your experience with the task app and don't miss any todos.`,
  })
}

const sendCancelEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'g.maged327@gmail.com',
    subject: 'Sorry to see you leave!',
    text: `Goodbye ${name}!`,
  })
}

module.exports = { sendWelcomeEmail, sendCancelEmail }
