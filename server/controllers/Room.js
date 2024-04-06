const Room = require("../models/Room")

exports.createRoom = async (req, res) => {
    try {
        const { description } = req.body;
        const room = await Room.create({
            ownerId: req.user._id,
            description
        })
        res.status(200).json({
            success: true,
            room
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.getRooms = async (req, res) => {
    try {
        const rooms = await Room.find({ ownerId: req.user._id })
        res.status(200).json({
            success: true,
            rooms
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}