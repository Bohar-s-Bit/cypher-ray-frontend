import React from 'react';
import styled from 'styled-components';

const HoverButton = ({ children, onClick, type = 'button', disabled = false }) => {
  return (
    <StyledWrapper>
      <button onClick={onClick} type={type} disabled={disabled}>
        <span>{children}</span>
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  button {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 8px;
    background: #7c3aed; /* purple-600 to match theme */
    font-family: "Montserrat", sans-serif;
    box-shadow: 0px 6px 24px 0px rgba(124, 58, 237, 0.3);
    overflow: hidden;
    cursor: pointer;
    border: none;
    width: 100%;
  }

  button:after {
    content: " ";
    width: 0%;
    height: 100%;
    background: #c084fc; /* purple-400 for hover effect */
    position: absolute;
    transition: all 0.4s ease-in-out;
    right: 0;
  }

  button:hover::after {
    right: auto;
    left: 0;
    width: 100%;
  }

  button span {
    text-align: center;
    text-decoration: none;
    width: 100%;
    padding: 16px 24px;
    color: #fff;
    font-size: 1em;
    font-weight: 700;
    letter-spacing: 0.2em;
    z-index: 20;
    transition: all 0.3s ease-in-out;
  }

  button:hover span {
    color: #581c87; /* purple-900 for contrast */
    animation: scaleUp 0.3s ease-in-out;
  }

  button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  button:disabled:hover::after {
    width: 0%;
  }

  @keyframes scaleUp {
    0% {
      transform: scale(1);
    }

    50% {
      transform: scale(0.95);
    }

    100% {
      transform: scale(1);
    }
  }
`;

export default HoverButton;

