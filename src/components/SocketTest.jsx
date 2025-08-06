import { useState, useEffect } from 'react';
import io from 'socket.io-client';

const SocketTest = () => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [callCode, setCallCode] = useState('');
  const [status, setStatus] = useState('Initializing...');

  useEffect(() => {
    console.log('Creating socket connection...');
    const newSocket = io({
      transports: ['websocket', 'polling'],
      timeout: 20000
    });

    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
      setConnected(true);
      setStatus('Connected');
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
      setConnected(false);
      setStatus('Disconnected');
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setConnected(false);
      setStatus('Connection Error: ' + error.message);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const testCreateCall = () => {
    if (!socket || !connected) {
      alert('Socket not connected');
      return;
    }

    console.log('Testing create call...');
    socket.emit('create', (response) => {
      console.log('Create call response:', response);
      setCallCode(response);
    });
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto' }}>
      <h2>Socket Connection Test</h2>
      <div style={{ marginBottom: '1rem' }}>
        <strong>Status:</strong> {status}
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <strong>Connected:</strong> {connected ? 'Yes' : 'No'}
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <strong>Socket ID:</strong> {socket?.id || 'None'}
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <strong>Call Code:</strong> {callCode || 'None'}
      </div>
      <button 
        onClick={testCreateCall}
        disabled={!connected}
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: connected ? '#10b981' : '#6b7280',
          color: 'white',
          border: 'none',
          borderRadius: '0.5rem',
          cursor: connected ? 'pointer' : 'not-allowed'
        }}
      >
        Test Create Call
      </button>
    </div>
  );
};

export default SocketTest;
