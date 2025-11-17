import React from 'react';
import styled from 'styled-components';

const GetStartedButton = ({ onClick, children, ...props }) => {
  return (
    <StyledWrapper>
      <button className="button" onClick={onClick} {...props}>
        <p>{children}</p>
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  width: 100%;
  
  .button {
    all: unset;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    padding: 0.6em 2em;
    border: #7808d0 solid 0.15em;
    border-radius: 0.25em;
    color: #7808d0;
    font-size: 1em;
    font-weight: 600;
    cursor: pointer;
    overflow: hidden;
    transition: border 300ms, color 300ms;
    user-select: none;
    width: 100%;
    box-sizing: border-box;
  }

  .button p {
    z-index: 1;
    margin: 0;
  }

  .button:hover {
    color: #212121;
  }

  .button:active {
    border-color: #5c0699;
  }

  .button::after, .button::before {
    content: "";
    position: absolute;
    width: 9em;
    aspect-ratio: 1;
    background: #7808d0;
    opacity: 50%;
    border-radius: 50%;
    transition: transform 500ms, background 300ms;
  }

  .button::before {
    left: 0;
    transform: translateX(-8em);
  }

  .button::after {
    right: 0;
    transform: translateX(8em);
  }

  .button:hover:before {
    transform: translateX(-1em);
  }

  .button:hover:after {
    transform: translateX(1em);
  }

  .button:active:before,
  .button:active:after {
    background: #5c0699;
  }
`;

export default GetStartedButton;
