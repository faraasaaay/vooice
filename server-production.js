const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
    cors: {
        origin: [
            "http://localhost:5173", 
            "http://localhost:5174",
            "https://your-frontend-domain.com", // Add your frontend domain here
            process.env.FRONTEND_URL // Allow environment variable
        ],
        methods: ["GET", "POST"]
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
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
        console.log('sending candidate to', event.sendTo);
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

const PORT = process.env.PORT || 3000;
http.listen(PORT, function () {
    console.log(`Voice server listening on port ${PORT}`);
});
