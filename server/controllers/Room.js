const Room = require("../models/Room")

exports.createRoom = async (req, res) => {
    try {
        const { description , room_code , ownerId} = req.body;
        console.log("insdie create room " , description , room_code)
        const room = await Room.create({
            ownerId,
            description,
            room_code
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
        // console.log(req.user_id)
        const rooms = await Room.find();
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


exports.addUserToRoom = async (req, res) => {
    try {
        const { room_code, userId } = req.body;

        
        const room = await Room.findOne({ room_code: room_code });
        if (!room) {
            return res.status(404).json({ success: false, message: 'Room not found' });
        }

        room.users.push(userId);
        await room.save();

        res.status(200).json({ success: true, message: 'User added to the room successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


