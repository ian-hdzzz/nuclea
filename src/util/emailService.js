const nodemailer = require('nodemailer');
require('dotenv').config();

const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD
        },
        pool: true, // Use pooled connections
        maxConnections: 3,
        rateDelta: 1000,
        rateLimit: 3
    });
};

const getFormattedDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

const getFormattedTime = (time) => {
    return time;
};

const sendMeetingInvitation = async (recipientEmail, meetingDetails) => {
    try {
        const transporter = createTransporter();
        const formattedDate = getFormattedDate(meetingDetails.date);
        const formattedTime = getFormattedTime(meetingDetails.time);
        
        // Create HTML content with semantic markup
        const htmlContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
                    <h1 style="color: #2c3e50; margin-bottom: 20px;">One-to-One Meeting Invitation</h1>
                    <p style="margin-bottom: 15px;">You have been invited to a one-to-one meeting.</p>
                    
                    <div style="background-color: #ffffff; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                        <h2 style="color: #2c3e50; font-size: 18px; margin-bottom: 15px;">Meeting Details</h2>
                        <p style="margin-bottom: 10px;"><strong>Date:</strong> ${formattedDate}</p>
                        <p style="margin-bottom: 10px;"><strong>Time:</strong> ${formattedTime}</p>
                    </div>
                    
                    <div style="margin-top: 30px;">
                        <p>This is an automated message from the Nuclea One-to-One Meeting System.</p>
                        <p>Please do not reply to this email.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        // Create plain text version
        const textContent = `
One-to-One Meeting Invitation

You have been invited to a one-to-one meeting.

Meeting Details:
Date: ${formattedDate}
Time: ${formattedTime}

This is an automated message from the Nuclea One-to-One Meeting System.
Please do not reply to this email.
        `;

        const emailContent = {
            from: {
                name: 'Nuclea One-to-One',
                address: process.env.GMAIL_USER
            },
            to: recipientEmail,
            subject: 'One-to-One Meeting Invitation',
            text: textContent,
            html: htmlContent,
            headers: {
                'X-Priority': '1',
                'X-MSMail-Priority': 'High',
                'Importance': 'high',
                'List-Unsubscribe': `<mailto:${process.env.GMAIL_USER}?subject=unsubscribe>`,
                'Feedback-ID': 'meeting:nuclea',
                'X-Entity-Ref-ID': `meeting-${Date.now()}`,
                'Message-ID': `<${Date.now()}.${Math.random().toString(36).substring(2)}@nuclea.com>`
            },
            priority: 'high'
        };

        const result = await transporter.sendMail(emailContent);
        console.log('Email sent successfully:', result);
        return result;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

module.exports = {
    sendMeetingInvitation
};