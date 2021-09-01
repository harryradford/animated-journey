// Import npm modules.
import sgMail from '@sendgrid/mail'

// Set the API key from the environment variable.
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

// Send a welcome email.
const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'harry.radford@live.co.uk',
        subject: 'Welcome to Task Manager',
        text: `Hi ${name}. Welcome to Task Manager.`
    })
}

// Send a cancellation email.
const sendCancellationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'harry.radford@live.co.uk',
        subject: 'Sorry to see you go',
        text: `Hi ${name}. Sorry to see you go.`
    })
}

// Module exports.
export {
    sendWelcomeEmail,
    sendCancellationEmail
}
