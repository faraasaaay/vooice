import React, { useState } from 'react';
import Home from './components/Home';
import CreateCall from './components/CreateCall';
import JoinCall from './components/JoinCall';
import VoiceCall from './components/VoiceCall';
import './App.css';

const SCREENS = {
  HOME: 'home',
  CREATE: 'create',
  JOIN: 'join',
  CALL: 'call'
};

function App() {
  const [currentScreen, setCurrentScreen] = useState(SCREENS.HOME);
  const [callCode, setCallCode] = useState('');

  const navigateToScreen = (screen, code = '') => {
    setCurrentScreen(screen);
    if (code) setCallCode(code);
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case SCREENS.HOME:
        return <Home onNavigate={navigateToScreen} />;
      case SCREENS.CREATE:
        return <CreateCall onNavigate={navigateToScreen} callCode={callCode} />;
      case SCREENS.JOIN:
        return <JoinCall onNavigate={navigateToScreen} />;
      case SCREENS.CALL:
        return <VoiceCall onNavigate={navigateToScreen} />;
      default:
        return <Home onNavigate={navigateToScreen} />;
    }
  };

  return (
    <div>
      {renderCurrentScreen()}
    </div>
  );
}

export { SCREENS };
export default App;
