import io from 'socket.io-client';

class WebRTCService {
  constructor() {
    // Configure the voice server URL
    const VOICE_SERVER_URL = process.env.REACT_APP_VOICE_SERVER_URL || 'http://localhost:3000';
    
    this.socket = io(VOICE_SERVER_URL, {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true
    });
    
    this.localStream = null;
    this.remoteStream = null;
    this.rtcPeerConnection = null;
    this.isCaller = false;
    this.caller = null;
    this.receiver = null;
    this.isConnected = false;

    // Add connection debugging
    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket.id);
      this.isConnected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.isConnected = false;
    });
    
    // ICE servers configuration
    this.iceServers = {
      iceServers: [
        { urls: 'stun:stun.services.mozilla.com' },
        { urls: 'stun:stun.l.google.com:19302' }
      ]
    };

    // Optimized audio constraints for high quality and smooth audio
    this.streamConstraints = {
      audio: {
        autoGainControl: false,
        echoCancellation: false,
        noiseSuppression: false,
        channelCount: 2,
        sampleRate: 48000,
        sampleSize: 16,
        latency: 0,
        volume: 1.0
      },
      video: false // Voice only - no video
    };

    this.setupSocketListeners();
  }

  // ... rest of the methods remain the same
}
