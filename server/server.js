const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

const {generateMessage}=require('./utils/message')
app.use(express.static(publicPath));

//io server instance 
io.on('connection', (socket) => {
  console.log('New user connected');
//from server to client -> server emits client listens this will be written on browser consloe client side
  socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
///from server to client side that will be logged on browser console
  socket.broadcast.emit('newMessage',generateMessage('Admin', 'New user joined') );

  ///from client to server
  socket.on('createMessage', (message, callback) => {
    ///this will be logged on console server received from client index.js 
    console.log('createMessage', message);
    //server-> client 
    io.emit('newMessage', generateMessage(message.from,message.text));
    callback('This is from server');
    // socket.broadcast.emit('newMessage', {
    //   from: message.from,
    //   text: message.text,
    //   createdAt: new Date().getTime()
    // });
  });

  socket.on('disconnect', () => {
    console.log('User was disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
