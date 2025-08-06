# WebRTC Voice Calling Application

A simple voice peer-to-peer calling application implemented using WebRTC with separate frontend and backend hosting.

## Architecture

- **Frontend**: React application with Vite (this folder)
- **Backend**: Voice Server API in `voice-server-api/` folder (Socket.IO signaling server)

## Quick Start (Local Development)

### 1. Start the Voice Server API

```bash
cd voice-server-api
npm install
npm start
```

The API will run on `http://localhost:3000`

### 2. Start the Frontend

```bash
# In the root directory
npm install
npm run dev
```

The frontend will run on `http://localhost:5173`

### 3. Test the Application

- Open `http://localhost:5173` in two different browser tabs/windows
- Create a call in one tab and join with the code in another tab

## Production Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions on deploying to Vercel, Netlify, or other platforms.

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
