import React from 'react';
import Chat from './components/Chat';
import './styles.css';

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-left">
          <div className="logo">🤖</div>
          <h1>PB- Anshul</h1>
        </div>
        <nav className="header-menu">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>
      <Chat />
    </div>
  );
}

export default App;
