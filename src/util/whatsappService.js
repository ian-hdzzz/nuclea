const axios = require('axios');
require('dotenv').config();

const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const VERSION = 'v17.0';

const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

const formatNumber = (phoneNumber) => {
    // Eliminar cualquier carácter que no sea número
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    // Asegurarse que empiece con el código de país (52 para México)
    if (!cleaned.startsWith('52')) {
        return '52' + cleaned;
    }
    return cleaned;
};

const sendWhatsAppNotification = async (recipientPhone, meetingDetails) => {
    try {
        const url = `https://graph.facebook.com/${VERSION}/${WHATSAPP_PHONE_NUMBER_ID}/messages`;
        
        const formattedDate = formatDate(meetingDetails.date);
        const formattedPhone = formatNumber(recipientPhone);

        const message = {
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: formattedPhone,
            type: "template",
            template: {
                name: "reunion_onetoone",
                language: {
                    code: "es"
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