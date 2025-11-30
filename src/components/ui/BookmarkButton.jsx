import React from 'react';
import styled from 'styled-components';
import { User } from 'lucide-react';

const BookmarkButton = ({ 
  onClick, 
  text = "Get Started", 
  icon: Icon = User,
  width = "160px",
  height = "40px",
  iconSize = "30px",
  fontSize = "1em"
}) => {
  return (
    <StyledWrapper 
      $width={width} 
      $height={height} 
      $iconSize={iconSize}
      $fontSize={fontSize}
    >
      <button className="bookmarkBtn" onClick={onClick}>
        <span className="IconContainer">
          <Icon className="icon" size={parseInt(iconSize) * 0.5} />
        </span>
        <p className="text">{text}</p>
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .bookmarkBtn {
    width: ${props => props.$width};
    height: ${props => props.$height};
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
    width: ${props => props.$iconSize};
    height: ${props => props.$iconSize};
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
    width: calc(${props => props.$width} - ${props => props.$iconSize} - 10px);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    z-index: 1;
    transition-duration: 0.3s;
    font-size: ${props => props.$fontSize};
    margin: 0;
    font-family: 'Roboto', sans-serif;
  }

  .bookmarkBtn:hover .IconContainer {
    width: calc(${props => props.$width} - 10px);
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
