const mongoose = require("mongoose")
const roomSchema = new mongoose.Schema({
    ownerId : {
        type : mongoose.Schema.ObjectId,
        ref : "User" ,
        required : true

    },
    description : {
        type : String,
        required : true
    },

    dateCreated : {
        type : Date,
        default : Date.now
    },

    room_code : {
        type : String ,
        required : true
    },

    users : [
        {
            type : mongoose.Schema.ObjectId,
            ref : "User"
        }
    ]

})


module.exports = mongoose.model("Room", roomSchema)