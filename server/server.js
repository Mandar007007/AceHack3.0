
const server = require('./app');
const {connectDatabase} = require('./config/dbconnect');
require("dotenv").config({path:'./config/config.env'})
connectDatabase();

server.listen(8000,() => {
    console.log('listening on port 8000')
})