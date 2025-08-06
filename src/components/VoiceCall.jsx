import React, { useState, useEffect, useRef } from 'react';
import { SCREENS } from '../App';
import webrtcService from '../services/webrtc';

const VoiceCall = ({ onNavigate }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');
  const [volume, setVolume] = useState(1.0);
  
  const localAudioRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const callStartTimeRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    console.log('VoiceCall component mounted, setting up WebRTC event handlers');

    // Set up WebRTC event handlers
    webrtcService.onLocalStreamReceived = (stream) => {
      console.log('Local stream received in VoiceCall component:', stream);
      console.log('Audio tracks in local stream:', stream.getAudioTracks().length);

      if (localAudioRef.current) {
        localAudioRef.current.srcObject = stream;
      }
      setConnectionStatus('Waiting for other person...');
    };

    webrtcService.onRemoteStreamReceived = (stream) => {
      console.log('Remote stream received in VoiceCall component:', stream);
      console.log('Audio tracks in remote stream:', stream.getAudioTracks().length);

      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = stream;
        remoteAudioRef.current.volume = volume;

        // Ensure audio plays
        remoteAudioRef.current.play().catch(e => {
          console.error('Error playing remote audio:', e);
        });
      }
      setIsConnected(true);
      setConnectionStatus('Connected');
      startCallTimer();
    };

    // Debug: Check if handlers are set
    console.log('Event handlers set:', {
      onLocalStreamReceived: !!webrtcService.onLocalStreamReceived,
      onRemoteStreamReceived: !!webrtcService.onRemoteStreamReceived
    });

    // Debug: Check WebRTC service state
    console.log('WebRTC service state:', {
      hasLocalStream: !!webrtcService.localStream,
      hasRemoteStream: !!webrtcService.remoteStream,
      hasPeerConnection: !!webrtcService.rtcPeerConnection,
      socketConnected: webrtcService.socket?.connected,
      isCaller: webrtcService.isCaller
    });

    return () => {
      // Cleanup
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      webrtcService.onLocalStreamReceived = null;
      webrtcService.onRemoteStreamReceived = null;
    };
  }, []);

  const startCallTimer = () => {
    callStartTimeRef.current = Date.now();
    intervalRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - callStartTimeRef.current) / 1000);
      setCallDuration(elapsed);
    }, 1000);
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleMute = () => {
    const muted = webrtcService.toggleMute();
    setIsMuted(muted);
  };

  const handleVolumeChange = (event) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
    if (remoteAudioRef.current) {
      remoteAudioRef.current.volume = newVolume;
    }
  };

  const endCall = () => {
    webrtcService.endCall();
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    onNavigate(SCREENS.HOME);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)', padding: '1rem' }}>
      <div style={{ background: 'white', borderRadius: '1.5rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', padding: '2rem', maxWidth: '400px', width: '100%', textAlign: 'center' }}>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{
            width: '6rem',
            height: '6rem',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            background: isConnected ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            fontSize: '2rem'
          }}>
            {isConnected ? '📞' : '⏳'}
          </div>

          <h2 className="title">Voice Call</h2>
          <p style={{
            fontSize: '0.875rem',
            fontWeight: '500',
            color: isConnected ? '#059669' : '#d97706'
          }}>
            {connectionStatus}
          </p>

          {isConnected && (
            <p style={{ fontSize: '1.125rem', fontFamily: 'monospace', color: '#6b7280', marginTop: '0.5rem' }}>
              {formatDuration(callDuration)}
            </p>
          )}
        </div>

        {/* Audio Elements (hidden) */}
        <audio ref={localAudioRef} autoPlay muted />
        <audio
          ref={remoteAudioRef}
          autoPlay
          playsInline
          controls={false}
          style={{ display: 'none' }}
        />

        <div className="call-controls">
          <button
            onClick={toggleMute}
            className={`control-btn ${isMuted ? 'mute-btn muted' : 'mute-btn'}`}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? '🔇' : '🔊'}
          </button>

          <button
            onClick={endCall}
            className="control-btn end-btn"
            title="End Call"
          >
            ❌
          </button>
        </div>

        {/* Volume Control */}
        <div style={{ margin: '1.5rem 0', padding: '0 1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1rem' }}>🔉</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              className="volume-slider"
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${volume * 100}%, #e5e7eb ${volume * 100}%, #e5e7eb 100%)`
              }}
            />
            <span style={{ fontSize: '1rem' }}>🔊</span>
          </div>
          <div style={{ textAlign: 'center', fontSize: '0.75rem', color: '#6b7280', fontWeight: '500' }}>
            Volume: {Math.round(volume * 100)}%
          </div>
        </div>

        {/* Status Indicators */}
        <div className="status-grid">
          <div className="status-item">
            <div className={`status-dot ${isMuted ? 'red' : 'green'}`}></div>
            <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
              {isMuted ? 'Muted' : 'Unmuted'}
            </span>
          </div>

          <div className="status-item">
            <div className={`status-dot ${isConnected ? 'green' : 'yellow'}`}></div>
            <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
              {isConnected ? 'Connected' : 'Connecting'}
            </span>
          </div>
        </div>

        {!isConnected && (
          <div className="info-box">
            <p className="info-title">Waiting for connection</p>
            <p className="info-text">
              Make sure the other person has joined the call using your call code.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceCall;
