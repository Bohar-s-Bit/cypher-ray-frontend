import React from 'react';
import styled from 'styled-components';

const LoginButton = ({ onClick, children, ...props }) => {
  return (
    <StyledWrapper>
      <button className="cssbuttons-io" onClick={onClick} {...props}>
        <span>
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0h24v24H0z" fill="none" />
            <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 6.5V7.5C15 8.3 14.3 9 13.5 9S12 8.3 12 7.5V6.5L9 7V9C9 10.1 8.1 11 7 11S5 10.1 5 9V7.5L3 8V16C3 17.1 3.9 18 5 18H7C7.6 18 8.1 17.6 8.3 17H15.7C15.9 17.6 16.4 18 17 18H19C20.1 18 21 17.1 21 16V9ZM7.5 12C7.8 12 8 12.2 8 12.5S7.8 13 7.5 13 7 12.8 7 12.5 7.2 12 7.5 12ZM16.5 12C16.8 12 17 12.2 17 12.5S16.8 13 16.5 13 16 12.8 16 12.5 16.2 12 16.5 12Z" fill="currentColor" />
          </svg>
          {children}
        </span>
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  width: 100%;
  
  .cssbuttons-io {
    position: relative;
    font-family: inherit;
    font-weight: 500;
    font-size: 16px;
    letter-spacing: 0.05em;
    border-radius: 0.8em;
    cursor: pointer;
    border: none;
    background: linear-gradient(to right, #6b7280, #4b5563);
    color: ghostwhite;
    overflow: hidden;
    width: 100%;
    box-sizing: border-box;
  }

  .cssbuttons-io svg {
    width: 1.2em;
    height: 1.2em;
    margin-right: 0.5em;
  }

  .cssbuttons-io span {
    position: relative;
    z-index: 10;
    transition: color 0.4s;
    display: inline-flex;
    align-items: center;
    padding: 0.8em 1.2em 0.8em 1.05em;
  }

  .cssbuttons-io::before,
  .cssbuttons-io::after {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
  }

  .cssbuttons-io::before {
    content: "";
    background: #000;
    width: 120%;
    left: -10%;
    transform: skew(30deg);
    transition: transform 0.4s cubic-bezier(0.3, 1, 0.8, 1);
  }

  .cssbuttons-io:hover::before {
    transform: translate3d(100%, 0, 0);
  }

  .cssbuttons-io:active {
    transform: scale(0.95);
  }
`;

export default LoginButton;
