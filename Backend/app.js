//Author: Aryan Shah
//Description: This demo app demonstrates the use of modules, routes and database operations using the Express.js framework

var express = require('express');
var routes = require('./routes.js');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
var http = require('http').Server(app);
const io = require("socket.io")(http, {cors: {origin: "*", methods: ["GET", "POST"]}});

const port = 3000;

//Get access to request body for POST requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Apply CORS to allow cross origin access
app.use(cors());

//use routes modue for /
app.use('/', routes);




io.on('connection', function (socket) {
    //socket for the player click sends back the move to all connections except the sender
    socket.on('playermove', function(move){
        //send the player move to all connections except the sender
        socket.broadcast.emit('playermoved',move);
    });  

    //sends the reset signal to the connections except user to reset the miniboard
    socket.on('reset',function(status){
        if(status.reset == true){
            //send reset signal to all connections except the sender
            socket.broadcast.emit('resetted',status)
        }
    })    

    socket.on('disconnect',function(){
        socket.broadcast.emit('resetted',{reset:true});
    })
    

});


//Listen for connections on port 3000
http.listen(port, () => console.log("Server running on port: "+port));


