import React, { useState, useEffect } from 'react';
import { SCREENS } from '../App';
import webrtcService from '../services/webrtc';

const CreateCall = ({ onNavigate, callCode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [currentCallCode, setCurrentCallCode] = useState(callCode);

  useEffect(() => {
    if (!currentCallCode) {
      generateCallCode();
    }
  }, []);

  const generateCallCode = async () => {
    console.log('generateCallCode called');
    setIsLoading(true);
    try {
      console.log('Calling webrtcService.createCall()...');
      const code = await webrtcService.createCall();
      console.log('Received call code:', code);
      setCurrentCallCode(code);
    } catch (error) {
      console.error('Failed to create call:', error);
      alert('Failed to create call: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentCallCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const testConnection = () => {
    console.log('Testing socket connection...');
    console.log('Socket connected:', webrtcService.socket.connected);
    console.log('Socket ID:', webrtcService.socket.id);
    console.log('Socket URL:', webrtcService.socket.io.uri);
    console.log('Socket transport:', webrtcService.socket.io.engine.transport.name);

    // Try to manually connect if not connected
    if (!webrtcService.socket.connected) {
      console.log('Attempting to connect...');
      webrtcService.socket.connect();
    }
  };

  const startCall = async () => {
    setIsLoading(true);
    try {
      await webrtcService.startCall();
      onNavigate(SCREENS.CALL);
    } catch (error) {
      console.error('Failed to start call:', error);
      alert('Failed to access microphone. Please check your permissions.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <div className="icon-container" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
          ➕
        </div>
        <h2 className="title">Create New Call</h2>
        <p className="subtitle">Share this code with others to join your call</p>

        {/* Call Code */}
        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem', textAlign: 'left' }}>
            Call Code
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              value={currentCallCode || ''}
              readOnly
              className="input"
              placeholder={isLoading ? "Generating..." : ""}
              style={{ background: '#f9fafb' }}
            />
            <button
              onClick={copyToClipboard}
              style={{
                position: 'absolute',
                right: '0.5rem',
                top: '50%',
                transform: 'translateY(-50%)',
                padding: '0.5rem',
                color: '#6b7280',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                transition: 'color 0.2s'
              }}
              disabled={!currentCallCode}
            >
              {copied ? '✓' : '📋'}
            </button>
          </div>
          {copied && (
            <p className="success-text">Code copied to clipboard!</p>
          )}
        </div>

        {/* Action Buttons */}
        <button
          onClick={startCall}
          disabled={isLoading || !currentCallCode}
          className="btn btn-success"
          style={{ opacity: (isLoading || !currentCallCode) ? 0.5 : 1, cursor: (isLoading || !currentCallCode) ? 'not-allowed' : 'pointer' }}
        >
          {isLoading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div className="animate-spin" style={{ width: '1.25rem', height: '1.25rem', border: '2px solid transparent', borderTop: '2px solid white', borderRadius: '50%', marginRight: '0.5rem' }}></div>
              Starting...
            </div>
          ) : (
            'Start Call'
          )}
        </button>

        <button
          onClick={() => onNavigate(SCREENS.HOME)}
          className="btn btn-secondary"
        >
          Back to Home
        </button>

        <button
          onClick={testConnection}
          className="btn"
          style={{ background: '#6b7280', color: 'white', fontSize: '0.875rem', padding: '0.5rem 1rem' }}
        >
          Test Connection
        </button>

        <div className="info-box">
          <p className="info-title">How to use:</p>
          <p className="info-text">
            1. Copy the call code above<br/>
            2. Share it with the person you want to call<br/>
            3. Click "Start Call" when ready
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateCall;
