import React from 'react';
import styled from 'styled-components';

const MatrixLoader = ({ fullscreen = false }) => {
  return (
    <StyledWrapper $fullscreen={fullscreen}>
      <div className="ai-matrix-loader">
        <div className="digit">0</div>
        <div className="digit">1</div>
        <div className="digit">0</div>
        <div className="digit">1</div>
        <div className="digit">1</div>
        <div className="digit">0</div>
        <div className="digit">0</div>
        <div className="digit">1</div>
        <div className="glow" />
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  ${props => props.$fullscreen && `
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #060010 0%, #0a0015 50%, #060010 100%);
    z-index: 9999;
  `}

  .ai-matrix-loader {
    width: 120px;
    height: 160px;
    margin: ${props => props.$fullscreen ? '0' : '30px auto'};
    position: relative;
    perspective: 800px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 5px;
  }

  .digit {
    color: #a855f7;
    font-family: 'Roboto', monospace;
    font-size: 18px;
    text-align: center;
    text-shadow: 0 0 5px #a855f7, 0 0 10px rgba(168, 85, 247, 0.5);
    animation:
      matrix-fall 2s infinite,
      matrix-flicker 0.5s infinite;
    opacity: 0;
  }

  .digit:nth-child(1) {
    animation-delay: 0.1s;
  }
  .digit:nth-child(2) {
    animation-delay: 0.3s;
  }
  .digit:nth-child(3) {
    animation-delay: 0.5s;
  }
  .digit:nth-child(4) {
    animation-delay: 0.7s;
  }
  .digit:nth-child(5) {
    animation-delay: 0.9s;
  }
  .digit:nth-child(6) {
    animation-delay: 1.1s;
  }
  .digit:nth-child(7) {
    animation-delay: 1.3s;
  }
  .digit:nth-child(8) {
    animation-delay: 1.5s;
  }

  .glow {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
      circle,
      rgba(168, 85, 247, 0.15) 0%,
      rgba(132, 0, 255, 0.1) 30%,
      transparent 70%
    );
    animation: matrix-pulse 2s infinite;
  }

  @keyframes matrix-fall {
    0% {
      transform: translateY(-50px) rotateX(90deg);
      opacity: 0;
    }
    20%,
    80% {
      transform: translateY(0) rotateX(0deg);
      opacity: 0.9;
    }
    100% {
      transform: translateY(50px) rotateX(-90deg);
      opacity: 0;
    }
  }

  @keyframes matrix-flicker {
    0%,
    19%,
    21%,
    100% {
      opacity: 0.9;
    }
    20% {
      opacity: 0.3;
    }
  }

  @keyframes matrix-pulse {
    0%,
    100% {
      opacity: 0.3;
    }
    50% {
      opacity: 0.8;
    }
  }
`;

export default MatrixLoader;
