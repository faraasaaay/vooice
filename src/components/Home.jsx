import React from 'react';
import { SCREENS } from '../App';
import SocketTest from './SocketTest';

const Home = ({ onNavigate }) => {
  return (
    <div className="container">
      <div className="card">
        <div className="icon-container">
          📞
        </div>

        <h1 className="title">Voice Call</h1>
        <p className="subtitle">Connect with others through crystal clear voice calls</p>

        <button
          onClick={() => onNavigate(SCREENS.CREATE)}
          className="btn btn-primary"
        >
          Start New Call
        </button>

        <button
          onClick={() => onNavigate(SCREENS.JOIN)}
          className="btn btn-secondary"
        >
          Join Call
        </button>

        <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}>
          <SocketTest />
        </div>
      </div>
    </div>
  );
};

export default Home;
