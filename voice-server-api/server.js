const express = require('express');
const cors = require('cors');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
    cors: {
        origin: "*", // Allow all origins for production deployment
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Enable CORS for all routes
app.use(cors({
    origin: "*",
    credentials: true
}));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Voice Server API is running' });
});

// Basic info endpoint
app.get('/', (req, res) => {
    res.json({ 
        message: 'WebRTC Voice Server API',
        version: '1.0.0',
        endpoints: {
            health: '/health',
            socket: '/socket.io'
        }
    });
});

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

    socket.on('disconnect', function() {
        console.log('Socket disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, function () {
    console.log(`Voice Server API listening on port ${PORT}`);
    console.log(`Health check available at: http://localhost:${PORT}/health`);
});
