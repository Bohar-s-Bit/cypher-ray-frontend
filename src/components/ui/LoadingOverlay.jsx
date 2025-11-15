import React from 'react';
import styled from 'styled-components';
import MatrixLoader from './MatrixLoader';

const LoadingOverlay = ({ isVisible = false, message = "Loading..." }) => {
  if (!isVisible) return null;

  return (
    <StyledWrapper>
      <div className="loading-overlay">
        <div className="loading-content">
          <MatrixLoader />
          <p className="loading-message">{message}</p>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, #060010 0%, #0a0015 50%, #060010 100%);
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    opacity: 0;
    animation: fadeIn 0.3s ease-in-out forwards;
  }

  .loading-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  .loading-message {
    color: #ffffff;
    font-family: 'Roboto', sans-serif;
    font-size: 1.2rem;
    margin-top: 1rem;
    opacity: 0.8;
    animation: pulse 2s infinite;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 0.6;
    }
    50% {
      opacity: 1;
    }
  }
`;

export default LoadingOverlay;