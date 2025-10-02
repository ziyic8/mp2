// src/components/Loading/Loading.tsx
import React from 'react';
import './Loading.css';

interface LoadingProps {
  message?: string;
}

const Loading: React.FC<LoadingProps> = ({ message = 'Loading...' }) => {
  return (
    <div className="loading-container">
      <div className="pokeball-loader">
        <div className="pokeball">
          <div className="pokeball-button"></div>
        </div>
      </div>
      <p className="loading-text">{message}</p>
    </div>
  );
};

export default Loading;