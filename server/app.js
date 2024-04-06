const express = require('express')
const http = require('http')
const app = express()
const {Server} = require('socket.io')
const cors = require('cors')

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
        origin: 'https://localhost:5173',
        methods: ['GET', 'POST'],
    }
})

//routes
const User = require('./routes/User')
app.use('/api/v1',User)

module.exports = server