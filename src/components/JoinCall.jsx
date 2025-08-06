import React, { useState } from 'react';
import { SCREENS } from '../App';
import webrtcService from '../services/webrtc';

const JoinCall = ({ onNavigate }) => {
  const [callCode, setCallCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleJoinCall = async () => {
    if (!callCode.trim()) {
      setError('Please enter a call code');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      await webrtcService.joinCall(callCode.trim());
      onNavigate(SCREENS.CALL);
    } catch (error) {
      console.error('Failed to join call:', error);
      setError('Failed to join call. Please check your microphone permissions and call code.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setCallCode(e.target.value);
    if (error) setError('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleJoinCall();
    }
  };

  return (
    <div className="container">
      <div className="card">
        <div className="icon-container" style={{ background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)' }}>
          🔗
        </div>
        <h2 className="title">Join Call</h2>
        <p className="subtitle">Enter the call code to join an existing call</p>

        {/* Call Code Input */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem', textAlign: 'left' }}>
            Call Code
          </label>
          <input
            type="text"
            value={callCode}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Enter call code here..."
            className="input"
            style={{
              borderColor: error ? '#fca5a5' : '#e5e7eb',
              background: error ? '#fef2f2' : 'white'
            }}
            disabled={isLoading}
          />
          {error && (
            <p className="error-text" style={{ textAlign: 'left' }}>{error}</p>
          )}
        </div>

        {/* Action Buttons */}
        <button
          onClick={handleJoinCall}
          disabled={isLoading || !callCode.trim()}
          className="btn"
          style={{
            background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
            color: 'white',
            opacity: (isLoading || !callCode.trim()) ? 0.5 : 1,
            cursor: (isLoading || !callCode.trim()) ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div className="animate-spin" style={{ width: '1.25rem', height: '1.25rem', border: '2px solid transparent', borderTop: '2px solid white', borderRadius: '50%', marginRight: '0.5rem' }}></div>
              Joining...
            </div>
          ) : (
            'Join Call'
          )}
        </button>

        <button
          onClick={() => onNavigate(SCREENS.HOME)}
          className="btn btn-secondary"
        >
          Back to Home
        </button>

        <div style={{ background: '#faf5ff', borderRadius: '0.75rem', padding: '1rem', marginTop: '1.5rem' }}>
          <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#7c3aed' }}>Need help?</p>
          <p style={{ fontSize: '0.75rem', color: '#7c3aed', marginTop: '0.25rem', lineHeight: '1.4' }}>
            Ask the person who created the call to share their call code with you.
          </p>
        </div>
      </div>
    </div>
  );
};

export default JoinCall;
