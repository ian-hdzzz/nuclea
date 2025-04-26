const whatsappController = {};

// Token de verificación que configurarás en Meta Developers
const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'nuclea_whatsapp_verify_token';

whatsappController.verifyWebhook = (req, res) => {
    // Verificar el token y el desafío del webhook
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    // Verificar que sea una petición de verificación de token
    if (mode && token) {
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    } else {
        res.sendStatus(400);
    }
};

whatsappController.handleWebhook = (req, res) => {
    try {
        const body = req.body;

        // Verificar que sea un evento de WhatsApp
        if (body.object) {
            if (body.entry && 
                body.entry[0].changes && 
                body.entry[0].changes[0].value.messages && 
                body.entry[0].changes[0].value.messages[0]
            ) {
                const phone_number_id = body.entry[0].changes[0].value.metadata.phone_number_id;
                const from = body.entry[0].changes[0].value.messages[0].from;
                const msg_body = body.entry[0].changes[0].value.messages[0].text.body;

                console.log('Message received:', {
                    from,
                    message: msg_body,
                    phone_number_id
                });

                // Aquí puedes implementar la lógica para manejar las respuestas
                // Por ejemplo, confirmar la asistencia a la reunión
            }
            res.sendStatus(200);
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        console.error('Error handling webhook:', error);
        res.sendStatus(500);
    }
};

module.exports = whatsappController;