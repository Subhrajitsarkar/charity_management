// services/notificationService.js
require('dotenv').config();
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);//Set the SendGrid API Key

const sendDonationConfirmation = async (userEmail, donationDetails) => {
    const msg = {
        to: userEmail,
        from: process.env.SENDER_EMAIL, // Verified sender email
        subject: 'Donation Confirmation',
        text: `Thank you for donating INR ${donationDetails.amount} to ${donationDetails.charityName} on ${donationDetails.date}. Your payment status is ${donationDetails.paymentStatus}.`,
        html: `<p>Thank you for donating INR <strong>${donationDetails.amount}</strong> to <strong>${donationDetails.charityName}</strong> on ${donationDetails.date}. Your payment status is <strong>${donationDetails.paymentStatus}</strong>.</p>`
    };
    try {
        await sgMail.send(msg);
        console.log('Donation confirmation email sent to', userEmail);
    } catch (error) {
        console.error('Error sending donation confirmation email:', error);
    }
};

const sendCharityUpdateNotification = async (userEmail, updateDetails) => {
    const msg = {
        to: userEmail,
        from: process.env.SENDER_EMAIL,
        subject: 'Charity Update Notification',
        text: `Update from ${updateDetails.charityName}: ${updateDetails.message}`,
        html: `<p>Update from <strong>${updateDetails.charityName}</strong>: ${updateDetails.message}</p>`
    };
    try {
        await sgMail.send(msg);
        console.log('Charity update email sent to', userEmail);
    } catch (error) {
        console.error('Error sending charity update email:', error);
    }
};

const sendReminderNotification = async (userEmail, reminderMessage) => {
    const msg = {
        to: userEmail,
        from: process.env.SENDER_EMAIL,
        subject: 'Donation Reminder',
        text: reminderMessage,
        html: `<p>${reminderMessage}</p>`
    };
    try {
        await sgMail.send(msg);
        console.log('Reminder email sent to', userEmail);
    } catch (error) {
        console.error('Error sending reminder email:', error);
    }
};

module.exports = {
    sendDonationConfirmation,
    sendCharityUpdateNotification,
    sendReminderNotification
};
