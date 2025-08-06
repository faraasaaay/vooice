# Deployment Guide

This guide explains how to deploy the WebRTC Voice Calling application with separate frontend and backend hosting.

## Architecture Overview

- **Frontend**: React application (this folder) - can be hosted on Vercel, Netlify, etc.
- **Backend**: Voice Server API (`voice-server-api/` folder) - Socket.IO signaling server

## Step 1: Deploy the Voice Server API

### Option A: Deploy to Vercel (Recommended)

1. Navigate to the voice server API folder:
```bash
cd voice-server-api
```

2. Install dependencies:
```bash
npm install
```

3. Install Vercel CLI (if not already installed):
```bash
npm i -g vercel
```

4. Deploy to Vercel:
```bash
vercel
```

5. Follow the prompts:
   - Set up and deploy? **Y**
   - Which scope? Choose your account
   - Link to existing project? **N** (for first deployment)
   - Project name: `webrtc-voice-server-api` (or your preferred name)
   - In which directory is your code located? **./voice-server-api**

6. Note the deployment URL (e.g., `https://webrtc-voice-server-api.vercel.app`)

### Option B: Deploy to Railway

1. Go to [Railway.app](https://railway.app)
2. Connect your GitHub repository
3. Select the `voice-server-api` folder as the root
4. Railway will auto-detect the Node.js app and deploy it

### Option C: Deploy to Render

1. Go to [Render.com](https://render.com)
2. Create a new Web Service
3. Connect your repository
4. Set the root directory to `voice-server-api`
5. Use the following settings:
   - Build Command: `npm install`
   - Start Command: `npm start`

## Step 2: Configure the Frontend

1. Copy the environment file:
```bash
cp .env.example .env.local
```

2. Update `.env.local` with your deployed API URL:
```
VITE_VOICE_SERVER_API_URL=https://your-actual-api-url.vercel.app
```

3. Test locally:
```bash
npm install
npm run dev
```

## Step 3: Deploy the Frontend

### Option A: Deploy to Vercel

1. In the root directory (frontend):
```bash
vercel
```

2. Follow the prompts similar to the API deployment

### Option B: Deploy to Netlify

1. Build the project:
```bash
npm run build
```

2. Deploy the `dist` folder to Netlify

### Option C: Deploy to GitHub Pages

1. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

2. Add to package.json scripts:
```json
"homepage": "https://yourusername.github.io/your-repo-name",
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"
```

3. Deploy:
```bash
npm run deploy
```

## Environment Variables

### Frontend (.env.local)
```
VITE_VOICE_SERVER_API_URL=https://your-voice-api-url.com
```

### Backend (Vercel automatically sets)
```
PORT=3000
NODE_ENV=production
```

## Testing the Deployment

1. Open your deployed frontend URL
2. Test creating a call
3. Test joining a call from another browser/device
4. Check browser console for any connection errors

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Make sure the voice server API has CORS enabled for your frontend domain
2. **Socket Connection Failed**: Verify the API URL in your environment variables
3. **WebRTC Connection Issues**: Ensure STUN servers are accessible

### Debug Steps:

1. Check the voice server API health endpoint: `https://your-api-url.com/health`
2. Check browser console for errors
3. Verify environment variables are loaded correctly

## Production Considerations

1. **HTTPS Required**: WebRTC requires HTTPS in production
2. **STUN/TURN Servers**: Consider using dedicated STUN/TURN servers for better connectivity
3. **Rate Limiting**: Implement rate limiting on the API
4. **Monitoring**: Set up monitoring for both frontend and backend
5. **Error Handling**: Implement proper error handling and user feedback

## Scaling

For high traffic, consider:
- Using Redis for Socket.IO scaling
- Load balancing multiple API instances
- CDN for frontend assets
- Dedicated TURN servers for NAT traversal
