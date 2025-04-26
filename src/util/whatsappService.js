const axios = require('axios');
require('dotenv').config();

const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const TEST_PHONE_NUMBER = '5551424979';
const VERSION = 'v17.0';

const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

const formatNumber = (phoneNumber) => {
    // Remove any non-numeric characters
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    // Ensure it starts with country code (52 for Mexico)
    if (!cleaned.startsWith('52')) {
        return '52' + cleaned;
    }
    return cleaned;
};

const sendWhatsAppNotification = async (recipientPhone, meetingDetails) => {
    try {
        // For testing, use the test phone number
        const isTestMode = process.env.NODE_ENV !== 'production';
        const phoneToUse = isTestMode ? TEST_PHONE_NUMBER : recipientPhone;

        const url = `https://graph.facebook.com/${VERSION}/${WHATSAPP_PHONE_NUMBER_ID}/messages`;
        
        const formattedDate = formatDate(meetingDetails.date);
        const formattedPhone = formatNumber(phoneToUse);

        const message = {
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: formattedPhone,
            type: "template",
            template: {
                name: "reunion_onetoone",
                language: {
                    code: "en"
                },
                components: [
                    {
                        type: "body",
                        parameters: [
                            {
                                type: "text",
                                text: formattedDate
                            },
                            {
                                type: "text",
                                text: meetingDetails.time
                            }
                        ]
                    }
                ]
            }
        };

        const headers = {
            'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
            'Content-Type': 'application/json'
        };

        console.log('Sending WhatsApp notification:', {
            phoneNumber: formattedPhone,
            date: formattedDate,
            time: meetingDetails.time
        });

        const response = await axios.post(url, message, { headers });
        console.log('WhatsApp notification sent successfully:', response.data);
        return response.data;

    } catch (error) {
        console.error('Error sending WhatsApp notification:', error.response?.data || error.message);
        throw error;
    }
};

module.exports = {
    sendWhatsAppNotification
};