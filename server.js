//import modules
const express = require('express');
const app = express();
const mongoose = require('mongoose');
global.__basedir = __dirname;
const passport = require('passport');
const bodyParser = require('body-parser');
const cors = require("cors");
const http = require('http');
//import js
const keys = require('./config/key');
const route = require('./router');
const path = require('path');
//middleware init
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(passport.initialize());
require('./config/passport')(passport);
//apply router
app.use(cors())
app.use('/api', route);
//db connect
mongoose.connect(keys.mongoURI, console.log("MongoDB connected ... "));

const server = http.createServer(app);
app.use(express.static(__dirname+ '/build'));
app.get('*',(req, res) => {
    //console.log(__dirname + '/public/index.html');
    res.sendFile(path.join(__dirname , '/build/index.html'));
})
//start server
server.listen(keys.PORT, () => {
    console.log(`Server is running on port ${keys.PORT}...`)
})

const io = require('socket.io')(server,
    {
        cors:{
            origin:'*'
        }
    });
const events = require('node:events');
global.eventEmitter = new events.EventEmitter();

io.on('connection', socket => {
    console.log(socket.id)
    eventEmitter.on('lazy', data => {
        socket.emit('lazy_person', data);
    })
});