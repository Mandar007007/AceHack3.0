const express = require('express')
const http = require('http')
const app = express()
const {Server} = require('socket.io')
const cors = require('cors')
const superheroes = require('superheroes')

const cookieParser = require('cookie-parser')

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))

const server = http.createServer(app)

io = new Server(server,{
    cors:{
        origin: '*',
        methods: ['GET', 'POST'],
    },
    
})

const emailToSocketIdMap = new Map();
const socketidToEmailMap = new Map();

io.on("connection", socket => {
    
	const username = superheroes.random();
	const users = {};
	users[socket.id] = username;

	// console.log(User ${users[socket.id]} connected);

	socket.on("disconnect", () => {
		// console.log(User ${users[socket.id]} disconnected);
	});

	socket.on("send-url", ( url, room) => {
        console.log("url has been updated " , url )
		io.to(room).emit("recv-url", url);
	});

	socket.on("send-data", (data, room) => {
		// const clients = io.sockets.adapter.rooms.get(room);
		// const first = [...clients][0];
		// console.log(first);
		// if (first === socket.id)
		console.log("data has been updated " , data )
		io.to(room).emit("recv-data", data);
	});

	socket.on("send-state", (state, room) => {
		io.to(room).emit("recv-state", state);
	});

	socket.on("send-seek", (seek, room) => {
		io.to(room).emit("recv-seek", seek);
	});

	socket.on("send-rewind", (rewind, room) => {
		io.to(room).emit("recv-rewind", rewind);
	});

	socket.on("send-forward", (forward, room) => {
		io.to(room).emit("recv-forward", forward);
	});

	socket.on("send-rate", (rate, room) => {
		io.to(room).emit("recv-rate", rate);
	});

	socket.on("join-room", data => {

		const { email , room } = data;
		socket.join(room);

		emailToSocketIdMap.set(email, socket.id);
    	socketidToEmailMap.set(socket.id, email);

		console.log(`${email} joined ${room}` )
    	io.to(room).emit("user:joined", { email, id: socket.id });
        
		io.to(socket.id).emit("join-room", data);
	});

    socket.on('offer', ({ id, offer }) => {
        // Send the offer to the specified user
        socket.to(id).emit('offer', { id: socket.id, offer });
      });
    
      socket.on('answer', ({ id, answer }) => {
        // Send the answer to the specified user
        socket.to(id).emit('answer', { id: socket.id, answer });
      });
    
      socket.on('ice-candidate', ({ id, candidate }) => {
        // Send the ICE candidate to the specified user
        socket.to(id).emit('ice-candidate', { id: socket.id, candidate });
      });

	socket.on("leave-room", room => {
		socket.leave(room);
		console.log(`User ${users[socket.id]} left ${room}`);
	});
});

//routes
const User = require('./routes/User')
const Room = require('./routes/Room')
app.use('/api/v1',User)
app.use('/api/v1',Room)

module.exports = server