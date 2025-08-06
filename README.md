# WebRTC Voice Calling Application

A simple voice peer-to-peer calling application implemented using WebRTC.

## Architecture

- **Frontend**: React application with Vite
- **Backend**: Voice Server API (hosted separately) - Socket.IO signaling server

## Configuration

### 1. Deploy the Voice Server API

The voice server API is located in the `voice-server-api/` folder and needs to be deployed separately.

1. Deploy the `voice-server-api/` folder to Vercel, Railway, or any Node.js hosting platform
2. Update the API URL in `src/config/api.js` with your deployed API URL

### 2. Start the Frontend (Local Development)

```bash
npm install
npm run dev
```

The frontend will run on `http://localhost:5173`

### 3. Production Deployment

Deploy the frontend to Vercel, Netlify, or any static hosting platform after configuring the API URL.

## Features

- High-quality voice calling using WebRTC
- Real-time signaling with Socket.IO
- Mute/unmute functionality
- Simple room-based calling (create/join with code)
- Optimized for voice-only communication
- Separate frontend and backend for flexible hosting

# Screenshots (Old UI)

![screen2](/Screenshots/screen2.png?raw=true "Screen2")
![screen1](/Screenshots/screen1.png?raw=true "Screen1")

# Reference

https://github.com/agilityfeat/webrtc-audio-demo
