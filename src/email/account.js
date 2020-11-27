const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (name, email) =>{
    sgMail.send({
        to: email,
        from: 'khanhamdan16200@gmail.com',
        subject: 'Thanks for joining Task App!',
        text: `Hi ${name}. Welcome to Task App. Cool`
    })
}

const sendCancelEmail = (name, email) =>{
    sgMail.send({
        to: email,
        from: 'khanhamdan16200@gmail.com',
        subject: 'Account Deleted',
        text: `Sorry to see you leaving ${name}. Could things have been done better?`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelEmail
}