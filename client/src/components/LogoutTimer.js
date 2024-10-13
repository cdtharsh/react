// src/components/LogoutTimer.js

import React, { useEffect, useState } from 'react';

const LogoutTimer = () => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const loginTime = localStorage.getItem('loginTime');
    const currentTime = Date.now();
    const expirationTime = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    const timeElapsed = currentTime - loginTime;

    if (timeElapsed < expirationTime) {
      setTimeLeft(expirationTime - timeElapsed);
      const interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1000) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1000;
        });
      }, 1000);

      return () => clearInterval(interval);
    } else {
      // If expired, clear the token and username
      localStorage.removeItem('token');
      localStorage.removeItem('loginTime');
      localStorage.removeItem('username');
    }
  }, []);

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <div>
      {timeLeft > 0 ? (
        <p>Logged in for: {formatTime(timeLeft)}</p>
      ) : (
        <p>Your session has expired.</p>
      )}
    </div>
  );
};

export default LogoutTimer;
