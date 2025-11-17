import React from 'react';
import styled from 'styled-components';

const StyledButton = ({ 
  children, 
  onClick, 
  color = '#7808d0',
  size = 'md',
  className,
  icon = 'arrow', // 'arrow' or 'user'
  ...props 
}) => {
  const iconSize = size === 'sm' ? 16 : size === 'lg' ? 24 : 20;
  
  const renderIcon = () => {
    if (icon === 'user') {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={iconSize} height={iconSize}>
          <path fill="none" d="M0 0h24v24H0z" />
          <path fill="currentColor" d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 6.5V7.5C15 8.3 14.3 9 13.5 9S12 8.3 12 7.5V6.5L9 7V9C9 10.1 8.1 11 7 11S5 10.1 5 9V7.5L3 8V16C3 17.1 3.9 18 5 18H7C7.6 18 8.1 17.6 8.3 17H15.7C15.9 17.6 16.4 18 17 18H19C20.1 18 21 17.1 21 16V9ZM7.5 12C7.8 12 8 12.2 8 12.5S7.8 13 7.5 13 7 12.8 7 12.5 7.2 12 7.5 12ZM16.5 12C16.8 12 17 12.2 17 12.5S16.8 13 16.5 13 16 12.8 16 12.5 16.2 12 16.5 12Z" />
        </svg>
      );
    }
    // Default arrow icon
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={iconSize} height={iconSize}>
        <path fill="none" d="M0 0h24v24H0z" />
        <path fill="currentColor" d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z" />
      </svg>
    );
  };
  
  return (
    <StyledWrapper color={color} size={size} className={className}>
      <button onClick={onClick} {...props}>
        <div className="svg-wrapper-1">
          <div className="svg-wrapper">
            {renderIcon()}
          </div>
        </div>
        <span>{children}</span>
      </button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  width: ${props => props.className && props.className.includes('w-full') ? '100%' : 'auto'};
  position: relative;
  z-index: 10;
  
  button {
    font-family: inherit !important;
    font-size: ${props => props.size === 'sm' ? '14px' : props.size === 'lg' ? '18px' : '16px'} !important;
    background: ${props => props.color} !important;
    color: white !important;
    padding: ${props => props.size === 'sm' ? '0.5em 0.8em' : props.size === 'lg' ? '0.8em 1.2em' : '0.7em 1em'} !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    border: none !important;
    border-radius: ${props => props.size === 'sm' ? '12px' : '16px'} !important;
    overflow: hidden !important;
    transition: all 0.2s !important;
    cursor: pointer !important;
    font-weight: 600 !important;
    white-space: nowrap !important;
    width: 100% !important;
    position: relative !important;
    z-index: 10 !important;
    pointer-events: auto !important;
  }

  button span {
    display: block !important;
    margin-left: 0.3em !important;
    transition: transform 0.35s ease-in-out, opacity 0.25s ease-in-out !important;
    pointer-events: none !important;
  }

  button svg {
    display: block !important;
    transform-origin: center center !important;
    transition: transform 0.3s ease-in-out !important;
    pointer-events: none !important;
  }

  .svg-wrapper-1, .svg-wrapper {
    pointer-events: none !important;
    transition: all 0.3s ease-in-out !important;
  }

  button:hover .svg-wrapper-1 {
    position: absolute !important;
    left: 50% !important;
    top: 50% !important;
    transform: translate(-50%, -50%) !important;
    animation: fly-1 0.6s ease-in-out infinite alternate !important;
  }

  button:hover .svg-wrapper {
    animation: fly-1 0.6s ease-in-out infinite alternate !important;
  }

  /* Center the icon when text slides out and add subtle rotation.
     Slide the label far to the right and fade it out so only the SVG icon remains visible. */
  button:hover svg {
    transform: rotate(12deg) scale(1.03) !important;
  }

  button:hover span {
    transform: translateX(200%) !important;
    opacity: 0 !important;
  }

  button:active {
    transform: scale(0.95) !important;
  }

  @keyframes fly-1 {
    from {
      transform: translateY(0.1em);
    }

    to {
      transform: translateY(-0.1em);
    }
  }
`;

export default StyledButton;
