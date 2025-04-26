const whatsappController = {};

// Token de verificación que usaremos para Meta Developers
const VERIFY_TOKEN = 'nuclea_whatsapp_verify_token';

whatsappController.verifyWebhook = (req, res) => {
    console.log('Received webhook verification request:', {
        mode: req.query['hub.mode'],
        token: req.query['hub.verify_token'],
        challenge: req.query['hub.challenge']
    });

    // Verificar el token y el desafío del webhook
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    // Verificar que sea una petición de verificación de token
    if (mode && token) {
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            console.log('WEBHOOK_VERIFIED - Challenge accepted:', challenge);
            res.status(200).send(challenge);
        } else {
            console.log('WEBHOOK_VERIFICATION_FAILED - Invalid token or mode', {
                expectedToken: VERIFY_TOKEN,
                receivedToken: token,
                mode: mode
            });
            res.sendStatus(403);
        }
    } else {
        console.log('WEBHOOK_VERIFICATION_FAILED - Missing parameters', {
            mode: mode,
            token: token
        });
        res.sendStatus(400);
    }
};

whatsappController.handleWebhook = (req, res) => {
    try {
        console.log('Received webhook POST request:', {
            headers: req.headers,
            body: JSON.stringify(req.body, null, 2)
        });

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
                res.sendStatus(200);
            } else {
                // No es un mensaje, pero podría ser otro tipo de notificación
                res.sendStatus(200);
            }
        } else {
            console.log('WEBHOOK_INVALID_OBJECT:', body);
            res.sendStatus(404);
        }
    } catch (error) {
        console.error('Error handling webhook:', error);
        res.sendStatus(500);
    }
};

module.exports = whatsappController;