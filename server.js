const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
    cors: {
        origin: ["http://localhost:5173", "http://localhost:5174"],
        methods: ["GET", "POST"]
    }
});

app.use(express.static('public'));

io.on('connection', function (socket) {
    console.log('New socket connection:', socket.id);

    socket.on('create', function (callback) {
        console.log('Create call request from:', socket.id);
        callback(socket.id);
    });

    socket.on('join', function (code) {
        console.log('receiver joined', socket.id, 'sending join status to', code);
        io.to(code).emit('ready', socket.id);
    });

    socket.on('candidate', function (event) {
        console.log('sending candiadte to', event.sendTo);
        io.to(event.sendTo).emit('candidate', event);
    });

    socket.on('offer', function (event) {
        console.log('sending offer to', event.receiver);
        io.to(event.receiver).emit('offer', { event: event.sdp, caller: socket.id });
    });

    socket.on('answer', function (event) {
        console.log('sending answer to', event.caller);
        io.to(event.caller).emit('answer', event.sdp);
    });

});

http.listen(3000, function () {
    console.log('listening on *:3000');
});