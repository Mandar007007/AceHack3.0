
const server = require('./app');
const {connectDatabase} = require('./config/dbconnect');
require("dotenv").config({path:'./config/config.env'})
connectDatabase();

server.listen(3000,() => {
    console.log('listening on port 3000')
})