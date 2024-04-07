const express = require("express");
const Room = require("../models/Room")

const { createRoom, getRooms , addUserToRoom} = require("../controllers/Room")
const { isAuthenticated } = require('../middlewares/isAuthenticated');

const router = express.Router();

router.post("/room", isAuthenticated, createRoom)
router.get("/rooms", isAuthenticated, getRooms)
router.post("/adduser" , addUserToRoom)

module.exports = router;
