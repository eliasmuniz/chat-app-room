// Create server
const express = require('express');
const socketio = require('socket.io'); //https://socket.io/
const http = require('http');

const { addUser, removeUser, getUser, getUsersInRoom } = require('./users.js') 

const PORT = process.env.PORT || 8000;

const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = socketio(server,{
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
      }
}); 

// Socket io initialization
io.on('connection', (socket) => {

    socket.on('join',({name, room}, callback)=> {
        const {error, user} = addUser({id: socket.id, name, room});

        if(error) return callback(error);

        socket.emit('message', {user:'admin', text: `${user.name}, bienvenido a la sala ${user.room}`});
        // Socket broadcast sends a message to everyone
        socket.broadcast.to(user.room).emit('message', {user:'admin', text:`${user.name}, se unió a la sala`})

        socket.join(user.room);

        callback();
    })

    // Expect the event on the backend
    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);

        io.to(user.room).emit('message', {user: user.name, text: message});

        callback();
    });

    socket.on('disconnected', () => {
        console.log("User had left");
    });
});

app.use(router)

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));