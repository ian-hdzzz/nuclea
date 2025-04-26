const AgendarModel = require('../models/agendarModel');

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
            res.json({
                success: true,
                message: 'Meeting scheduled successfully',
                meetingId: result.insertId
            });
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