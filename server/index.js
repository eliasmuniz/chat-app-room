// Create server
const express = require('express');
const socketio = require('socket.io'); //https://socket.io/
const http = require('http');

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
    console.log("We have a new CONNECTION");

    socket.on('join',({name, room}, callback)=> {
        console.log(name, room);

        const error = true;

    })

    socket.on('disconnected', () => {
        console.log("User had left");
    })
});

app.use(router)

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));