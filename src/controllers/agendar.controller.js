const AgendarModel = require('../models/agendarModel');
const { sendMeetingInvitation } = require('../util/emailService');
const { sendWhatsAppNotification } = require('../util/whatsappService');

const agendarController = {};

agendarController.scheduleOneToOne = async (req, res) => {
    try {
        const { selectedUserId, date, time } = req.body;

        // Validaciones básicas
        if (!selectedUserId || !date || !time) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // Verificar disponibilidad del usuario seleccionado
        const isAvailable = await AgendarModel.checkUserAvailability(selectedUserId, date, time);
        
        if (!isAvailable) {
            return res.status(400).json({
                success: false,
                message: 'Selected user is not available at this time'
            });
        }

        // Crear la reunión
        const result = await AgendarModel.createOneToOne(selectedUserId, date, time);

        if (result.affectedRows > 0) {
            try {
                // Obtener información de contacto del usuario
                const userContact = await AgendarModel.getUserContact(selectedUserId);
                
                if (userContact) {
                    // Array de promesas para enviar notificaciones
                    const notificationPromises = [];

                    // Enviar email si hay dirección de correo
                    if (userContact.email) {
                        notificationPromises.push(
                            sendMeetingInvitation(userContact.email, { date, time })
                        );
                    }

                    // Enviar WhatsApp si hay número de teléfono
                    if (userContact.phone) {
                        notificationPromises.push(
                            sendWhatsAppNotification(userContact.phone, { date, time })
                        );
                    }

                    // Esperar a que se envíen todas las notificaciones
                    await Promise.allSettled(notificationPromises);
                }

                res.json({
                    success: true,
                    message: 'Meeting scheduled and notifications sent successfully',
                    meetingId: result.insertId
                });
            } catch (notificationError) {
                console.error('Error sending notifications:', notificationError);
                res.json({
                    success: true,
                    message: 'Meeting scheduled but failed to send some notifications',
                    meetingId: result.insertId
                });
            }
        } else {
            res.status(400).json({
                success: false,
                message: 'Failed to schedule meeting'
            });
        }
    } catch (error) {
        console.error('Error in scheduleOneToOne:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

module.exports = agendarController;