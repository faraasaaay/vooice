import io from 'socket.io-client';
import { getSocketURL } from '../config/api.js';

class WebRTCService {
  constructor() {
    // Use the configured API URL
    const socketURL = getSocketURL();
    console.log('Connecting to socket server:', socketURL);

    this.socket = io(socketURL, {
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

  setupSocketListeners() {
    this.socket.on('ready', (code) => {
      console.log('Receiver ready at', code, '- creating peer connection and offer');
      this.receiver = code;
      this.createPeerConnection();

      const offerOptions = {
        offerToReceiveAudio: 1,
        offerToReceiveVideo: 0 // Voice only
      };

      console.log('Creating offer with options:', offerOptions);
      this.rtcPeerConnection.createOffer(offerOptions)
        .then(async (desc) => {
          console.log('Offer created successfully:', desc);
          await this.setLocalAndOffer(desc);
        })
        .catch(e => console.error('Error creating offer:', e));
    });

    this.socket.on('candidate', async (event) => {
      console.log('Received ICE candidate:', event);
      if (this.rtcPeerConnection) {
        try {
          const candidate = new RTCIceCandidate({
            sdpMLineIndex: event.label,
            candidate: event.candidate
          });
          await this.rtcPeerConnection.addIceCandidate(candidate);
          console.log('ICE candidate added successfully');
        } catch (error) {
          console.error('Error adding ICE candidate:', error);
        }
      }
    });

    this.socket.on('offer', async (param) => {
      console.log('Received offer from:', param.caller);
      this.caller = param.caller;

      // Ensure we have local stream before creating peer connection
      if (!this.localStream) {
        console.error('No local stream available when receiving offer');
        return;
      }

      this.createPeerConnection();

      try {
        await this.rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(param.event));
        console.log('Remote description set successfully');

        const answer = await this.rtcPeerConnection.createAnswer();
        console.log('Answer created successfully:', answer);

        await this.setLocalAndAnswer(answer);
      } catch (e) {
        console.error('Error handling offer:', e);
      }
    });

    this.socket.on('answer', async (event) => {
      console.log('Received answer:', event);
      if (this.rtcPeerConnection) {
        try {
          await this.rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(event));
          console.log('Answer set successfully');
        } catch (error) {
          console.error('Error setting answer:', error);
        }
      }
    });
  }

  async waitForConnection(timeout = 10000) {
    return new Promise((resolve, reject) => {
      if (this.socket.connected) {
        resolve();
        return;
      }

      const timeoutId = setTimeout(() => {
        reject(new Error('Connection timeout'));
      }, timeout);

      this.socket.once('connect', () => {
        clearTimeout(timeoutId);
        resolve();
      });

      this.socket.once('connect_error', (error) => {
        clearTimeout(timeoutId);
        reject(error);
      });
    });
  }

  async createCall() {
    try {
      console.log('Attempting to create call...');

      // Wait for socket connection
      await this.waitForConnection();

      return new Promise((resolve, reject) => {
        // Set a timeout for the socket response
        const timeout = setTimeout(() => {
          reject(new Error('Create call timeout'));
        }, 10000);

        this.socket.emit('create', (res) => {
          clearTimeout(timeout);
          console.log('Create call response:', res);
          this.caller = res;
          this.isCaller = true;
          resolve(res);
        });
      });
    } catch (error) {
      console.error('Failed to create call:', error);
      throw error;
    }
  }

  async joinCall(code) {
    try {
      console.log('Joining call with code:', code);

      // Wait for socket connection
      await this.waitForConnection();
      console.log('Socket connected, getting user media...');

      const stream = await navigator.mediaDevices.getUserMedia(this.streamConstraints);
      console.log('Got user media stream with tracks:', stream.getTracks().length);

      this.addLocalStream(stream);
      console.log('Emitting join event with code:', code);
      this.socket.emit('join', code);
      return stream;
    } catch (err) {
      console.error('An error occurred when accessing media devices', err);
      throw err;
    }
  }

  async startCall() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(this.streamConstraints);
      this.addLocalStream(stream);
      return stream;
    } catch (err) {
      console.log('An error occurred when accessing media devices', err);
      throw err;
    }
  }

  onIceCandidate = (event) => {
    const id = this.isCaller ? this.receiver : this.caller;
    console.log('ICE candidate event:', event.candidate ? 'has candidate' : 'no candidate', 'sending to:', id);

    if (event.candidate) {
      console.log('Sending ICE candidate:', event.candidate.candidate);
      this.socket.emit('candidate', {
        type: 'candidate',
        label: event.candidate.sdpMLineIndex,
        id: event.candidate.sdpMid,
        candidate: event.candidate.candidate,
        sendTo: id
      });
    } else {
      console.log('ICE gathering complete');
    }
  }

  onTrack = (event) => {
    console.log('Received remote track:', event.track.kind);
    if (event.streams && event.streams[0]) {
      this.remoteStream = event.streams[0];
      console.log('Remote stream received with tracks:', this.remoteStream.getTracks().length);
      // Emit event for React components to handle
      this.onRemoteStreamReceived?.(this.remoteStream);
    }
  }

  // Keep the old method for backward compatibility but update it
  onAddStream = (event) => {
    console.log('Received remote stream (deprecated API):', event.stream);
    this.remoteStream = event.stream;
    // Emit event for React components to handle
    this.onRemoteStreamReceived?.(event.stream);
  }

  async setLocalAndOffer(sessionDescription) {
    try {
      // Optimize SDP for high-quality stereo audio
      sessionDescription.sdp = sessionDescription.sdp.replace(
        'useinbandfec=1', 
        'useinbandfec=1; stereo=1; maxaveragebitrate=510000'
      );
      
      await this.rtcPeerConnection.setLocalDescription(sessionDescription);
      console.log('Local description set, sending offer to', this.receiver);

      this.socket.emit('offer', {
        type: 'offer',
        sdp: sessionDescription,
        receiver: this.receiver
      });
      console.log('Offer sent successfully');
    } catch (error) {
      console.error('Error setting local description for offer:', error);
    }
  }

  async setLocalAndAnswer(sessionDescription) {
    try {
      // Optimize SDP for high-quality stereo audio
      sessionDescription.sdp = sessionDescription.sdp.replace(
        'useinbandfec=1', 
        'useinbandfec=1; stereo=1; maxaveragebitrate=510000'
      );
      
      await this.rtcPeerConnection.setLocalDescription(sessionDescription);
      console.log('Local description set, sending answer to', this.caller);

      this.socket.emit('answer', {
        type: 'answer',
        sdp: sessionDescription,
        caller: this.caller
      });
      console.log('Answer sent successfully');
    } catch (error) {
      console.error('Error setting local description for answer:', error);
    }
  }

  addLocalStream(stream) {
    this.localStream = stream;
    // Emit event for React components to handle
    this.onLocalStreamReceived?.(stream);
  }

  createPeerConnection() {
    this.rtcPeerConnection = new RTCPeerConnection(this.iceServers);
    this.rtcPeerConnection.onicecandidate = this.onIceCandidate;

    // Use modern API instead of deprecated onaddstream
    this.rtcPeerConnection.ontrack = this.onTrack;

    // Add local stream tracks if available
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        this.rtcPeerConnection.addTrack(track, this.localStream);
      });
    }
  }

  // Mute/unmute functionality
  toggleMute() {
    if (this.localStream) {
      const audioTrack = this.localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        return !audioTrack.enabled; // Return muted state
      }
    }
    return false;
  }

  // End call functionality
  endCall() {
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
    }
    if (this.rtcPeerConnection) {
      this.rtcPeerConnection.close();
    }
    this.localStream = null;
    this.remoteStream = null;
    this.rtcPeerConnection = null;
    this.caller = null;
    this.receiver = null;
    this.isCaller = false;
  }

  // Event handlers for React components
  onLocalStreamReceived = null;
  onRemoteStreamReceived = null;
}

// Create a singleton instance
let webrtcServiceInstance = null;

const getWebRTCService = () => {
  if (!webrtcServiceInstance) {
    webrtcServiceInstance = new WebRTCService();
  }
  return webrtcServiceInstance;
};

export default getWebRTCService();