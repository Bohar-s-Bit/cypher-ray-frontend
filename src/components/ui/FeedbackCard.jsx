import React, { useState } from 'react';
import styled from 'styled-components';

const FeedbackCard = () => {
  const [rating, setRating] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = () => {
    console.log('Rating:', rating, 'Feedback:', feedback);
    // Handle submission logic here
  };

  return (
    <StyledWrapper>
      <div className="content-wrapper">
        <div className="content">
          <div className="rating-star">
            <svg width={17} height={16} xmlns="http://www.w3.org/2000/svg">
              <path d="m9.067.43 1.99 4.031c.112.228.33.386.58.422l4.45.647a.772.772 0 0 1 .427 1.316l-3.22 3.138a.773.773 0 0 0-.222.683l.76 4.431a.772.772 0 0 1-1.12.813l-3.98-2.092a.773.773 0 0 0-.718 0l-3.98 2.092a.772.772 0 0 1-1.119-.813l.76-4.431a.77.77 0 0 0-.222-.683L.233 6.846A.772.772 0 0 1 .661 5.53l4.449-.647a.772.772 0 0 0 .58-.422L7.68.43a.774.774 0 0 1 1.387 0Z" fill="#7c3aed" />
            </svg>
          </div>
          <span className="title">How did we do?</span>
          <p className="text">
            Please let us know how we did with your support request. All feedback is
            appreciated to help us improve our offering!
          </p>
          <div className="rating">
            <input id="rate-1" className="radio" type="radio" name="rating" value="1" onChange={(e) => setRating(e.target.value)} />
            <label htmlFor="rate-1">1</label>
            <input id="rate-2" className="radio" type="radio" name="rating" value="2" onChange={(e) => setRating(e.target.value)} />
            <label htmlFor="rate-2">2</label>
            <input id="rate-3" className="radio" type="radio" name="rating" value="3" onChange={(e) => setRating(e.target.value)} />
            <label htmlFor="rate-3">3</label>
            <input id="rate-4" className="radio" type="radio" name="rating" value="4" onChange={(e) => setRating(e.target.value)} />
            <label htmlFor="rate-4">4</label>
            <input id="rate-5" className="radio" type="radio" name="rating" value="5" onChange={(e) => setRating(e.target.value)} />
            <label htmlFor="rate-5">5</label>
          </div>
          <textarea 
            className="feedback-textarea"
            placeholder="Tell us more about your experience..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={3}
          />
          <button className="button" onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .content-wrapper .content {
    background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #0f0f23 100%);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    color: #ffffff;
    width: 20rem;
    height: 24rem;
    padding: 20px;
    border-radius: 30px;
    border: 1px solid rgba(124, 58, 237, 0.2);
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  }

  .rating-star {
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, rgba(124, 58, 237, 0.2), rgba(168, 85, 247, 0.2));
    border-radius: 50%;
    border: 1px solid rgba(124, 58, 237, 0.3);
  }

  .title {
    font-size: 20px;
    font-weight: 700;
    color: #ffffff;
  }

  .text {
    font-size: 15px;
    font-weight: 400;
    line-height: 1.3;
    color: #a3a3a3;
  }

  .rating {
    display: flex;
    justify-content: space-between;
    margin: 10px 0;
  }

  .rating label {
    cursor: pointer;
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, rgba(124, 58, 237, 0.4), rgba(168, 85, 247, 0.4));
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 600;
    color: #ffffff;
    transition: all 0.3s ease;
  }

  .rating label:hover {
    background: linear-gradient(135deg, #7c3aed, #a855f7);
    transform: scale(1.1);
  }

  .rating input[type="radio"] {
    display: none;
  }

  .rating input[type="radio"]:checked + label {
    background: linear-gradient(135deg, #a855f7, #c084fc);
    color: #1e1b4b;
    font-weight: 700;
    transform: scale(1.1);
  }

  .feedback-textarea {
    width: 100%;
    background: rgba(124, 58, 237, 0.1);
    border: 1px solid rgba(124, 58, 237, 0.3);
    border-radius: 15px;
    padding: 12px;
    color: #ffffff;
    font-size: 14px;
    resize: none;
    outline: none;
    margin: 10px 0;
    transition: all 0.3s ease;
  }

  .feedback-textarea::placeholder {
    color: #c4b5fd;
  }

  .feedback-textarea:focus {
    border-color: #7c3aed;
    box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
  }

  .button {
    background: linear-gradient(135deg, #7c3aed, #a855f7);
    color: #ffffff;
    font-weight: 700;
    text-transform: uppercase;
    width: 100%;
    padding: 12px;
    border-radius: 30px;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .button:hover {
    background: linear-gradient(135deg, #a855f7, #c084fc);
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(124, 58, 237, 0.3);
  }
`;

export default FeedbackCard;
