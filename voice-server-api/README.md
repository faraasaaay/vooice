# WebRTC Voice Server API

This is the backend signaling server for the WebRTC voice calling application.

## Features

- Socket.IO based signaling server
- WebRTC peer connection management
- CORS enabled for cross-origin requests
- Health check endpoint
- Vercel deployment ready

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

The server will run on port 3000 by default.

## Deployment to Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow the prompts to deploy your API.

## API Endpoints

- `GET /` - API information
- `GET /health` - Health check
- `WebSocket /socket.io` - Socket.IO connection for signaling

## Environment Variables

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (production/development)

## Socket Events

### Client to Server:
- `create` - Create a new call room
- `join` - Join an existing call room
- `offer` - Send WebRTC offer
- `answer` - Send WebRTC answer
- `candidate` - Send ICE candidate

### Server to Client:
- `ready` - Room is ready for connection
- `offer` - Receive WebRTC offer
- `answer` - Receive WebRTC answer
- `candidate` - Receive ICE candidate
