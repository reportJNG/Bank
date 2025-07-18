import React, { useEffect, useState } from 'react';
import './Welcome.css';
import logo from '../Pictures/logo.png';

interface WelcomeProps {
  onNavigate: (page: 'signin' | 'welcome' | 'home') => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onNavigate }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Start the loading animation immediately\
    setIsLoaded(true);
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          // Navigate to home page after loading is complete
          setTimeout(() => {
            onNavigate('home');
          }, 500);
          return 100;
        }
        return prevProgress + 1;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [onNavigate]);

  return (
    <div className={`welcome-page ${isLoaded ? 'loaded' : ''}`}>
      <img 
        src={logo} 
        alt="Al Salam Bank Logo" 
        className="welcome-logo" 
      />
      <div className="welcome-content">
        <div className="welcome-text-container">
          <div className="welcome-title">
            <h1 className="welcome-title-main">Al Salam Bank</h1>
            <h2 className="welcome-title-sub">Welcome to Excellence</h2>
          </div>
          <p className="welcome-message">Your trusted partner in financial excellence</p>
        </div>
        <div className="loading-container">
          
          <div className="loading-bar">
            <div className="loading-progress" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome; 