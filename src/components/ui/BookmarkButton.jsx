import React from 'react';
import styled from 'styled-components';
import { User } from 'lucide-react';

const BookmarkButton = ({ onClick, text = "Get Started" }) => {
  return (
    <StyledWrapper>
      <button className="bookmarkBtn" onClick={onClick}>
        <span className="IconContainer">
          <User className="icon" size={14} />
        </span>
        <p className="text">{text}</p>
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .bookmarkBtn {
    width: 140px;
    height: 40px;
    border-radius: 40px;
    border: 1px solid rgba(120, 8, 208, 0.4);
    background-color: #0a0015;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition-duration: 0.3s;
    overflow: hidden;
    font-family: 'Roboto', sans-serif;
  }

  .IconContainer {
    width: 30px;
    height: 30px;
    background: linear-gradient(to bottom, #7808d0, #a855f7);
    border-radius: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    z-index: 2;
    transition-duration: 0.3s;
  }

  .icon {
    color: white;
    border-radius: 1px;
  }

  .text {
    height: 100%;
    width: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    z-index: 1;
    transition-duration: 0.3s;
    font-size: 1em;
    margin: 0;
    font-family: 'Roboto', sans-serif;
  }

  .bookmarkBtn:hover .IconContainer {
    width: 130px;
    transition-duration: 0.3s;
  }

  .bookmarkBtn:hover .text {
    transform: translate(10px);
    width: 0;
    font-size: 0;
    transition-duration: 0.3s;
  }

  .bookmarkBtn:active {
    transform: scale(0.95);
    transition-duration: 0.3s;
  }

  .bookmarkBtn:hover {
    border-color: rgba(120, 8, 208, 0.8);
    box-shadow: 0 0 15px rgba(120, 8, 208, 0.3);
  }
`;

export default BookmarkButton;